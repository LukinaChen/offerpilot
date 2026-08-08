// OfferPilot eval harness — consistency evaluation for the resume-JD analysis feature
// Usage: ANTHROPIC_API_KEY=sk-ant-... node run_evals.mjs
import { readFileSync, writeFileSync } from "fs";

const KEY = process.env.ANTHROPIC_API_KEY;
if (!KEY) { console.error("Set ANTHROPIC_API_KEY"); process.exit(1); }
const RUNS = 3;
const { resume, pairs } = JSON.parse(readFileSync("golden_set.json", "utf8"));

async function analyze(jd) {
  const prompt = `You are an ATS-style resume-JD analyzer. Score the fit of RESUME against JD.
Reply ONLY with JSON: {"match":<0-100 int>,"must":["<up to 5 hard requirements from the JD, 2-5 words each>"]}
RESUME:\n${resume}\n\nJD:\n${jd}`;
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 300, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const text = data.content.filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

const jaccard = (a, b) => {
  const A = new Set(a.map(x => x.toLowerCase())), B = new Set(b.map(x => x.toLowerCase()));
  const inter = [...A].filter(x => B.has(x)).length;
  return inter / (A.size + B.size - inter || 1);
};

const rows = [];
for (const p of pairs) {
  const scores = [], musts = [];
  for (let r = 0; r < RUNS; r++) {
    try { const out = await analyze(p.jd); scores.push(out.match); musts.push(out.must || []); }
    catch (e) { console.error(p.id, "run", r, "failed:", e.message); }
  }
  if (!scores.length) continue;
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const range = Math.max(...scores) - Math.min(...scores);
  const sd = Math.sqrt(scores.reduce((s, x) => s + (x - mean) ** 2, 0) / scores.length);
  const jac = musts.length > 1 ? (jaccard(musts[0], musts[1]) + jaccard(musts[0], musts[2] || musts[1]) + jaccard(musts[1], musts[2] || musts[0])) / 3 : 1;
  const inBand = mean >= p.expect_band[0] && mean <= p.expect_band[1];
  rows.push({ id: p.id, scores, mean: mean.toFixed(1), range, sd: sd.toFixed(1), jac: jac.toFixed(2), inBand });
  console.log(`${p.id}: scores=[${scores}] range=${range} jaccard=${jac.toFixed(2)} inBand=${inBand}`);
}

const passRange = rows.filter(r => r.range <= 12).length, passJac = rows.filter(r => +r.jac >= 0.6).length, passBand = rows.filter(r => r.inBand).length;
let md = `# Eval Results — ${new Date().toISOString().split("T")[0]}\n\nModel: claude-sonnet-4-6 · Runs per pair: ${RUNS}\n\n| Pair | Scores | Mean | Range | SD | Must-have Jaccard | In expected band |\n|---|---|---|---|---|---|---|\n`;
for (const r of rows) md += `| ${r.id} | ${r.scores.join("/")} | ${r.mean} | ${r.range} | ${r.sd} | ${r.jac} | ${r.inBand ? "✅" : "⚠️"} |\n`;
md += `\n**Summary:** score stability (range ≤12): ${passRange}/${rows.length} · must-have consistency (Jaccard ≥0.6): ${passJac}/${rows.length} · within expected band: ${passBand}/${rows.length}\n`;
writeFileSync("results.md", md);
console.log("\nWritten to results.md");
