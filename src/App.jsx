import { useState, useEffect, useMemo } from "react";
// OFFERPILOT_VERSION: v0.3.3 (v0.3.1 + lookup-mode search + in-app help guide)
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Tooltip, CartesianGrid } from "recharts";

const I18N = {
  zh: {
    greeting: "你好！", subtitle: "追踪你的 PM & Product Designer 求职进度",
    dashboard: "概览", jobs: "岗位", pipeline: "看板",
    refresh: "抓取最新", refreshing: "抓取中...",
    tracked: "跟踪岗位", applied: "已投递", referralsActive: "内推中", interviews: "面试", offers: "Offer",
    funnel: "管道漏斗", recentActivity: "最近动态", roleSplit: "类型分布", weeklyTrend: "本周趋势",
    activityAssigned: "求职活动分布", distribution: "阶段分布",
    noActivity: "还没有投递记录",
    searchPlaceholder: "搜索公司、职位...", all: "全部",
    stageCol: "状态", company: "公司", location: "地点", typeCol: "类型", postedCol: "发布", jobCol: "岗位",
    empty: "空", noMatch: "没有匹配的岗位",
    jobDetails: "岗位详情", openOriginal: "查看原始链接", jobTitle: "职位名称",
    stage: "阶段", referralContact: "内推联系人", tags: "标签",
    tagPlaceholder: "按 Enter 添加", add: "添加",
    notes: "备注", notesPlaceholder: "进度备忘...",
    save: "保存", delete: "删除", addNew: "添加新岗位",
    link: "链接", saveBtn: "保存",
    fetchOk: (t, n) => `✓ 抓到 ${t} 个，新增 ${n} 个`,
    fetchNone: "没有新岗位", fetchFail: "抓取失败", fetchBlocked: "浏览器安全策略拦截了实时抓取 — 让 Claude 帮你更新数据即可",
    windows: { "24h": "24小时", "7d": "7天内", "30d": "30天内", "all": "全部" },
    h1bLikely: "H1B✓", h1bNoIntl: "仅限美国人", h1bStaffing: "猎头", h1bFilter: "只看H1B友好", externalSearch: "站外搜索:",
    confirmDelete: (ti, co) => `确定删除「${ti} @ ${co}」？删除后不可恢复。`, channels: "直通车", cancel: "取消", confirmBtn: "确认删除",
    lab: "简历工坊", myResume: "我的基线简历", resumeHint: "粘贴你简历的完整文本（一次保存，反复使用；随简历更新随时替换）", resumeSaved: "已保存 · ", resumeSave: "保存简历", chars: "字",
    jdAnalysis: "JD 分析", jdHint: "粘贴目标岗位的完整 JD 文本", jdCompany: "公司（留空自动识别）", jdTitle: "职位（留空自动识别）", analyze: "生成分析报告", analyzing: "分析中（约20秒）...",
    needResume: "请先在上方保存你的简历", needJD: "请粘贴 JD 文本",
    reportHistory: "历史报告", noReports: "还没有分析过 JD", reopen: "查看", delReport: "删除",
    matchScore: "匹配度", verdict: "投递建议", mustHaves: "硬性要求逐条对照", gaps: "Gap 与补救", tailored: "简历定向改写建议", questions: "预测面试题", h1bFlags: "身份/签证信号", assumptions: "本报告的假设", levelCheck: "级别判断",
    hit: "✓ 命中", partial: "◐ 部分", miss: "✗ 缺失",
    analyzeFail: "分析失败（已自动重试2次）。请稍等几秒再点一次；若持续失败请告诉 Claude 报错情况。",
    tailorNote: "改写只重组你简历中已有的事实，绝不虚构。数字若标 [待确认]，请核实后再用。",
    myPortfolio: "作品集（UX/PD 投递用）", portfolioHint: "粘贴项目简介（推荐）或作品集网址；保存一次反复使用", portfolioPlaceholder: "项目1: 智能家居App重设计, 负责端到端流程...\n或 https://yourportfolio.com",
    ftLabel: "全职", internLabel: "实习",
    picksTitle: "今日必投", picksSub: "按你的赛道胜率自动排序 · 近48小时", pkOps: "Ops/PjM主仓", pkGrowth: "Growth/CRM本命", pkAI: "AI进攻线", pkLocal: "🏠西雅图本地", pkRemote: "Remote", pkToday: "今日新发",
    menuHelp: "使用指南", menuExport: "导出备份", menuImport: "导入备份",
    exportTip: "导出备份（不含API Key）", importTip: "导入备份", importOk: "导入成功，即将刷新", importBad: "文件格式不对，请选择 OfferPilot 导出的备份文件",
    aiAsks: "AI 想问你", aiAsksHint: "在下方对话框里回答，AI 会把你的补充事实织进改写",
    refineTitle: "对话微调", refineHint: "不认可某条改写？直接说。有报告没问到的经历？在这里补充，AI 会给出融合后的新版本（不超原句长度+10%）。",
    refinePlaceholder: "例如：第二条我其实还做过A/B测试...", refineSend: "发送", refineThinking: "思考中...",
    jdUrl: "投递链接（选填，会存进报告）", applyLink: "投递入口", rerun: "简历改完了，重测对比",
    atsKw: "ATS 关键词核对", kwMiss: "缺失 — 务必让这些词出现在简历里（用JD的原拼写）", kwHave: "已覆盖", kwNote: "ATS本身不打分，但recruiter会按这些词搜索简历。缺失词要自然融入bullet，不要堆在技能栏。",
    hardReqs: "硬性条件（缺了就是硬伤）", softReqs: "软性条件（特质与工作方式）",
    keyTitle: "连接你的 Anthropic API Key 以启用 AI 功能", keyHint: "Key 只保存在你自己的浏览器（localStorage），不会上传到任何服务器。在 console.anthropic.com 免费获取。没有 Key 也可以使用岗位追踪的全部功能。", keySet: "API Key 已连接（仅存本机）", keyClear: "断开",
    uploadFile: "上传文件", uploadHint: "支持 .md / .txt（PDF请先转文本）",
    resumeLib: "简历库", addResume: "添加简历", resumeName: "简历名称", editBtn: "编辑", noResumes: "还没有简历，点击添加",
    usingResume: "使用简历", autoPick: "帮我选简历", picking: "AI 判断中...", pickFail: "自动选择失败，请手动选一份",
    persona: "他们在找什么人", hiddenSignal: "隐藏信号", folioReview: "作品集评审", folioLead: "主打项目", folioAlign: "对齐度", folioGap: "缺口",
    stages: { saved: "收藏", applied: "已投递", referral_asked: "求内推", referral_got: "获内推", interview: "面试中", offer: "Offer", rejected: "已拒" },
    pm: "PM", pd: "PD",
    today: "今天", yesterday: "昨天", daysAgo: d => `${d}天前`, weeksAgo: w => `${w}周前`,
  },
  en: {
    greeting: "Hello!", subtitle: "Track your PM & Product Designer job hunt",
    dashboard: "Overview", jobs: "Jobs", pipeline: "Pipeline",
    refresh: "Fetch latest", refreshing: "Fetching...",
    tracked: "Tracked", applied: "Applied", referralsActive: "Referrals", interviews: "Interviews", offers: "Offers",
    funnel: "Pipeline funnel", recentActivity: "Recent activity", roleSplit: "Role split", weeklyTrend: "Weekly trend",
    activityAssigned: "Activity breakdown", distribution: "Stage distribution",
    noActivity: "No applications yet",
    searchPlaceholder: "Search company, role...", all: "All",
    stageCol: "Stage", company: "Company", location: "Location", typeCol: "Type", postedCol: "Posted", jobCol: "Role",
    empty: "Empty", noMatch: "No matching jobs",
    jobDetails: "Job details", openOriginal: "View original", jobTitle: "Job title",
    stage: "Stage", referralContact: "Referral contact", tags: "Tags",
    tagPlaceholder: "Press Enter to add", add: "Add",
    notes: "Notes", notesPlaceholder: "Progress notes...",
    save: "Save", delete: "Delete", addNew: "Add new job",
    link: "URL", saveBtn: "Save",
    fetchOk: (t, n) => `✓ Found ${t} jobs, ${n} new`,
    fetchNone: "No new jobs", fetchFail: "Fetch failed", fetchBlocked: "Browser security blocked live fetch — ask Claude to refresh the data",
    windows: { "24h": "24h", "7d": "7 days", "30d": "30 days", "all": "All" },
    h1bLikely: "H1B✓", h1bNoIntl: "US persons only", h1bStaffing: "Staffing", h1bFilter: "H1B-friendly only", externalSearch: "Search externally:",
    confirmDelete: (ti, co) => `Delete "${ti} @ ${co}"? This cannot be undone.`, channels: "Channels", cancel: "Cancel", confirmBtn: "Delete",
    lab: "Resume Lab", myResume: "My baseline resume", resumeHint: "Paste your full resume text (save once, reuse; update anytime)", resumeSaved: "Saved · ", resumeSave: "Save resume", chars: "chars",
    jdAnalysis: "JD Analysis", jdHint: "Paste the full job description", jdCompany: "Company (blank = auto-detect)", jdTitle: "Title (blank = auto-detect)", analyze: "Generate report", analyzing: "Analyzing (~20s)...",
    needResume: "Save your resume above first", needJD: "Paste a JD first",
    reportHistory: "Report history", noReports: "No JD analyzed yet", reopen: "View", delReport: "Delete",
    matchScore: "Match", verdict: "Verdict", mustHaves: "Must-have requirements", gaps: "Gaps & fixes", tailored: "Tailored bullet suggestions", questions: "Predicted questions", h1bFlags: "Visa/status signals", assumptions: "Assumptions", levelCheck: "Level check",
    hit: "✓ Hit", partial: "◐ Partial", miss: "✗ Miss",
    analyzeFail: "Analysis failed (auto-retried twice). Wait a few seconds and try again; if it persists, tell Claude.",
    tailorNote: "Rewrites only reorganize facts already in your resume — nothing is fabricated. Verify any number marked [TBC].",
    myPortfolio: "Portfolio (for UX/PD roles)", portfolioHint: "Paste project summaries (recommended) or portfolio URL; saved for reuse", portfolioPlaceholder: "Project 1: Smart home app redesign, end-to-end...\nor https://yourportfolio.com",
    ftLabel: "Full-time", internLabel: "Intern",
    picksTitle: "Today's Picks", picksSub: "Ranked by your lane strategy · last 48h", pkOps: "Ops/PjM", pkGrowth: "Growth/CRM", pkAI: "AI lane", pkLocal: "🏠Seattle local", pkRemote: "Remote", pkToday: "New today",
    menuHelp: "How to use", menuExport: "Export backup", menuImport: "Import backup",
    exportTip: "Export backup (API key excluded)", importTip: "Import backup", importOk: "Imported — reloading", importBad: "Invalid file — choose an OfferPilot backup",
    aiAsks: "AI asks you", aiAsksHint: "Answer in the chat below — new facts get woven into revised bullets",
    refineTitle: "Refine via chat", refineHint: "Disagree with a rewrite? Say so. Have experience the report didn't ask about? Add it here — you'll get a merged version (max +10% length).",
    refinePlaceholder: "e.g. For bullet 2, I actually also ran A/B tests...", refineSend: "Send", refineThinking: "Thinking...",
    jdUrl: "Application URL (optional, saved with report)", applyLink: "Apply", rerun: "Resume updated? Re-test",
    atsKw: "ATS keyword check", kwMiss: "Missing — make these appear in your resume (JD's exact spelling)", kwHave: "Covered", kwNote: "ATS doesn't score resumes, but recruiters keyword-search them. Weave missing terms into bullets, don't pile them in Skills.",
    hardReqs: "Hard requirements (dealbreakers)", softReqs: "Soft requirements (traits & ways of working)",
    keyTitle: "Connect your Anthropic API key to enable AI features", keyHint: "Stored only in your own browser (localStorage), never uploaded anywhere. Get one free at console.anthropic.com. All job-tracking features work without a key.", keySet: "API key connected (local only)", keyClear: "Disconnect",
    uploadFile: "Upload file", uploadHint: ".md / .txt (convert PDF to text first)",
    resumeLib: "Resume Library", addResume: "Add resume", resumeName: "Resume name", editBtn: "Edit", noResumes: "No resumes yet — add one",
    usingResume: "Using", autoPick: "Pick for me", picking: "Deciding...", pickFail: "Auto-pick failed — select manually",
    persona: "Who they really want", hiddenSignal: "Hidden signal", folioReview: "Portfolio review", folioLead: "Lead with", folioAlign: "Alignment", folioGap: "Gap",
    stages: { saved: "Saved", applied: "Applied", referral_asked: "Asked", referral_got: "Secured", interview: "Interview", offer: "Offer", rejected: "Rejected" },
    pm: "PM", pd: "PD",
    today: "Today", yesterday: "Yesterday", daysAgo: d => `${d}d ago`, weeksAgo: w => `${w}w ago`,
  },
};

const STAGES = [
  { id: "saved", color: "#8B8FA3", accent: "#C8CAD4" },
  { id: "applied", color: "#7BA1C7", accent: "#B8D4F0" },
  { id: "referral_asked", color: "#C9A86C", accent: "#F0DFB8" },
  { id: "referral_got", color: "#7BAF8B", accent: "#B8E5C8" },
  { id: "interview", color: "#9B8EC4", accent: "#CBBEF0" },
  { id: "offer", color: "#C47B8B", accent: "#F0B8C4" },
  { id: "rejected", color: "#A88A8A", accent: "#D9C4C4" },
];

const GH = [
  { name: "jobright-PM", url: "https://raw.githubusercontent.com/jobright-ai/2026-Product-Management-New-Grad/master/README.md", defaultType: "Product Manager", jobType: "fulltime", format: "jobright" },
  { name: "jobright-Design", url: "https://raw.githubusercontent.com/jobright-ai/2026-Design-New-Grad/master/README.md", defaultType: "Product Designer", jobType: "fulltime", format: "jobright" },
  { name: "jobright-Engineering", url: "https://raw.githubusercontent.com/jobright-ai/2026-Engineering-New-Grad/master/README.md", defaultType: "Hardware", jobType: "fulltime", format: "jobright" },
  { name: "jobright-Marketing", url: "https://raw.githubusercontent.com/jobright-ai/2026-Marketing-New-Grad/master/README.md", defaultType: "Product Ops", jobType: "fulltime", format: "jobright" },
  { name: "jobright-PM-Intern", url: "https://raw.githubusercontent.com/jobright-ai/2026-Product-Management-Internship/master/README.md", defaultType: "Product Manager", jobType: "intern", format: "jobright" },
  { name: "jobright-Design-Intern", url: "https://raw.githubusercontent.com/jobright-ai/2026-Design-Internship/master/README.md", defaultType: "Product Designer", jobType: "intern", format: "jobright" },
  { name: "simplify", url: "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md", defaultType: "Product Manager", jobType: "fulltime", format: "simplify" },
  { name: "vansh", url: "https://raw.githubusercontent.com/vanshb03/New-Grad-2027/main/README.md", defaultType: "Product Manager", jobType: "fulltime", format: "vansh" },
];
const ITAR=["spacex","blue origin","lockheed","northrop","raytheon","rtx","boeing defense","anduril","l3harris","general dynamics","bae systems","general atomics","leidos","palantir usg"];
const SPONSORS=["google","meta","microsoft","amazon","apple","nvidia","intel","amd","qualcomm","broadcom","cisco","oracle","salesforce","adobe","uber","lyft","airbnb","doordash","stripe","paypal","intuit","servicenow","workday","snowflake","databricks","tiktok","bytedance","linkedin","pinterest","snap","roblox","netflix","tesla","rivian","capital one","jpmorgan","goldman","morgan stanley","bloomberg","visa","mastercard","walmart","ford","micron","texas instruments","analog devices","samsung","ibm","dell","atlassian","figma","openai","anthropic","expedia","zillow","redfin","carrier","honeywell","medtronic","veeva"];
const STAFFING=/(staffing|recruiting|recruitment|insight global|teksystems|robert half|aerotek|randstad|kforce|cybercoders|jobot|motion recruitment|infosys|wipro|cognizant|hcl |capgemini)/i;
// 她的资格窗口: Mar 2027毕业 → Summer 2027及以后的实习无资格
const SEASON_OUT=/(summer|fall|autumn|winter|spring)\s*'?(20)?2[78]/i;
const SEASON_OK=/(summer|fall|autumn)\s*'?(20)?26|(winter|spring)\s*'?(20)?27/i;
function seasonBlocked(title, jobType){
  if(jobType!=="intern") return false;
  if(SEASON_OK.test(title)) return false;
  return SEASON_OUT.test(title);
}
function h1bTag(co){const c=co.toLowerCase();if(ITAR.some(x=>c.includes(x)))return"no-intl";if(STAFFING.test(c))return"staffing";if(SPONSORS.some(x=>c.includes(x)))return"likely";return"unknown";}
function classifyType(ti,fb){const t=ti.toLowerCase();
if(/(hardware (design )?engineer|electrical (design )?engineer|pcb|circuit design|embedded hardware|hardware development)/.test(t))return"Hardware";
if(/(product design|ux design|ui design|ux\/ui|ui\/ux|ux researcher|interaction design|experience design|digital (product )?design|visual design)/.test(t))return"Product Designer";
if(/(project manager|program manager|project coordinator|project management|program management|scrum)/.test(t))return"Project Management";
if(/(product operations|product ops|marketing operations|growth (manager|specialist|associate|analyst)|crm|lifecycle|retention (specialist|manager|associate)|engagement (specialist|manager)|product marketing|go-to-market|gtm )/.test(t))return"Product Ops";
if(/(product manager|product management|apm\b|associate product|rotational product)/.test(t))return"Product Manager";
return fb;}
function isRelevant(ti,srcType){const t=ti.toLowerCase();
if(/(senior|staff|principal|lead |director|vp |head of|sr\.? )/.test(t)&&!/associate/.test(t))return false;
if(/(apprentice|assembler|technician|electrician|journeyman|foreman|superintendent)/.test(t))return false;
if(/(technical program manager|engineering program manager|tpm\b)/.test(t))return false;
if(/(industrial design|apparel|footwear|fashion|graphic design|interior design|jewelry|mechanical design|textile|landscape|architectural)/.test(t))return false;
if(srcType==="Hardware")return/(hardware (design )?engineer|electrical (design )?engineer|pcb|circuit design|embedded hardware|hardware development|electronics engineer)/.test(t);
if(srcType==="Product Ops"){
if(/(sales representative|account executive|content (writer|creator)|copywriter|social media|seo |paid (media|search)|brand ambassador|influencer|event)/.test(t))return false;
return/(product operations|product ops|marketing operations|growth (manager|specialist|associate|analyst)|crm|lifecycle|retention|engagement|operations (associate|specialist|analyst)|product marketing|go-to-market|gtm )/.test(t);}
// simplify/vansh是混合仓: 只捞产品相关
return/(product manager|product management|product designer|product design|ux design|ui design|ux designer|ui designer|ux\/ui|ui\/ux|ux researcher|interaction design|experience design|digital design|visual design|apm\b|associate product|program manager|project manager|project coordinator|product operations)/.test(t);}
function mkDate(dm){const mo={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};
let ds=new Date().toISOString().split("T")[0];
if(dm){const yr=new Date().getFullYear();ds=`${yr}-${mo[dm[1]]||"01"}-${dm[2].padStart(2,"0")}`;
if(new Date(ds)>new Date(Date.now()+864e5))ds=`${yr-1}-${mo[dm[1]]}-${dm[2].padStart(2,"0")}`;}
return ds;}
function ageToDate(s){const m=s.match(/^(\d+)(d|mo|h)$/);if(!m)return null;
const n=+m[1],ms=m[2]==="h"?36e5:m[2]==="d"?864e5:26*864e5;
return new Date(Date.now()-n*ms).toISOString().split("T")[0];}
function pushJob(jobs,src,co,ti,loc,url,dateStr){
  if(!ti||!co)return;
  if(/🔒/.test(ti))return;                       // closed
  if(/🇺🇸/.test(ti))return;                      // citizens only
  const noSponsor=/🛂/.test(ti);
  ti=ti.replace(/🛂|🇺🇸|🔒|↳/g,"").trim();
  if(!isRelevant(ti,src.defaultType))return;
  const h1b=h1bTag(co);
  if(h1b==="no-intl"||h1b==="staffing")return;
  const jobType=src.jobType==="intern"||/(intern|internship|co-op|coop)\b/i.test(ti)?"intern":"fulltime";
  if(noSponsor&&jobType==="fulltime")return;      // 全职不sponsor=对她无价值
  if(seasonBlocked(ti,jobType))return;            // Summer 2027+实习无资格
  jobs.push({title:ti,company:co,location:loc||"",type:classifyType(ti,src.defaultType),jobType,posted:dateStr,source:src.name,url:url||"",h1b:noSponsor?"unknown":h1b,stage:"saved",notes:"",referralContact:"",tags:[]});
}
function parseJobright(md,src){
  const jobs=[];let last="",inT=false;
  for(const line of md.split("\n")){
    if(line.includes("| Company |")||line.includes("| ----")){inT=true;continue;}
    if(!inT||!line.startsWith("|"))continue;
    const cells=line.split("|").map(c=>c.trim()).filter(Boolean);
    if(cells.length<4)continue;
    const lr=/\[([^\]]+)\]\(([^)]+)\)/,cm=cells[0].match(lr),tm=cells[1].match(lr);
    let co=cm?cm[1]:cells[0].replace(/\*/g,"").trim();
    const ti=tm?tm[1]:cells[1].replace(/\*/g,"").trim(),url=tm?tm[2]:"";
    if(ti==="Job Title")continue;
    if(co==="↳"||co.includes("↳"))co=last;else last=co;
    const dm=cells[cells.length-1].match(/([A-Z][a-z]{2})\s+(\d{1,2})/);
    pushJob(jobs,src,co,ti,cells[2],url,mkDate(dm));
  }
  return jobs;}
function parseVansh(md,src){
  const jobs=[];let last="",inT=false;
  for(const line of md.split("\n")){
    if(/^\|\s*Company\s*\|/.test(line)||/^\|\s*-+/.test(line)){inT=true;continue;}
    if(!inT||!line.startsWith("|"))continue;
    const cells=line.split("|").map(c=>c.trim());cells.shift();cells.pop();
    if(cells.length<5)continue;
    let co=cells[0].replace(/\*/g,"").trim();
    if(co==="↳"||co==="")co=last;else last=co;
    const ti=cells[1];
    const um=cells[3].match(/href="([^"]+)"/)||cells[3].match(/\(([^)]+)\)/);
    const dm=cells[4].match(/([A-Z][a-z]{2})\s+(\d{1,2})/);
    pushJob(jobs,src,co,ti,cells[2],um?um[1].split("?utm")[0]:"",mkDate(dm));
  }
  return jobs;}
function parseSimplify(html,src){
  const jobs=[];let last="";
  const rows=html.split(/<tr>/i).slice(1);
  for(const row of rows){
    const tds=[...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>m[1]);
    if(tds.length<5)continue;
    const strip=s=>s.replace(/<[^>]+>/g,"").replace(/&amp;/g,"&").trim();
    let co=strip(tds[0]);
    if(co==="↳"||co==="")co=last;else last=co;
    const ti=strip(tds[1]);
    const um=tds[3].match(/href="([^"]+)"/);
    const age=strip(tds[4]);
    const ds=ageToDate(age)||new Date().toISOString().split("T")[0];
    pushJob(jobs,src,co,ti.includes("🇺🇸")?"🇺🇸"+ti:ti,strip(tds[2]),um?um[1].split("?utm")[0]:"",ds);
  }
  return jobs;}

async function fetchLive(){
  const rs=await Promise.allSettled(GH.map(async s=>{
    const r=await fetch(s.url);if(!r.ok)throw new Error();
    const txt=await r.text();
    return s.format==="simplify"?parseSimplify(txt,s):s.format==="vansh"?parseVansh(txt,s):parseJobright(txt,s);
  }));
  let all=[],errs=[];
  rs.forEach((r,i)=>{if(r.status==="fulfilled")all=all.concat(r.value);else errs.push(GH[i].name);});
  const seen=new Set();
  return{jobs:all.filter(j=>{const k=`${j.company}::${j.title}::${j.location}`.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>b.posted.localeCompare(a.posted)).map((j,i)=>({...j,id:"lv"+Date.now()+"-"+i})),errors:errs};
}
function relDate(ds,t){const diff=Math.max(0,Math.floor((new Date()-new Date(ds))/864e5));if(diff===0)return t.today;if(diff===1)return t.yesterday;if(diff<7)return t.daysAgo(diff);return t.weeksAgo(Math.floor(diff/7));}

// ============ Glass Card ============
function Glass({ children, style, tint }) {
  return (
    <div style={{
      background: tint || "rgba(255,255,255,0.55)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderRadius: 20,
      border: "1px solid rgba(255,255,255,0.6)",
      padding: 24,
      ...style,
    }}>{children}</div>
  );
}

// ============ Main App ============
export default function OfferPilot() {
  const INITIAL_JOBS = [{"title":"Product Manager - IT.TE.DI","company":"Ingersoll Cutting Tools","location":"Rockford, IL, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6b9cfeacb0a61f9dbc1e3d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j0"},{"title":"Senior Associate, Product Management - Card Partnerships Team","company":"Capital One","location":"Chicago, Illinois, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4ed51d1544d7246c0d467c?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j1"},{"title":"Product Management Assistant","company":"Macy's","location":"New York, NY, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6b82d55c54bc4752ce9701?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j2"},{"title":"Product Operations Leader","company":"Indigo","location":"2453 161A St, Surrey, BC V3S 9H7, Canada","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a509ae6ddd293054ccaa046?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j3"},{"title":"Senior Associate, Product Management - Enterprise Core Platform","company":"Capital One","location":"Chicago, IL","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68f0e43cef766b3f0fd06533?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j4"},{"title":"Senior Associate, Product Management - Enterprise Core Platform","company":"Capital One","location":"Richmond, VA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68f0e4e5e6870116b1f51656?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j5"},{"title":"Senior Associate, Product Management - Enterprise Core Platform","company":"Capital One","location":"New York, NY","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68f0e4c3f462172a5a7d0cba?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j6"},{"title":"Senior Associate, Product Management - Enterprise Core Platform","company":"Capital One","location":"McLean, VA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68f0e469f462172a5a7d0b96?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j7"},{"title":"Associate Product Manager (SMA)","company":"CivicPlus","location":"United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6b717f32f9300c3a3dede9?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j8"},{"title":"Associate Product Manager (NextRequest)","company":"CivicPlus","location":"United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6b718b57120971bf3a6d30?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j9"},{"title":"Sr. Associate, Product Management - Auto","company":"Capital One","location":"Plano, TX","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68fbd1424129dd33cd135004?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j10"},{"title":"Associate Product Manager - Vault CRM Suite","company":"Veeva Systems","location":"California - Pleasanton","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a1d59496b135014dbc95dc8?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j11"},{"title":"Associate Product Manager - Vault CRM Suite","company":"Veeva Systems","location":"Massachusetts - Boston","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a1e8eaab61b2c65b37abf2f?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j12"},{"title":"Associate Product Manager - Vault CRM Suite","company":"Veeva Systems","location":"Boston, MA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a62e4de32abf9182432c142?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j13"},{"title":"Associate Product Manager","company":"CivicPlus","location":"United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6b5a0457120971bf3a643e?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j14"},{"title":"Associate Product Mgr","company":"RELX","location":"Raleigh, NC, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4e4bc8397d8d353c288599?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j15"},{"title":"Associate Digital Designer","company":"IXL Learning","location":"San Mateo, CA","type":"Product Designer","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a42cff3ff87fd527f985982?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j16"},{"title":"UX Product Designer - Stores","company":"Target","location":"Minneapolis, MN, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a6933343b549b0b531d47ee?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j17"},{"title":"Early Career Substation Electrical Engineer","company":"WSP in the U.S.","location":"12755 Olive Boulevard, Saint Louis, MO, 63141, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a1957b6fee8f34024353b3e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j18"},{"title":"Early Career Substation Electrical Engineer","company":"WSP in the U.S.","location":"5675 Ruffin Rd, San Diego, CA, 92123, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5af44f686b4755d1e17bf5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j19"},{"title":"Junior Electrical Engineer","company":"NDI Engineering Company","location":"Philadelphia, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e5f1215b4965afd582e78?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j20"},{"title":"Electrical Engineer II - IV","company":"Syska Hennessy Group","location":"Los Angeles, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a06fc859f57175bd581c3fb?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j21"},{"title":"Electrical Engineer II - IV","company":"Syska Hennessy Group","location":"Los Angeles, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a53d3648ef95364ead937d7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j22"},{"title":"Electrical Engineer I","company":"Westinghouse Electric Company","location":"New Stanton, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b8257c00ae03109f8465c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j23"},{"title":"Entry Level ATM Electrical Engineer","company":"Salas O'Brien","location":"Green Bay, WI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e9f4c397d8d353c289b68?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j24"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Moon, Pennsylvania, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b7d3b32f9300c3a3df235?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j25"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b7d24c00ae03109f8435d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j26"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Pittsburgh, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b7cd3c00ae03109f8432b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j27"},{"title":"Electrical Engineer","company":"Mach Industries","location":"Huntington Beach, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5645c153b3962b910af098?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j28"},{"title":"Electrical Engineer","company":"Mach Industries","location":"Huntington Beach","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a178a9f9005d858e94faf3f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j29"},{"title":"Electrical Engineer","company":"Mach Industries","location":"Huntington Beach, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a1b7c066b135014dbc8ef1b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j30"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Greenville, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b730932f9300c3a3dee63?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j31"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Portland, OR, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b70caacb0a61f9dbc0d02?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j32"},{"title":"Electrical Engineer-in-Training, Buildings","company":"WSP in Canada","location":"Victoria, BC, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b6ff8c00ae03109f83ea6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j33"},{"title":"Electrical Engineer I Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Rock Hill, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6ad7de57120971bf3a2e83?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j34"},{"title":"Electrical Engineer I","company":"Westinghouse Electric Company","location":"Rock Hill, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a696616c69119640fe438?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j35"},{"title":"Circuit Design Engineer - New College Grad 2026","company":"NVIDIA","location":"US, CA, Santa Clara, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a511743bf63b66c79978baf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j36"},{"title":"Salvage PCB Specialist POC","company":"Nova Biomedical","location":"Billerica, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e2d32f29acc1a11745ddd?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j37"},{"title":"Electrical Engineer","company":"Rosendin","location":"Phoenix, AZ, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b5a2bacb0a61f9dbc04a7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j38"},{"title":"PCB Design Engineer I","company":"Advanced Energy","location":"Eden Prairie, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a3154c63ba56308f51d79?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j39"},{"title":"Electrical Engineer","company":"Stratolaunch","location":"Mojave, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a19f2212b206f3955eb18c4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j40"},{"title":"Electrical Engineer","company":"Stratolaunch","location":"Mojave, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51d4edbf63b66c7997d9ca?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j41"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Austin, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b5943ca1f9338465f9cd2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j42"},{"title":"Electrical Engineering Associate","company":"Michael Baker International","location":"10260 Westheimer Rd, Houston, TX, 77042, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3660ed649fdf16292fb6c8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j43"},{"title":"Electrical Engineer","company":"Arcfield","location":"Middletown, RI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6ac92432f9300c3a3da8ce?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j44"},{"title":"Electrical Engineer","company":"Rosendin","location":"Pflugerville, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b522a5c54bc4752ce846f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j45"},{"title":"Electrical Engineer","company":"Rosendin","location":"Coppell, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6b512557120971bf3a6180?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j46"},{"title":"Electrical Engineer I","company":"Loram Maintenance of Way, Inc.","location":"Hamel, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a32026935e80310003aa695?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j47"},{"title":"Product Marketing Associate","company":"Claroty","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a467a6d0dd56c76cc2f98ed?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j48"},{"title":"Product Marketing Specialist","company":"ASUS","location":"Fremont, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a40829dd528ac2915f96a84?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j49"},{"title":"Performance & Growth Associate","company":"RVO Health","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a50bb09ddd293054ccabcb1?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j50"},{"title":"Marketing Coordinator - Go-To-Market","company":"Plante Moran","location":"Southfield, Michigan, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a637300979290281c7022e2?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j51"},{"title":"Marketing Coordinator - Go-To-Market","company":"Plante Moran","location":"Southfield, United States of America","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a51d24802522b5b722ec178?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j52"},{"title":"Ad Operations Specialist","company":"Entravision Digital - Global Advertising powered by Technology","location":"Burbank, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6b25dfca1f9338465f8c1c?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j53"},{"title":"TikTok Live Operations Specialist","company":"Wahool","location":"Manhattan, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-30","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6b233cc00ae03109f82126?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j54"},{"title":"Internship Product Management Energy Products & Tariffs (m/f/d)","company":"1KOMMA5°","location":"United States","type":"Product Manager","jobType":"intern","posted":"2026-07-30","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a6b95c532f9300c3a3dfbb4?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j55"},{"title":"Product Manager Intern","company":"Centerfield","location":"Los Angeles, California","type":"Product Manager","jobType":"intern","posted":"2026-07-30","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a2b4d7f2cde2824469c6167?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j56"},{"title":"Product Manager Intern","company":"Centerfield","location":"Los Angeles, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-30","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a56a5f2f7517b519ad5744b?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j57"},{"title":"AI-Native Product Management Intern (Marketplace & Growth)","company":"Trucker Path","location":"Phoenix, AZ, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-30","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a5f6cc1b0f20036bc630df0?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j58"},{"title":"ThingsBook - Product Management Intern","company":"NAVER U.Hub","location":"Redwood City, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-30","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a6b250057120971bf3a51a6?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j59"},{"title":"UX Design Intern - Fall 2026","company":"Medpace","location":"Cincinnati, OH, United States","type":"Product Designer","jobType":"intern","posted":"2026-07-30","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a6b8bbc5c54bc4752ce9a41?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j60"},{"title":"Visual Design Intern","company":"Golden Hippo®","location":"United States","type":"Product Designer","jobType":"intern","posted":"2026-07-30","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a565bf8efb06a45240d5353?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j61"},{"title":"Product Design (UX/UI) Intern","company":"Nerveli","location":"United States","type":"Product Designer","jobType":"intern","posted":"2026-07-30","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a6b5f15acb0a61f9dbc0646?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j62"},{"title":"Fall 2026 UX Design Intern","company":"Grand Studio","location":"United States","type":"Product Designer","jobType":"intern","posted":"2026-07-30","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a6b2588ca1f9338465f8b79?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j63"},{"title":"Associate Product Manager","company":"T-Mobile","location":"Bellevue, WA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-30","source":"vansh","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j64"},{"title":"Creative Product Manager Graduate (Creative and Brand Innovation) - 2026 Start (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6af13857120971bf3a3c00?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j65"},{"title":"Product Operations Analyst","company":"Instawork","location":"San Francisco, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6ab634394f9d64d8be6ada?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j66"},{"title":"Associate Software Product Manager","company":"WGU Product Design","location":"Salt Lake City, UT, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6aad920b42f866b6199ab2?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j67"},{"title":"Associate Product Manager","company":"HM Revenue & Customs","location":"Newcastle upon Tyne, England, United Kingdom","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6a757948355b3f12bf11b5?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j68"},{"title":"Associate Product Manager (Hybrid - Oak Brook, IL)","company":"Chamberlain Group","location":"Oak Brook, IL, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6a694619d76667a2abf912?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j69"},{"title":"Associate -Digital Product Management","company":"American Express","location":"Phoenix, AZ, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5a6428c8e3a473cb8ab7dd?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j70"},{"title":"Analyst, BI, Product Management","company":"Horizon Next","location":"New York City metropolitan area, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6a3d808693c23e7fb79964?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j71"},{"title":"Associate Product Manager","company":"Stanley Black & Decker, Inc.","location":"Towson, MD, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6a27958693c23e7fb790c5?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j72"},{"title":"Associate Product Line Manager, Veilance – Women’s","company":"Arc'teryx Equipment","location":"North Vancouver, BC (Corporate)","type":"Product Manager","jobType":"fulltime","posted":"2026-07-29","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4d94283122a76a8fd56013?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j73"},{"title":"Product Designer - Clearance Required","company":"LMI","location":"Arlington, VA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a4e6243fc327f422fef285c?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j74"},{"title":"Freelance Digital Designer / Video Editor","company":"Pat McGrath Cosmetics","location":"New York, NY, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a6a28e048355b3f12bef556?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j75"},{"title":"UX Designer","company":"Applied Systems Inc","location":"United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a4525e7c2d11a6a46668361?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j76"},{"title":"Hardware Development Engineer I","company":"Relativity Space","location":"Long Beach, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a526cc8e726ec56126a2f8e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j77"},{"title":"Electrical Engineer in Training","company":"Stantec","location":"Vancouver, BC, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a73c819d76667a2abfccf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j78"},{"title":"Hardware Engineer 1 - 23830 (FS Poly Required)","company":"Mission Technologies, a division of HII","location":"Fort Meade, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a511e8bae4052672fe97135?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j79"},{"title":"Hardware Engineer","company":"Supermicro","location":"San Jose, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a69c7a9c63ba56308f4fe7f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j80"},{"title":"Hardware Engineer","company":"Supermicro","location":"San Jose, California, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4d9e790209ea6fd6852d0c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j81"},{"title":"Co-op Student, Electrical Engineering","company":"WSP in Canada","location":"Markham, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a6e260b42f866b6198bf1?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j82"},{"title":"Co-op Student, Electrical Engineering","company":"WSP in Canada","location":"Vaughan, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a613716c69119640fdfd4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j83"},{"title":"Assistant Electrical Engineer, Power - Energy Storage (Chicago)","company":"Burns & McDonnell","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a11908693c23e7fb788b6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j84"},{"title":"Early Career Electrical Engineer","company":"WSP in the U.S.","location":"Oradell, NJ, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a20e716c69119640fc78d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j85"},{"title":"Early Career Electrical Engineer","company":"WSP in the U.S.","location":"3900 South Wadsworth Blvd., Lakewood, CO, 80235, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5af4993ac7627fe9006949?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j86"},{"title":"Early Career Electrical Engineer","company":"WSP in the U.S.","location":"Foxborough, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5af472856af468ab00b140?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j87"},{"title":"Co-op Student, Electrical Engineering","company":"WSP in the U.S.","location":"Thornhill, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a530a0b42f866b61980fe?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j88"},{"title":"Electrical Engineer, Assistant - Customer Experience","company":"Seattle City Light","location":"Seattle, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f577bb0f20036bc630887?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j89"},{"title":"Power Electronics Engineer I","company":"Vast","location":"Long Beach, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69858dac348f733a5c3a0a7a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j90"},{"title":"Power Electronics Engineer I","company":"Vast","location":"Long Beach, California, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51c3c502522b5b722eb222?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j91"},{"title":"Electrical Engineer I / II","company":"Inspired Flight Technologies Inc.","location":"San Luis Obispo, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a2d260b42f866b6197305?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j92"},{"title":"Entry Level Electrical Engineer","company":"Ampirical","location":"3097 Satellite Blvd, Duluth, 30096, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a319378e7b7d514a3bd435e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j93"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Philadelphia, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a27cc8693c23e7fb790d8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j94"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a22170b42f866b6196e76?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j95"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Atlanta, GA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6a1e8b0b42f866b6196d65?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j96"},{"title":"Electrical Engineer - Fire Alarm Control Panels (FACP)","company":"UL Solutions","location":"Northbrook, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4d069ed27b2c4dda9b5c45?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j97"},{"title":"Mechanical or Electrical Engineer I/II - Monticello, MN","company":"Xcel Energy","location":"Greater Minneapolis–St. Paul Area, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a308d93afabbe533fb8bb03?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j98"},{"title":"Electrical Engineer Associate-Principal","company":"American Electric Power","location":"New Albany, OH, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a69fcb916c69119640fbbb7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j99"},{"title":"Entry Level Electrical Engineer - Data Centers","company":"Jacobs","location":"Nashville, TN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5d9deb686b4755d1e1e1d3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j100"},{"title":"Associate Electrical Engineer","company":"Carrier","location":"Fort Wayne, IN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a69f64919d76667a2abceb8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j101"},{"title":"Electrical Engineer I","company":"Loram Maintenance of Way, Inc.","location":"Georgetown, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3202572ee3ac1b4bef221d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j102"},{"title":"Electrical Engineer 1","company":"Westinghouse Electric Company","location":"Rock Hill, SC, US, 29730","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4352f4e09ecb4959644129?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j103"},{"title":"Electrical Engineer 1","company":"Westinghouse Electric Company","location":"Rock Hill, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a61665011edf44d79160a06?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j104"},{"title":"Electrical Engineer 1 Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Rock Hill, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c58274da96a42cfd9c66c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j105"},{"title":"Electrical Engineer 1 Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Rock Hill, SC, US, 29730","type":"Hardware","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2ce321fc0644749054b758?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j106"},{"title":"Sports CRM Ops Associate","company":"bet365","location":"Denver, CO, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6a8935c63ba56308f53d26?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j107"},{"title":"Analyst, Marketing Operations - Loyalty","company":"Williams-Sonoma, Inc.","location":"San Francisco, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6a45d116c69119640fd629?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j108"},{"title":"Associate Merchandising Operations Specialist","company":"Rockler Companies, Inc.","location":"Medina, MN, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6a168248355b3f12beef25?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j109"},{"title":"Health System Engagement Coordinator","company":"University of Missouri-Columbia","location":"Columbia, MO, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-29","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a69fbda19d76667a2abd002?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j110"},{"title":"Product Operations Intern (TikTok-PGC) - 2026 Summer (BS/MS)","company":"TikTok","location":"Los Angeles, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-29","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a2f9ccf093df201d07ae28b?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j111"},{"title":"Product Management/Marketing Intern – Summer 2026","company":"Fontaine Modification Company","location":"Charlotte, NC, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-29","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/68cd0c5ce23def7af55b463f?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j112"},{"title":"Product Management Internship (6-month)","company":"Bosch","location":"Farmington Hills, MI, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-29","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a69fcf248355b3f12bee677?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j113"},{"title":"Product Management Project Intern (TikTok Shop- Operations) - 2026 Start (BS/MS)","company":"TikTok","location":"Los Angeles, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-29","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a69f308c63ba56308f507c7?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j114"},{"title":"Product Design Intern","company":"Loop Financial","location":"Toronto, ON, Canada","type":"Product Designer","jobType":"intern","posted":"2026-07-29","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a6a0eac48355b3f12beeb6c?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j115"},{"title":"Product Operations Analyst","company":"Instawork","location":"Chicago, IL, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a69694b2a5c103624db494d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j116"},{"title":"API Product Manager","company":"VantageScore®","location":"South San Francisco, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6968612a5c103624db4903?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j117"},{"title":"Associate Product Manager","company":"Super Micro Computer Spain, S.L.","location":"San Jose, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a694697ceb2691dfb208358?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j118"},{"title":"API Product Manager","company":"Vantage","location":"San Francisco, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6930765d01972698ee6f84?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j119"},{"title":"Associate Product & Programs Engineer","company":"Proper Voltage","location":"Carlsbad, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4c2bfe4eb370649b27c871?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j120"},{"title":"Branch Associate Product Manager / Santa Ana, CA","company":"TTI, Inc.","location":"Santa Ana, California, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-28","source":"jobright-PM","url":"https://jobright.ai/jobs/info/69aa2ba79ca4e908ec6573a0?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j121"},{"title":"Product Designer (UX/UI) Student","company":"OLG","location":"Toronto, ON, Canada","type":"Product Designer","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a68bca8207d4f2e632e4651?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j122"},{"title":"Visual Designer (Canada, Vancouver)","company":"Autodesk","location":"Vancouver, BC, CAN, Canada","type":"Product Designer","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a4c05e56189f64e437f0beb?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j123"},{"title":"Assistant Electrical Engineer (Represented)","company":"Metropolitan Transportation Authority","location":"Brooklyn, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5afc06686b4755d1e17e18?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j124"},{"title":"Hardware Design Engineer","company":"Hyve Solutions","location":"Greater Bend Area, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6941f13b549b0b531d4a74?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j125"},{"title":"Hardware Design Engineer","company":"Hyve Solutions","location":"Fremont, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a693eea36d36c1ff2998e58?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j126"},{"title":"Electrical Engineer","company":"General Fusion","location":"Richmond, BC, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a595a844da96a42cfd90ac4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j127"},{"title":"Entry Level Electrical Engineer - Boston, MA","company":"PAE","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6293131e089c0cc884d63a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j128"},{"title":"Junior Electrical Engineer","company":"DS2","location":"Niceville, FL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a69109b36d36c1ff2997e91?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j129"},{"title":"Patent Agent or Technical Advisor - Electrical Engineering (Seattle, WA; Palo Alto, CA; Denver, CO; Salt Lake City, UT) (#4027)","company":"Dorsey & Whitney LLP","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6930cc7fef4b48533d14f4e0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j130"},{"title":"Entry Level Electrical Engineer","company":"D&B Engineers and Architects","location":"Lindenhurst, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a34c388f6b55d12c791df36?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j131"},{"title":"Electrical Engineer","company":"Horizon Hobby","location":"Champaign, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a68cf875d01972698ee4673?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j132"},{"title":"Junior Electrical Engineering Specialist","company":"STV","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a68c1e268652d68b314a136?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j133"},{"title":"New Grad Electrical Engineer - Power Studies","company":"Shermco Industries","location":"Irving, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5786a610c4d945d864e98a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j134"},{"title":"New Grad Electrical Engineer - Power Studies","company":"Shermco Industries","location":"US-TX-Irving","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69b24b93ad360c0340a706a8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j135"},{"title":"Power Electronics - Electrical Engineer II","company":"Shield AI","location":"SD Metro Area","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69f5f4b812f2811ab5a664ee?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j136"},{"title":"Electrical Engineer - Entry Level","company":"Swanson Rink","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a67e4873b5e6b116a5513ea?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j137"},{"title":"Marketing Specialist, CRM Campaigns","company":"Bright Horizons","location":"Newton Massachusetts 02459, United States of America","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a58e68dc8e3a473cb8a3a41?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j138"},{"title":"Resident Engagement Specialist / Stadium Place","company":"Pillar Properties","location":"Seattle, WA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a694835ceb2691dfb2083ae?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j139"},{"title":"Product Marketing Specialist","company":"Alarm.com","location":"Tysons, VA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5385b68576ec69c015002b?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j140"},{"title":"Jr. Product Marketing Manager - Erlanger, KY","company":"ADM","location":"Erlanger, KY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6927ef5d01972698ee6b6c?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j141"},{"title":"Digital Advertising Operations Specialist","company":"OTT Advisors","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a68fe03ceb2691dfb206b0c?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j142"},{"title":"Product Marketing Engineer","company":"OMNIVISION","location":"Santa Clara, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a57786410c4d945d864e43c?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j143"},{"title":"Marketing and Digital Operations Associate","company":"Sage Consulting Group","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a55f1e5392ae330b30e819e?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j144"},{"title":"Inbound Growth Specialist","company":"Klaviyo","location":"Boston, MA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-28","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a67a85c2bf1fb2b719264cd?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j145"},{"title":"Product Operations Analyst - Encore Program Internship","company":"Texas Instruments","location":"Dallas, TX, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-28","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a691a523b549b0b531d3f25?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j146"},{"title":"Assistant Product Manager","company":"ReaderLink","location":"Oak Brook, IL, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-27","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a552a092084cd792b476936?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j147"},{"title":"Graduate product manager","company":"Bending Spoons","location":"Cambridge, England, United Kingdom","type":"Product Manager","jobType":"fulltime","posted":"2026-07-27","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6811cb3b5e6b116a551e58?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j148"},{"title":"Graduate product manager","company":"Bending Spoons","location":"Oxford, England, United Kingdom","type":"Product Manager","jobType":"fulltime","posted":"2026-07-27","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a696f5212e2925ae3f99e33?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j149"},{"title":"Product Operations Associate","company":"Daisy","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a53c5a38a74e077472f986d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j150"},{"title":"Product Operations Associate","company":"Daisy","location":"NY, New York, US","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a2ef7dfa1d15e3c5530037c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j151"},{"title":"Electrical Design Engineer Co-Op","company":"Epstein Architecture, Engineering and Construction","location":"Raleigh, NC, United States","type":"Hardware","jobType":"intern","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55cc0aef22935f2e3f7341?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j152"},{"title":"Electrical Design Engineer","company":"Stryker","location":"Portage, MI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a67d07b5d2a117fb9ced64a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j153"},{"title":"Electrical Engineer - 1613","company":"Scientific Applications & Research Associates (SARA), Inc.","location":"Colorado Springs, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e9a960ea38951a6ff3d52?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j154"},{"title":"Electrical Engineer - 1607","company":"Scientific Applications & Research Associates (SARA), Inc.","location":"Colorado Springs, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4cd85cd27b2c4dda9b5709?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j155"},{"title":"Electrical Engineer","company":"CRB","location":"Rockville, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55d13d2ce8bf79a13a17b7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j156"},{"title":"Electrical Design Engineer","company":"Kistler Group","location":"Amherst, NY, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a46bb233dbab558e29a864b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j157"},{"title":"Electrical Engineer","company":"Gromelski & Associates, Inc.","location":"Manassas, VA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a42842b6faf756060966fd0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j158"},{"title":"Electrical Engineer 1 (Entry Level) - Energy & Industrial","company":"Sargent & Lundy","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6775372bf1fb2b71925343?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j159"},{"title":"Entry Level Electrical Engineer","company":"MDP Engineering Group","location":"Denver Metropolitan Area, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a676764872eb74f9ead8da2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j160"},{"title":"Associate Electrical Engineer","company":"Harris Group","location":"Lafayette, California, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69f5066b12f2811ab5a6297e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j161"},{"title":"Inbound Growth Specialist","company":"Ecommerce Guide","location":"Boston, MA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a680af4d0fb4c3df393fe0d?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j162"},{"title":"Global CRM Coordinator (Hybrid Role - New York)","company":"OLAPLEX","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a679f422bf1fb2b7192606d?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j163"},{"title":"Ad Operations Specialist","company":"Miles Partnership","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6785a0872eb74f9ead96d2?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j164"},{"title":"Organic Growth Associate","company":"Jerry","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a678517872eb74f9ead968b?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j165"},{"title":"Integrated Marketing Operations Manager","company":"Christy Sports","location":"Lakewood, CO, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a67bbdf3b5e6b116a55049d?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j166"},{"title":"Graduate growth manager","company":"Bending Spoons","location":"Oxford, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a68336e457b63423812138b?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j167"},{"title":"Graduate growth manager","company":"Bending Spoons","location":"Cambridge, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a698aed78007e2966881e94?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j168"},{"title":"Coordinator, Product Marketing","company":"Medidata Solutions","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a677e6d2bda4d28428541a6?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j169"},{"title":"Amazon Organic Growth Specialist","company":"F&F Stores Ltd","location":"Milton Keynes, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a67fc732bf1fb2b71927e92?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j170"},{"title":"Marketing & Business Operations Associate","company":"Wisedocs","location":"Toronto, ON, Canada","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a640c70979290281c705445?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j171"},{"title":"GTM Engineer","company":"Firmable","location":"535 Mission St, San Francisco, US, 94105-2500, US","type":"Product Ops","jobType":"fulltime","posted":"2026-07-27","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a43784e501d340b4a82fcba?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j172"},{"title":"AI Product Management Intern","company":"Toshiba Global Commerce Solutions","location":"Durham, NC, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-27","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a67651a5d2a117fb9ceb26e?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j173"},{"title":"Graduate product manager","company":"Bending Spoons","location":"London, England, United Kingdom","type":"Product Manager","jobType":"fulltime","posted":"2026-07-26","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6708660c8e2b4f36dd6476?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j174"},{"title":"Assistant Product Manager","company":"Spencer's","location":"Egg Harbor, NJ","type":"Product Manager","jobType":"fulltime","posted":"2026-07-26","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a0f396980bf0430c7631b8e?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j175"},{"title":"Assistant Product Manager","company":"Spencer's","location":"Egg Harbor Township, NJ, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-26","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a32af5f29c90c607e4d777c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j176"},{"title":"Assistant Product Manager","company":"Spencer's","location":"US-NJ-Egg Harbor Township","type":"Product Manager","jobType":"fulltime","posted":"2026-07-26","source":"jobright-PM","url":"https://jobright.ai/jobs/info/69f23df5ecbc8c2f73209951?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j177"},{"title":"Associate Product Manager","company":"Supermicro","location":"San Jose, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-26","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a1a98e8c2a87d6cd3e00157?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j178"},{"title":"Interaction Designer, Google Maps","company":"Google","location":"New York, NY, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a55d8532ce8bf79a13a1d28?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j179"},{"title":"UX Designer","company":"Applied Systems","location":"United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a4524c30dd56c76cc2f26f4?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j180"},{"title":"JUNIOR ELECTRICAL ENGINEER-SW","company":"McLaughlin Research Corporation","location":"Keyport, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a664b995c7e2d715ebb33ab?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j181"},{"title":"Hardware Development Engineer I","company":"Relativity Space","location":"Long Beach, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0f70bc619335383fb2c692?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j182"},{"title":"Electrical Engineer - Gas Insulated Switchgear (GIS) (Early-to-Mid Career)","company":"Siemens","location":"Wendell, NC","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a471fde8204a812e98cb05e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j183"},{"title":"Project Engineer – Electrical Engineering","company":"Rehlko","location":"Kohler, WI","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69d6e3cf366bb95ba55509b5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j184"},{"title":"Hardware Development Engineer I","company":"Relativity Space","location":"Long Beach, California","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a24edd3757ade085b6b10b4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j185"},{"title":"Junior Electrical Engineer","company":"APTIM","location":"Knoxville, TN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5dbf0f63a8f619507d07f2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j186"},{"title":"Junior Electrical Engineer  --  Radiological Work","company":"APTIM","location":"Niskayuna, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5dbefb79547a520df5edde?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j187"},{"title":"Project Engineer – Electrical Engineering","company":"Rehlko","location":"Kohler,WI","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69d6dc71e63cea7a8b66cb60?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j188"},{"title":"Project Engineer – Electrical Engineering","company":"Rehlko","location":"Kohler,WI, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a56eb3de9b77f668bd6638b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j189"},{"title":"Associate Electrical Engineer (Mission Critical/Data Center)","company":"WSP in the U.S.","location":"New York, NY","type":"Hardware","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2c24e87cd40a338fae4e38?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j190"},{"title":"Graduate growth manager","company":"Bending Spoons","location":"London, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a6706f8979290281c70a848?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j191"},{"title":"Marketing Operations Specialist","company":"The University of Southern Mississippi","location":"Hattiesburg, MS, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a665d94e8d8d22e3292fffd?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j192"},{"title":"Associate Product Marketing Manager","company":"Quantifind","location":"New York, NY","type":"Product Ops","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/69f28ac08feca91f149257e5?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j193"},{"title":"Associate Product Marketing Manager","company":"Quantifind","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a549a8ac8eb0843027b0671?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j194"},{"title":"Associate Product Marketing Manager","company":"Quantifind","location":"New York City, NY","type":"Product Ops","jobType":"fulltime","posted":"2026-07-26","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a0703f0078fec52738a61fe?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j195"},{"title":"Product Manager Intern","company":"Pendulum","location":"United States","type":"Product Manager","jobType":"intern","posted":"2026-07-26","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a54a22ec8eb0843027b086a?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j196"},{"title":"Product Manager (2027 Graduates)","company":"Appian","location":"McLean, VA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a62630bd5caab4af8bada61?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j197"},{"title":"Product Operations Coordinator","company":"Everlane","location":"Los Angeles, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-25","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6446e2e8d8d22e3292c5f6?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j198"},{"title":"Jr. Product Designer, Web","company":"Digital Extremes","location":"London, ON, Canada","type":"Product Designer","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a356901ce501060b5cf41ee?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j199"},{"title":"Electrical Design Engineer Co-op (North Carolina State University)","company":"Siemens","location":"Wendell, NC","type":"Hardware","jobType":"intern","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a47f43d5d7b097d2df38ffe?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j200"},{"title":"Electrical Engineer","company":"CaptiveAire Systems","location":"East Petersburg, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51da27ae4052672fe9bf6f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j201"},{"title":"Associate Electrical Engineer (Mission Critical/Data Center)","company":"WSP in the U.S.","location":"Troy, NY","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2c683bd3ec94183f4bcc19?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j202"},{"title":"Associate Electrical Engineer (Mission Critical/Data Center)","company":"WSP in the U.S.","location":"New York, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59b8e1686b4755d1e11b12?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j203"},{"title":"CMOS Mixed-Signal Circuit Design Engineer","company":"Analog Bits","location":"Sunnyvale, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a526f77e726ec56126a3046?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j204"},{"title":"Electrical Engineering Co-op - Fall 2026/Winter 2027","company":"WSP in the U.S.","location":"Philadelphia, PA","type":"Hardware","jobType":"intern","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0f727312f8b43cf397f317?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j205"},{"title":"Electrical Engineering Co-op - Fall 2026/Winter 2027","company":"WSP in the U.S.","location":"510 Walnut Street, Philadelphia, PA, 19106, US","type":"Hardware","jobType":"intern","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0f3c5580bf0430c7631e18?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j206"},{"title":"Circuit Design Engineer - New College Grad 2026","company":"NVIDIA","location":"Santa Clara, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2c9b73d3ec94183f4bdbfc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j207"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Long Beach, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51e6c7ae4052672fe9ca9f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j208"},{"title":"Applied Machine Learning Engineer, Circuit Design - New College Grad 2026","company":"NVIDIA","location":"US, CA, Santa Clara, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51c14ebf63b66c7997c1dd?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j209"},{"title":"Early Professional, Electrical Engineering","company":"WSP in the U.S.","location":"1001 Fourth Avenue, Seattle, WA, 98154, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5cbd32686b4755d1e1c51f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j210"},{"title":"Early Professional, Electrical Engineering","company":"WSP in the U.S.","location":"9452 51 Ave NW, Edmonton, AB, T6E 5A6, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3367e8649fdf16292f1f28?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j211"},{"title":"Electrical Engineer, Implant Embedded Systems","company":"Neuralink","location":"Austin, Texas, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a07042b4a0a6a7e7d820750?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j212"},{"title":"Electrical Engineer, Implant Embedded Systems","company":"Neuralink","location":"Austin, TX","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0f625e619335383fb2bbdc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j213"},{"title":"Electrical Engineer - Decatur, IL","company":"ADM","location":"United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a64ada4e8d8d22e3292d350?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j214"},{"title":"Entry Level Electrical Engineer (Hybrid) - Fort Wayne, IN","company":"Military Spouse Jobs","location":"Fort Wayne, IN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a64ad96979290281c706a63?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j215"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Long Beach, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2aa2880ad4053b108c8102?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j216"},{"title":"Growth Analyst","company":"AppLovin","location":"Palo Alto, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-25","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a4d78c44c6c9f7a619f7e75?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j217"},{"title":"Methodology Product Operations Project Intern (TikTok Shop - US Operation) - 2026 Start (BS/MS)","company":"TikTok","location":"Los Angeles, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-25","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a651cf58d53603449607947?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j218"},{"title":"Product Manager Intern (TikTok-Product-Search Evaluation) - 2026 Summer (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-25","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a432c85cbf92c7bcd36e061?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j219"},{"title":"Associate Product Ownership - Junior Data Engineer","company":"Nestle","location":"North York, ON, Canada","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"simplify","url":"https://jobdetails.nestle.com/job/North-York-Associate-Product-Ownership-Jr_-Data-Engineer-(12-months-contract)-ON/1418872933/?ats=successfactors&utm_source=Simplify&ref=Simplify","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j220"},{"title":"New Grad 2025: Product Manager","company":"TikTok","location":"San Jose, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"vansh","url":"https://lifeattiktok.com/search/7400808756194461961?spread=5MWH5CQ&utm_source=apmseason&utm_source=vansh&ref=vansh","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j221"},{"title":"Associate Product Manager Program","company":"Perplexity","location":"San Francisco, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"vansh","url":"https://www.perplexity.ai/hub/associate-product-manager","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j222"},{"title":"Associate Product Manager","company":"Salesforce","location":"San Francisco, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"vansh","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j223"},{"title":"Associate Product Manager","company":"Arcade","location":"Presidio, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-25","source":"vansh","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j224"},{"title":"Associate Product Manager, New Grad","company":"IXL Learning","location":"San Mateo, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a46c49fc2d11a6a46670671?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j225"},{"title":"Product Manager","company":"Workday","location":"USA, OH, Mason, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4618034f64ba41dcb4fd12?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j226"},{"title":"Product Manager","company":"UCSF Health","location":"San Francisco, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6409b287cef057612cbacf?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j227"},{"title":"Associate Product Manager, New Grad (2027 Start)","company":"Databricks","location":"Bellevue, WA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5908d5c8e3a473cb8a4916?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j228"},{"title":"Associate Product Ownership - Jr. Data Engineer (12-months contract)","company":"Nestlé","location":"North York, CA, Canada","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6399958d536034496034ac?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j229"},{"title":"Associate Product Manager - Expansion","company":"Stanley Black & Decker, Inc.","location":"Towson, MD, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4d4ca3d27b2c4dda9b706c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j230"},{"title":"Associate Technical Product Manager","company":"Compassionate Home Caregivers","location":"Melville, NY, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-24","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a57dff468d16a30e24102e6?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j231"},{"title":"UX Designer, Shopping Design","company":"Amazon","location":"Seattle, WA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a638e5a8d53603449602dc1?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j232"},{"title":"Denture Digital Designer Trainee - Remote","company":"Aspen Dental","location":"Illinois, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a470db53dbab558e29a9991?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j233"},{"title":"Fall 2026: Product Design Engineering Co-op, Advanced Development (July/August to December)","company":"SharkNinja","location":"Needham, MA, United States","type":"Product Designer","jobType":"intern","posted":"2026-07-24","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a46a7bd8204a812e98c956c?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j234"},{"title":"Electrical Engineer I","company":"Cintas","location":"Florence, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6287fec28982326de97591?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j235"},{"title":"Electrical Engineer","company":"Starcloud","location":"Redmond, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a52f9918a74e077472f6c3a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j236"},{"title":"Electrical Engineering Intern/Co-Op","company":"TYLin","location":"Toronto, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6396a3e8d8d22e3292999d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j237"},{"title":"Electrical Engineering Internships/Co-ops - $22/hr","company":"RCT Systems","location":"Baltimore, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a63d049e8d8d22e3292ae4e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j238"},{"title":"Electrical Design Engineer (HE LLC) (53938)","company":"Hanley Energy","location":"Ashburn, VA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a63cf04979290281c7044ae?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j239"},{"title":"Electrical Engineer Associate I","company":"DB Sterlin Consultants, Inc.","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a63cea08d53603449604737?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j240"},{"title":"Electrical Engineer","company":"Captiveaire - Region 114 Western PA","location":"East Petersburg, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a63c995e8d8d22e3292aae1?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j241"},{"title":"Assistant Electrical Engineer, Transmission & Distribution - Network, Integration & Automation (Denver)","company":"Burns & McDonnell","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a513c4ebf63b66c7997a10a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j242"},{"title":"ASIC Hardware Design Engineer - New College Grad 2026","company":"NVIDIA","location":"Austin, TX","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69d563c7e63cea7a8b660e85?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j243"},{"title":"ASIC Hardware Design Engineer - New College Grad 2026","company":"NVIDIA","location":"US, TX, Austin, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a56562be9b77f668bd62abf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j244"},{"title":"Electrical Engineer","company":"Vitesse Systems","location":"Webster, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a560edee9b77f668bd61334?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j245"},{"title":"Associate Electrical Engineer","company":"Keenfinity Group","location":"Fairport, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5109dd57513b72e0c63564?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j246"},{"title":"Entry Level Electrical Engineer","company":"Jacobs","location":"Philadelphia, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a61314dab14335fc0f16b7f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j247"},{"title":"Electrical Engineer, Robotics Hardware","company":"FieldAI","location":"Irvine, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51dce802522b5b722ecabf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j248"},{"title":"Electrical Engineer","company":"FFE Inc.","location":"Cincinnati, OH, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6380518d53603449602a39?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j249"},{"title":"Entry Level Electrical Engineer","company":"Amentum","location":"US-MD-Lexington Park, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e5ed6fc327f422fef26f7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j250"},{"title":"Assistant Electrical Engineer","company":"City of New York","location":"New York, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a50f4e9bf63b66c7997799d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j251"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Warrenville, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a622b7007e15f1ab0e44a61?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j252"},{"title":"Electrical Engineer","company":"Mizuho OSI","location":"Union City, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a6329767c70964cbb055b47?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j253"},{"title":"Ad Operations Specialist","company":"PENN Interactive","location":"Toronto, ON, Canada","type":"Product Ops","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a643b4c87cef057612cc300?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j254"},{"title":"Marketing Operations Assistant","company":"American Enterprise Institute","location":"Washington, DC, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a444248ef17a815538a38e8?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j255"},{"title":"Marketing Operations Specialist","company":"Mississippi INBRE","location":"Hattiesburg, MS, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a63a91487cef057612c9d77?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j256"},{"title":"Growth Operations Associate","company":"AlphaSights","location":"New York, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/68cf9527fb49c96ca6ea98f7?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j257"},{"title":"Growth Operations Associate","company":"AlphaSights","location":"New York","type":"Product Ops","jobType":"fulltime","posted":"2026-07-24","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/67c5bcf70855b43f13ba95dc?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j258"},{"title":"Internship Global Product Management (m/f/d)","company":"1KOMMA5°","location":"United States","type":"Product Manager","jobType":"intern","posted":"2026-07-24","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a63ac8de8d8d22e3292a008?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j259"},{"title":"Electrical Hardware Engineer- Avionics","company":"Pittsburgh Robotics Network","location":"Pittsburgh, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-23","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a630d4899515267a6f010f7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j260"},{"title":"Entry Level Electrical Engineer","company":"Naval Nuclear Laboratory (FMP)","location":"Idaho Falls, ID, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-23","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ea4b3050c423c792f0970?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j261"},{"title":"Entry Level Computer & Electrical Engineer Electrical","company":"Naval Nuclear Laboratory (FMP)","location":"West Mifflin, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-23","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a56bb7121f64463ad356a7c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j262"},{"title":"Entry Level Computer & Electrical Engineer Electrical","company":"Naval Nuclear Laboratory (FMP)","location":"Niskayuna, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-23","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a56bb6ee9b77f668bd6577a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j263"},{"title":"Associate Product Manager New Grad","company":"🔥 Databricks","location":"SFBellevue, WAMountain View, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"simplify","url":"https://boards.greenhouse.io/embed/job_app?token=7586263002&utm_source=Simplify&ref=Simplify","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j264"},{"title":"HBM Product Manager – New College Grad 🎓","company":"Micron Technology","location":"Boise, ID","type":"Product Manager","jobType":"fulltime","posted":"2026-07-04","source":"simplify","url":"https://micron.wd1.myworkdayjobs.com/External/job/Boise-ID---Main-Site/HBM-Product-Manager--New-College-Grad-_JR102001","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j265"},{"title":"Associate Product Manager New Grad","company":"IXL Learning","location":"San Mateo, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-03","source":"simplify","url":"https://www.ixl.com/company/jobs?gh_jid=8615730002&utm_source=Simplify&ref=Simplify","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j266"},{"title":"Technical Artist, UI Design","company":"Tesla","location":"Hawthorne, CA","type":"Product Designer","jobType":"fulltime","posted":"2026-06-30","source":"vansh","url":"https://www.tesla.com/careers/search/job/239333","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j267"},{"title":"Data Engineer 1 - AWS WW Field Enablement - Analytics and Product Operations","company":"🔥 Amazon","location":"Seattle, WA","type":"Product Ops","jobType":"fulltime","posted":"2026-06-08","source":"simplify","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j268"},{"title":"Junior Product Designer - Unified Trading","company":"MiQ","location":"London, UK","type":"Product Designer","jobType":"fulltime","posted":"2026-06-08","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j269"},{"title":"Associate Product Manager – New Grad","company":"IXL Learning","location":"San Mateo, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-05-13","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j270"},{"title":"Product Manager – Early Career - Release Products","company":"Seagate Technology","location":"Shakopee, MNLongmont, CO","type":"Product Manager","jobType":"fulltime","posted":"2026-05-13","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j271"},{"title":"Junior Software Developer - UI/UX - Software Development","company":"Harris Computer","location":"Remote in Canada","type":"Product Designer","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j272"},{"title":"Product Manager – New Grad","company":"Uncountable","location":"SFNYC","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"https://jobs.ashbyhq.com/uncountable/1f8425be-cd39-4397-a9c1-6511ecfc39fc/application","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j273"},{"title":"Product Manager – Early Career","company":"🔥 Salesforce","location":"Seattle, WASFBellevue, WA","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j274"},{"title":"New College Grad - HBM Product Manager","company":"Micron Technology","location":"San Jose, CABoise, ID","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j275"},{"title":"Associate Product Manager New College Grad","company":"Applied Materials","location":"Austin, TX","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j276"},{"title":"Entry Level Product Manager - UK","company":"Grafana Labs","location":"Remote in UK","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j277"},{"title":"Entry Level Product Manager - US","company":"Grafana Labs","location":"Remote in USA","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j278"},{"title":"Entry Level Product Manager - Canada","company":"Grafana Labs","location":"Remote in Canada","type":"Product Manager","jobType":"fulltime","posted":"2026-04-17","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j279"},{"title":"Associate Product Manager - New Grad","company":"IXL Learning","location":"San Mateo, CA","type":"Product Manager","jobType":"fulltime","posted":"2026-03-22","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j280"},{"title":"Early Career: Associate Data Science Product Manager - NYC","company":"Red Ventures","location":"NYC","type":"Product Manager","jobType":"fulltime","posted":"2026-03-22","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j281"},{"title":"Product Manager","company":"Uncountable","location":"San FranciscoNew YorkLondon","type":"Product Manager","jobType":"fulltime","posted":"2026-02-24","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j282"},{"title":"Junior Product Manager - Aiviq","company":"Alpha FMC","location":"London, UK","type":"Product Manager","jobType":"fulltime","posted":"2026-01-29","source":"simplify","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j283"},{"title":"New Grad: Junior Product Manager","company":"Adobe","location":"San Francisco, CA</br>San Jose, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-09-12","source":"vansh","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j284"},{"title":"New Grad 2026: Product Manager (SMB)","company":"ByteDance","location":"Austin, TX","type":"Product Manager","jobType":"fulltime","posted":"2025-09-08","source":"vansh","url":"https://joinbytedance.com/search/7534966101852539144","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j285"},{"title":"Product Designer","company":"Figma","location":"San Francisco, CA</br>New York, NY","type":"Product Designer","jobType":"fulltime","posted":"2025-09-08","source":"vansh","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j286"},{"title":"Associate Product Manager","company":"Figma","location":"San Francisco, CA</br>New York, NY","type":"Product Manager","jobType":"fulltime","posted":"2025-09-08","source":"vansh","url":"","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j287"},{"title":"New Grad 2026: Associate Product Manager","company":"Roblox","location":"San Mateo, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-09-03","source":"vansh","url":"https://careers.roblox.com/jobs/7167343","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j288"},{"title":"Associate Product Builder (APB) - Rotational Program","company":"LinkedIn","location":"Mountain View, CA</br>San Francisco, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-09-03","source":"vansh","url":"https://jobs.smartrecruiters.com/LinkedIn3/a3b09881-7c3e-444c-9e65-ac0e2c6a8970","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j289"},{"title":"Product Manager Ads Measurement Graduate (Measurement Signal and Privacy Product)","company":"TikTok","location":"San Jose, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-08-19","source":"vansh","url":"https://lifeattiktok.com/search/7538903496654407943","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j290"},{"title":"Product Manager Ads Attribution and Measurement Graduate (Measurement Signal and Privacy Product)","company":"TikTok","location":"San Jose, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-08-19","source":"vansh","url":"https://lifeattiktok.com/search/7538896306908252434","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j291"},{"title":"New Grad 2026: Product Manager, Content Ecosystem","company":"TikTok","location":"San Jose, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-08-13","source":"vansh","url":"https://lifeattiktok.com/search/7532815853353863432?spread=5MWH5CQ&utm_source=vansh&ref=vansh","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j292"},{"title":"New Grad 2026: Product Manager (SMB)","company":"TikTok","location":"Austin, TX","type":"Product Manager","jobType":"fulltime","posted":"2025-08-13","source":"vansh","url":"https://lifeattiktok.com/search/7534966101852539144?spread=5MWH5CQ&utm_source=vansh&ref=vansh","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j293"},{"title":"New Grad 2026: Product Manager Graduate (TikTok Shop User Product)","company":"TikTok","location":"Seattle, WA","type":"Product Manager","jobType":"fulltime","posted":"2025-08-13","source":"vansh","url":"https://lifeattiktok.com/search/7532281787985840392?spread=5MWH5CQ&utm_source=vansh&ref=vansh","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j294"},{"title":"Product Manager, Growth","company":"Hume AI","location":"New York, NY</br>Remote</br>San Francisco, CA","type":"Product Manager","jobType":"fulltime","posted":"2025-08-05","source":"vansh","url":"","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j295"},{"title":"Associate Product Manager - Consumer Experience","company":"StubHub","location":"New York, NY","type":"Product Manager","jobType":"fulltime","posted":"2025-08-03","source":"vansh","url":"https://job-boards.eu.greenhouse.io/stubhubinc/jobs/4648133101","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":[],"id":"j296"}];
  const [jobs,setJobs]=useState(INITIAL_JOBS);
  const [lang,setLang]=useState("zh");
  const [view,setView]=useState("dashboard");
  const [filter,setFilter]=useState({type:"all",search:"",window:"24h",h1bOnly:false,jobType:"all"});
  const [showAdd,setShowAdd]=useState(false);
  const [editJob,setEditJob]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [refreshing,setRefreshing]=useState(false);
  const [refreshMsg,setRefreshMsg]=useState("");
  const [showHelp,setShowHelp]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const t=I18N[lang];

  useEffect(()=>{(async()=>{
    try{
      const r=await window.storage.get("op2-data");
      if(r?.value){
        const stored=JSON.parse(r.value);
        if(stored.length>0){
          const cleaned=stored.filter(j=>j.h1b!=="no-intl"&&j.h1b!=="staffing");
          // merge: keep user's tracked jobs, add any baked-in jobs they don't have
          const keys=new Set(cleaned.map(j=>`${j.company}::${j.title}::${j.location}`.toLowerCase()));
          const fresh=INITIAL_JOBS.filter(j=>!keys.has(`${j.company}::${j.title}::${j.location}`.toLowerCase()));
          setJobs([...fresh,...cleaned]);
        }
      }
    }catch{}
    try{const r=await window.storage.get("op2-lang");if(r?.value)setLang(r.value);}catch{}
    setLoaded(true);
  })();},[]);
  useEffect(()=>{if(loaded){(async()=>{try{await window.storage.set("op2-data",JSON.stringify(jobs))}catch{}})();}},[jobs,loaded]);
  useEffect(()=>{if(loaded){(async()=>{try{await window.storage.set("op2-lang",lang)}catch{}})();}},[lang,loaded]);

  const WINDOW_DAYS={ "24h":1, "7d":7, "30d":30, "all":99999 };
  const filtered=jobs.filter(j=>{
    // 查档模式: 搜索时绕过所有过滤器, 在全库中查找 (含已投递/已拒/任何时间)
    if(filter.search){const s=filter.search.toLowerCase();return j.title.toLowerCase().includes(s)||j.company.toLowerCase().includes(s)||j.location.toLowerCase().includes(s);}
    if(filter.type!=="all"&&j.type!==filter.type)return false;
    if(j.jobType==="intern"&&seasonBlocked(j.title,"intern"))return false;
    if(filter.jobType!=="all"&&(j.jobType||"fulltime")!==filter.jobType)return false;
    if(filter.h1bOnly&&j.h1b!=="likely")return false;
    const age=Math.floor((new Date()-new Date(j.posted))/864e5);
    if(j.stage==="saved" && age>WINDOW_DAYS[filter.window])return false;
    return true;
  }).sort((a,b)=>b.posted.localeCompare(a.posted));

  const stats=useMemo(()=>({
    total:jobs.length,applied:jobs.filter(j=>j.stage!=="saved").length,
    referrals:jobs.filter(j=>["referral_asked","referral_got"].includes(j.stage)).length,
    interviews:jobs.filter(j=>j.stage==="interview").length,
    offers:jobs.filter(j=>j.stage==="offer").length,
    pm:jobs.filter(j=>j.type==="Product Manager").length,
    pd:jobs.filter(j=>j.type==="Product Designer").length,
    hw:jobs.filter(j=>j.type==="Hardware").length,
    pjm:jobs.filter(j=>j.type==="Project Management").length,
    ops:jobs.filter(j=>j.type==="Product Ops").length,
  }),[jobs]);

  const moveJob=(id,ns)=>setJobs(p=>p.map(j=>j.id===id?{...j,stage:ns}:j));

  const doRefresh=async()=>{
    setRefreshing(true);setRefreshMsg("");
    try{
      const{jobs:f,errors:e}=await fetchLive();
      if(!f.length){setRefreshMsg(e.length?t.fetchFail:t.fetchNone);setRefreshing(false);return;}
      setJobs(p=>{
        const ex=new Set(p.map(j=>`${j.company}::${j.title}::${j.location}`.toLowerCase()));
        const nw=f.filter(j=>!ex.has(`${j.company}::${j.title}::${j.location}`.toLowerCase()));
        setRefreshMsg(t.fetchOk(f.length,nw.length));
        return[...nw,...p];
      });
      try{await window.storage.set("op2-last-fetch",Date.now().toString());}catch{}
    }catch{setRefreshMsg(t.fetchBlocked);}
    setRefreshing(false);
  };

  // 打开自动抓取: 距上次抓取>1小时才触发, 避免频繁请求
  useEffect(()=>{
    if(!loaded)return;
    (async()=>{
      let last=0;
      try{const r=await window.storage.get("op2-last-fetch");if(r?.value)last=parseInt(r.value)||0;}catch{}
      if(Date.now()-last>36e5)doRefresh();
    })();
  },[loaded]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E8E0F0 0%, #F0E4E8 20%, #F5EDE0 40%, #E0ECE8 60%, #DCE4F0 80%, #F0E8F4 100%)",
      fontFamily: "'DM Sans', 'Inter', -apple-system, 'PingFang SC', sans-serif",
      color: "#2C2C3A",
      letterSpacing: "-0.01em",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 32px" }}>
        {/* ===== Header ===== */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: "#5A5A6E" }}>
            Offer<span style={{ fontWeight: 300 }}>Pilot</span>
          </div>
          {/* Nav */}
          <div style={{ display: "flex", gap: 4, marginLeft: 20 }}>
            {[{id:"dashboard",l:t.dashboard},{id:"jobs",l:t.jobs},{id:"pipeline",l:t.pipeline},{id:"lab",l:t.lab},{id:"channels",l:t.channels}].map(n => (
              <button key={n.id} onClick={() => setView(n.id)} style={{
                padding: "8px 22px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 500,
                background: view === n.id ? "rgba(255,255,255,0.75)" : "transparent",
                color: view === n.id ? "#2C2C3A" : "#8A8A9A",
                backdropFilter: view === n.id ? "blur(10px)" : "none",
                boxShadow: view === n.id ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
                cursor: "pointer", transition: "all 0.25s",
              }}>{n.l}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <input placeholder={t.searchPlaceholder} value={filter.search} onChange={e => setFilter(f => ({ ...f, search: e.target.value }))}
            style={{ padding: "9px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.45)", backdropFilter: "blur(10px)", fontSize: 13, width: 200, outline: "none", color: "#2C2C3A" }} />
          {/* Lang */}
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowMenu(m => !m)} style={{ padding: "8px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.5)", background: showMenu ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 14, cursor: "pointer", color: "#5A5A6E", backdropFilter: "blur(8px)", fontWeight: 700 }}>⋯</button>
            {showMenu && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "rgba(252,252,254,0.98)", borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.14)", padding: 6, minWidth: 180, zIndex: 500 }}>
                <button onClick={() => { setShowMenu(false); setShowHelp(true); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: "none", borderRadius: 10, fontSize: 12.5, color: "#2C2C3A", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  ❓ {t.menuHelp}
                </button>
                <button onClick={async () => {
                  setShowMenu(false);
                  const keys = ["op2-data","op2-lang","op2-resumes","op2-active-resume","op2-portfolio","op2-reports"];
                  const dump = {};
                  for (const k of keys) { try { const r = await window.storage.get(k); if (r?.value) dump[k] = r.value; } catch {} }
                  const blob = new Blob([JSON.stringify({ app: "offerpilot", exported: new Date().toISOString(), data: dump })], { type: "application/json" });
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `offerpilot-backup-${new Date().toISOString().split("T")[0]}.json`;
                  a.click(); URL.revokeObjectURL(a.href);
                }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: "none", borderRadius: 10, fontSize: 12.5, color: "#2C2C3A", cursor: "pointer", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  ⤓ {t.menuExport}
                </button>
                <label style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", borderRadius: 10, fontSize: 12.5, color: "#2C2C3A", cursor: "pointer", boxSizing: "border-box" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.04)"} onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  ⤒ {t.menuImport}
                  <input type="file" accept=".json" style={{ display: "none" }} onChange={async e => {
                    setShowMenu(false);
                    const f = e.target.files && e.target.files[0]; if (!f) return;
                    try {
                      const parsed = JSON.parse(await f.text());
                      if (parsed.app !== "offerpilot" || !parsed.data) { alert(t.importBad); return; }
                      for (const [k, v] of Object.entries(parsed.data)) { try { await window.storage.set(k, v); } catch {} }
                      alert(t.importOk); location.reload();
                    } catch { alert(t.importBad); }
                  }} />
                </label>
              </div>
            )}
          </div>
          <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 999, padding: 3, backdropFilter: "blur(8px)" }}>
            {["zh", "en"].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: "5px 14px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 600,
                background: lang === l ? "#fff" : "transparent", color: lang === l ? "#2C2C3A" : "#9A9AAA",
                cursor: "pointer", boxShadow: lang === l ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              }}>{l === "zh" ? "中" : "EN"}</button>
            ))}
          </div>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", margin: 0 }}>{t.greeting.replace("!", "")}</h1>
          <span style={{ fontSize: 14, color: "#8A8A9A", fontWeight: 400 }}>{t.subtitle}</span>
          <div style={{ flex: 1 }} />
          <button onClick={doRefresh} disabled={refreshing} style={{
            padding: "9px 22px", borderRadius: 999, border: "none", fontSize: 12.5, fontWeight: 500,
            background: "linear-gradient(135deg, rgba(123,175,139,0.2), rgba(123,175,139,0.1))",
            color: "#5A8A6A", cursor: refreshing ? "wait" : "pointer",
            backdropFilter: "blur(8px)",
          }}>{refreshing ? t.refreshing : `↻  ${t.refresh}`}</button>
        </div>

        {refreshMsg && <div style={{ fontSize: 12, color: "#5A8A6A", marginBottom: 14, fontWeight: 500 }}>{refreshMsg}</div>}

        {/* ===== Horizontal stat bar ===== */}
        {view === "dashboard" && <StatBar stats={stats} t={t} />}

        {/* Views */}
        {view === "dashboard" && <Dashboard stats={stats} jobs={jobs} t={t} setEditJob={setEditJob} />}
        {view === "jobs" && <JobBoard jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} requestDelete={setConfirmDel} setEditJob={setEditJob} t={t} />}
        {view === "pipeline" && <PipelineView jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} setEditJob={setEditJob} t={t} />}
        {view === "lab" && <ResumeLab t={t} lang={lang} />}
        {view === "channels" && <Channels t={t} lang={lang} />}
      </div>

      {showHelp && <HelpModal lang={lang} onClose={() => setShowHelp(false)} />}
      {showAdd && <JobModal t={t} onSave={j => { setJobs(p => [{ ...j, id: Date.now().toString() }, ...p]); setShowAdd(false); }} onClose={() => setShowAdd(false)} />}
      {editJob && <JobModal t={t} job={editJob} onSave={u => { setJobs(p => p.map(j => j.id === u.id ? u : j)); setEditJob(null); }} onDelete={id => { setJobs(p => p.filter(j => j.id !== id)); setEditJob(null); }} onClose={() => setEditJob(null)} />}

      {/* Delete confirm modal */}
      {confirmDel && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,58,0.3)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }} onClick={() => setConfirmDel(null)}>
          <div style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(24px)", borderRadius: 20, padding: 26, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid rgba(255,255,255,0.6)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>🗑 {t.delete}</div>
            <div style={{ fontSize: 13, color: "#5A5A6E", lineHeight: 1.5, marginBottom: 20 }}>{t.confirmDelete(confirmDel.title, confirmDel.company)}</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setConfirmDel(null)} style={{ flex: 1, padding: 11, background: "rgba(0,0,0,0.05)", color: "#5A5A6E", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {t.cancel}
              </button>
              <button onClick={() => { setJobs(p => p.filter(j => j.id !== confirmDel.id)); setConfirmDel(null); }} style={{ flex: 1, padding: 11, background: "linear-gradient(135deg, #C47B8B, #A05A6A)", color: "#fff", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {t.confirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{
        position: "fixed", bottom: 28, right: 28, width: 50, height: 50, borderRadius: "50%",
        background: "linear-gradient(135deg, #9B8EC4, #7BA1C7)",
        color: "#fff", border: "none", fontSize: 22, cursor: "pointer",
        boxShadow: "0 4px 20px rgba(155,142,196,0.4)",
        display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 300,
      }}>+</button>
    </div>
  );
}

// ===== Horizontal stat bar (like reference top row) =====
function StatBar({ stats, t }) {
  const items = [
    { label: t.tracked, value: stats.total, pct: 100 },
    { label: t.applied, value: stats.applied, pct: stats.total ? Math.round(stats.applied / stats.total * 100) : 0 },
    { label: t.referralsActive, value: stats.referrals, pct: stats.total ? Math.round(stats.referrals / stats.total * 100) : 0 },
    { label: t.interviews, value: stats.interviews, pct: stats.total ? Math.round(stats.interviews / stats.total * 100) : 0 },
    { label: t.offers, value: stats.offers, pct: stats.total ? Math.round(stats.offers / stats.total * 100) : 0 },
  ];
  return (
    <Glass style={{ padding: "16px 28px", marginBottom: 18, display: "flex", alignItems: "center", gap: 0 }}>
      {items.map((it, i) => (
        <div key={i} style={{ flex: 1, display: "flex", alignItems: "center", gap: 10, borderLeft: i > 0 ? "1px solid rgba(0,0,0,0.06)" : "none", paddingLeft: i > 0 ? 20 : 0 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "#2C2C3A" }}>{it.pct}%</div>
            <div style={{ fontSize: 11, color: "#9A9AAA", fontWeight: 400, marginTop: 2 }}>{it.label}</div>
          </div>
          <span style={{ fontSize: 11, color: "#B0B0BA" }}>({it.value})</span>
        </div>
      ))}
    </Glass>
  );
}


// ===== 今日必投: 按胜率表自动打分 =====
function scorePick(j, t) {
  let score = 0; const why = [];
  const ti = j.title.toLowerCase();
  // 赛道权重 (她的胜率表)
  if (j.type === "Product Ops" || j.type === "Project Management") { score += 30; why.push(t.pkOps); }
  else if (j.type === "Product Manager" && /growth|crm|lifecycle|retention/.test(ti)) { score += 28; why.push(t.pkGrowth); }
  else if (j.type === "Product Manager" && /\bai\b|\bml\b|intelligen|llm|agent/.test(ti)) { score += 24; why.push(t.pkAI); }
  else if (j.type === "Product Designer") { score += 18; }
  else if (j.type === "Product Manager") { score += 15; }
  else { score += 8; }
  // 地理
  if (/seattle|bellevue|redmond|kirkland|, wa\b/i.test(j.location)) { score += 20; why.push(t.pkLocal); }
  else if (/remote/i.test(j.location + " " + ti)) { score += 8; why.push(t.pkRemote); }
  // H1B
  if (j.h1b === "likely") { score += 15; why.push("H1B✓"); }
  // 新鲜度
  const age = Math.floor((new Date() - new Date(j.posted)) / 864e5);
  if (age <= 0) { score += 10; why.push(t.pkToday); }
  else if (age === 1) { score += 5; }
  // 全职优先 (毕业前主战场)
  if (j.jobType === "fulltime") score += 5;
  return { score, why };
}


// ===== 使用指南 =====
const HELP = {
  zh: [
    ["🔍 搜索框（查档模式）", "输入任意连续字符即可匹配公司名、职位名或地点（如输入 veev 找 Veeva）。搜索时自动忽略所有筛选器和时间窗口，在全部数据中查找——包括你已投递、已拒的历史岗位。想确认某公司投过没有：直接搜名字，看阶段列。"],
    ["📥 岗位页", "每天自动从8个开源仓库抓取新岗位（打开网站自动刷新，1小时冷却）。默认显示24小时内新发；筛选器：时间窗口 / 全职·实习 / 🌱只看H1B友好 / 五类岗位标签。已过滤：Senior岗、TPM、仅限美国公民、猎头、超出资格窗口的实习。"],
    ["📌 今日必投", "概览页顶部，按赛道胜率自动为近48小时新岗打分排序（Ops/PjM > Growth/CRM > AI > 其他），叠加本地、H1B、新发加分。点击条目直接编辑，↗ 直达申请页。"],
    ["🗂 看板", "七阶段管道：收藏→已投递→求内推→获内推→面试中→Offer / 已拒。拖不了卡片时用岗位行的下拉框改阶段。手动添加的岗位（右下角+）与抓取岗位完全同权：一样计入统计、漏斗和趋势图。"],
    ["🤖 简历工坊", "上传简历（.md/.txt）→ 贴JD（公司职位自动识别）→ 🎯帮我选简历 → 生成报告：匹配分、ATS关键词、persona解码、带保护规则的bullet改写、AI反问。不满意就在报告下方对话微调；改完简历用同一JD重测看分数变化。需要自己的 Anthropic API Key（只存本机浏览器）。"],
    ["🚄 直通车", "大厂官方校招入口合集（APM项目、设计、硬件、Startup平台）——Amazon/Google 这类只发自家官网的岗位走这里+LinkedIn alert，不经过抓取管道。"],
    ["💾 数据与隐私", "所有数据（简历、看板、报告、Key）只存在你自己浏览器的 localStorage，不上传任何服务器。⤓ 导出JSON备份（不含Key），⤒ 导入恢复。换电脑/清缓存前记得先导出。"],
  ],
  en: [
    ["🔍 Search (lookup mode)", "Type any contiguous characters to match company, title, or location (e.g. 'veev' finds Veeva). Search bypasses all filters and time windows — it looks through your entire library including applied and rejected jobs. To check if you've applied somewhere: search the name, read the stage column."],
    ["📥 Jobs", "Auto-fetches daily from 8 open-source repos (on page load, 1h cooldown). Defaults to last 24h; filters: time window / full-time·intern / 🌱H1B-friendly / five role tags. Pre-filtered out: senior roles, TPM, citizens-only, staffing agencies, out-of-window internships."],
    ["📌 Today's Picks", "Top of Overview — scores jobs from the last 48h by your lane strategy (Ops/PjM > Growth/CRM > AI > others) plus local, H1B, and freshness bonuses. Click to edit; ↗ opens the application page."],
    ["🗂 Pipeline", "Seven stages: saved → applied → referral asked → secured → interview → offer / rejected. Change stages via the dropdown on each row. Manually added jobs (+ button) are first-class: counted in all stats, funnels, and trends."],
    ["🤖 Resume Lab", "Upload resumes (.md/.txt) → paste a JD (company/title auto-detected) → 🎯 pick resume for me → get a report: match score, ATS keywords, persona decode, guarded bullet rewrites, elicitation questions. Refine via chat below the report; re-test after editing. Requires your own Anthropic API key (stored in your browser only)."],
    ["🚄 Channels", "Official campus-recruiting portals (APM programs, design, hardware, startup platforms) — companies like Amazon/Google post only on their own sites; track them here + LinkedIn alerts."],
    ["💾 Data & Privacy", "Everything (resumes, pipeline, reports, key) lives only in your browser's localStorage — nothing is uploaded anywhere. ⤓ exports a JSON backup (key excluded); ⤒ restores it. Export before switching devices or clearing cache."],
  ],
};

function HelpModal({ lang, onClose }) {
  const items = HELP[lang] || HELP.zh;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(30,30,40,0.35)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "rgba(252,252,254,0.98)", borderRadius: 24, padding: "28px 32px", maxWidth: 640, width: "100%", maxHeight: "82vh", overflowY: "auto", boxShadow: "0 24px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 17, fontWeight: 800 }}>{lang === "zh" ? "使用指南" : "How to use OfferPilot"}</div>
          <button onClick={onClose} style={{ border: "none", background: "rgba(0,0,0,0.05)", borderRadius: 999, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
        {items.map(([h, body], i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{h}</div>
            <div style={{ fontSize: 12, color: "#5A5A6E", lineHeight: 1.7 }}>{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodayPicks({ jobs, t, setEditJob }) {
  const twoDays = new Date(Date.now() - 2 * 864e5).toISOString().split("T")[0];
  const ranked = jobs
    .filter(j => j.stage === "saved" && j.posted >= twoDays)
    .map(j => ({ j, ...scorePick(j, t) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  if (ranked.length === 0) return null;
  return (
    <Glass tint="rgba(232,235,248,0.6)" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 700 }}>📌 {t.picksTitle}</span>
        <span style={{ fontSize: 11, color: "#9A9AAA" }}>{t.picksSub}</span>
      </div>
      {ranked.map(({ j, why }, i) => (
        <div key={j.id} onClick={() => setEditJob(j)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 4px", borderBottom: i < ranked.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none", cursor: "pointer" }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#7A6EA4", width: 20, flexShrink: 0 }}>{i + 1}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.title}</div>
            <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 1 }}>{j.company} · {j.location.slice(0, 30)}</div>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {why.slice(0, 3).map((w, wi) => (
              <span key={wi} style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: "rgba(155,142,196,0.14)", color: "#7A6EA4", whiteSpace: "nowrap" }}>{w}</span>
            ))}
          </div>
          {j.url && <a href={j.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 12, color: "#5A7EA0", textDecoration: "none", fontWeight: 700, flexShrink: 0 }}>↗</a>}
        </div>
      ))}
    </Glass>
  );
}

// ===== Dashboard =====
function Dashboard({ stats, jobs, t, setEditJob }) {
  const stageCounts = STAGES.map(s => ({ name: t.stages[s.id], count: jobs.filter(j => j.stage === s.id).length, color: s.color, accent: s.accent }));
  const recent = jobs.filter(j => j.stage !== "saved").sort((a, b) => b.posted.localeCompare(a.posted)).slice(0, 5);
  const pieData = [{ name: "PM", value: stats.pm || 0, color: "#7BA1C7" }, { name: "UX/PD", value: stats.pd || 0, color: "#9B8EC4" }, { name: "HW", value: stats.hw || 0, color: "#C9A86C" }, { name: "PjM", value: stats.pjm || 0, color: "#6BAFAB" }, { name: "Ops", value: stats.ops || 0, color: "#E07A7A" }].filter(p => p.value > 0);

  // Activity breakdown (like reference)
  const actData = STAGES.filter(s => s.id !== "saved").map(s => {
    const count = jobs.filter(j => j.stage === s.id).length;
    const pct = stats.applied ? Math.round(count / stats.applied * 100) : 0;
    return { id: s.id, count, pct, color: s.color, accent: s.accent };
  });

  return (
    <div>
      <TodayPicks jobs={jobs} t={t} setEditJob={setEditJob} />
      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: 16, marginBottom: 16 }}>
        {/* Activity assigned card (like reference large % card) */}
        <Glass tint="rgba(232,240,235,0.55)" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{t.activityAssigned}</div>
            <div style={{ fontSize: 11, color: "#9A9AAA" }}>{t.subtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 52, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1, color: "#2C2C3A" }}>
              {stats.total ? Math.round(stats.applied / stats.total * 100) : 0}%
            </span>
            <span style={{ fontSize: 12, color: "#9A9AAA" }}>{t.applied}</span>
          </div>
          {/* Mini breakdown */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {actData.map(a => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.color }} />
                <span style={{ fontSize: 12, color: "#5A5A6E", fontWeight: 500 }}>{t.stages[a.id]}</span>
                <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.03em", marginLeft: "auto" }}>{a.pct}%</span>
              </div>
            ))}
          </div>
        </Glass>

        {/* Stage distribution bar chart */}
        <Glass>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.distribution}</div>
              <div style={{ fontSize: 11, color: "#9A9AAA" }}>{t.funnel}</div>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageCounts} barCategoryGap="22%">
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: "#9A9AAA" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#B0B0BA" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(10px)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stageCounts.map((e, i) => <Cell key={i} fill={e.color} opacity={0.7} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Glass>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 280px", gap: 16 }}>
        {/* Weekly trend */}
        <Glass>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{t.weeklyTrend}</div>
          <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 14 }}>{jobs.length} total · {stats.applied} active</div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i) => ({
                day: d,
                count: jobs.filter(j => { const dt = new Date(j.posted); return dt.getDay() === (i + 1) % 7; }).length,
              }))}>
                <defs>
                  <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9B8EC4" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9B8EC4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#B0B0BA" }} axisLine={false} tickLine={false} />
                <Area type="monotone" dataKey="count" stroke="#9B8EC4" strokeWidth={2.5} fill="url(#tg2)" dot={{ r: 3.5, fill: "#9B8EC4", stroke: "#fff", strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Glass>

        {/* Recent activity */}
        <Glass>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>{t.recentActivity}</div>
          {recent.length === 0 && <div style={{ color: "#B0B0BA", fontSize: 12, padding: "16px 0" }}>{t.noActivity}</div>}
          {recent.map(j => {
            const s = STAGES.find(x => x.id === j.stage);
            return (
              <div key={j.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: s.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, color: s.color, flexShrink: 0 }}>
                  {t.stages[j.stage].charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.title}</div>
                  <div style={{ fontSize: 11, color: "#9A9AAA", marginTop: 1 }}>{j.company}</div>
                </div>
                <span style={{ fontSize: 10, color: "#B0B0BA" }}>{relDate(j.posted, t)}</span>
              </div>
            );
          })}
        </Glass>

        {/* Role split donut */}
        <Glass>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{t.roleSplit}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            {stats.total > 0 ? (
              <PieChart width={140} height={140}>
                <Pie data={pieData} cx={70} cy={70} innerRadius={42} outerRadius={60} paddingAngle={5} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} opacity={0.65} />)}
                </Pie>
              </PieChart>
            ) : <div style={{ height: 140, display: "flex", alignItems: "center", color: "#B0B0BA", fontSize: 12 }}>—</div>}
            <div style={{ display: "flex", gap: 18 }}>
              {pieData.map(p => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#5A5A6E" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: p.color, opacity: 0.65 }} />
                  {p.name} <span style={{ fontWeight: 600 }}>{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

// ===== Type pills =====
function TypePills({ filter, setFilter, t }) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 999, padding: 3, backdropFilter: "blur(8px)" }}>
      {[["all", t.all], ["Product Manager", "PM"], ["Product Designer", "UX/PD"], ["Hardware", "HW"], ["Project Management", "PjM"], ["Product Ops", "Ops"]].map(([v, l]) => (
        <button key={v} onClick={() => setFilter(f => ({ ...f, type: v }))} style={{
          padding: "6px 16px", borderRadius: 999, border: "none", fontSize: 11.5, fontWeight: 500,
          background: filter.type === v ? "#fff" : "transparent", color: filter.type === v ? "#2C2C3A" : "#9A9AAA",
          cursor: "pointer", boxShadow: filter.type === v ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        }}>{l}</button>
      ))}
    </div>
  );
}

function JobTypePills({ filter, setFilter, t }) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 999, padding: 3, backdropFilter: "blur(8px)" }}>
      {[["all", t.all], ["fulltime", t.ftLabel], ["intern", t.internLabel]].map(([v, l]) => (
        <button key={v} onClick={() => setFilter(f => ({ ...f, jobType: v }))} style={{
          padding: "6px 14px", borderRadius: 999, border: "none", fontSize: 11.5, fontWeight: 500,
          background: filter.jobType === v ? "#fff" : "transparent", color: filter.jobType === v ? "#2C2C3A" : "#9A9AAA",
          cursor: "pointer", boxShadow: filter.jobType === v ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        }}>{l}</button>
      ))}
    </div>
  );
}

function WindowPills({ filter, setFilter, t }) {
  return (
    <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 999, padding: 3, backdropFilter: "blur(8px)" }}>
      {["24h", "7d", "30d", "all"].map(w => (
        <button key={w} onClick={() => setFilter(f => ({ ...f, window: w }))} style={{
          padding: "6px 14px", borderRadius: 999, border: "none", fontSize: 11.5, fontWeight: 500,
          background: filter.window === w ? "#fff" : "transparent", color: filter.window === w ? "#2C2C3A" : "#9A9AAA",
          cursor: "pointer", boxShadow: filter.window === w ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
        }}>{t.windows[w]}</button>
      ))}
    </div>
  );
}

function TypeBadge({ type }) {
  const cfg = type === "Product Manager" ? { bg: "rgba(123,161,199,0.15)", fg: "#5A7EA0", l: "PM" }
    : type === "Hardware" ? { bg: "rgba(201,168,108,0.18)", fg: "#9A7A3A", l: "HW" }
    : type === "Project Management" ? { bg: "rgba(107,175,171,0.18)", fg: "#3A8A84", l: "PjM" }
    : type === "Product Ops" ? { bg: "rgba(224,122,122,0.15)", fg: "#B05A5A", l: "Ops" }
    : { bg: "rgba(155,142,196,0.15)", fg: "#7A6EA4", l: "UX/PD" };
  return (
    <span style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 999, fontWeight: 600, background: cfg.bg, color: cfg.fg, whiteSpace: "nowrap" }}>{cfg.l}</span>
  );
}

function H1BBadge({ tag, t }) {
  if (!tag || tag === "unknown") return null;
  const cfg = tag === "likely" ? { bg: "rgba(123,175,139,0.18)", fg: "#4A8A5A", l: t.h1bLikely }
    : tag === "no-intl" ? { bg: "rgba(196,123,139,0.18)", fg: "#A04A5A", l: t.h1bNoIntl }
    : { bg: "rgba(0,0,0,0.06)", fg: "#8A8A9A", l: t.h1bStaffing };
  return (
    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 999, fontWeight: 600, background: cfg.bg, color: cfg.fg, whiteSpace: "nowrap" }}>{cfg.l}</span>
  );
}

// ===== Job Board =====
function JobBoard({ jobs, filter, setFilter, moveJob, requestDelete, setEditJob, t }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>
          {t.jobs} <span style={{ fontSize: 13, fontWeight: 400, color: "#B0B0BA" }}>({jobs.length})</span>
        </h2>
        <div style={{ flex: 1 }} />
        <button onClick={() => setFilter(f => ({ ...f, h1bOnly: !f.h1bOnly }))} style={{
          padding: "6px 16px", borderRadius: 999, border: "none", fontSize: 11.5, fontWeight: 600,
          background: filter.h1bOnly ? "rgba(123,175,139,0.85)" : "rgba(255,255,255,0.4)",
          color: filter.h1bOnly ? "#fff" : "#5A8A6A", cursor: "pointer", backdropFilter: "blur(8px)",
        }}>🌱 {t.h1bFilter}</button>
        <JobTypePills filter={filter} setFilter={setFilter} t={t} />
        <WindowPills filter={filter} setFilter={setFilter} t={t} />
        <TypePills filter={filter} setFilter={setFilter} t={t} />
      </div>
      <Glass style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
            <thead><tr>
              {[t.jobCol, t.company, t.location, t.typeCol, t.postedCol, t.stageCol].map((h, i) => (
                <th key={i} style={{ padding: "14px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 500, color: "#9A9AAA", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {jobs.map(j => {
                const s = STAGES.find(x => x.id === j.stage);
                return (
                  <tr key={j.id} onClick={() => setEditJob(j)} style={{ cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.03)", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.3)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "14px 20px", maxWidth: 300 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{j.title}</div>
                      {j.tags.length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 4 }}>{j.tags.slice(0, 2).map(tag => <span key={tag} style={{ fontSize: 10, background: "rgba(0,0,0,0.04)", color: "#8A8A9A", padding: "2px 8px", borderRadius: 999 }}>{tag}</span>)}</div>}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>{j.company} <H1BBadge tag={j.h1b} t={t} /></div></td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#8A8A9A", maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.location}</td>
                    <td style={{ padding: "14px 20px" }}><div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}><TypeBadge type={j.type} />{j.jobType === "intern" && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 999, fontWeight: 700, background: "rgba(107,159,212,0.18)", color: "#4A7AA8" }}>{t.internLabel}</span>}</div></td>
                    <td style={{ padding: "14px 20px", fontSize: 12, color: "#B0B0BA" }}>{relDate(j.posted, t)}</td>
                    <td style={{ padding: "14px 20px" }} onClick={e => e.stopPropagation()}>
                      <select value={j.stage} onChange={e => {
                        if (e.target.value === "__del__") {
                          requestDelete(j);
                          e.target.value = j.stage;
                        } else moveJob(j.id, e.target.value);
                      }} style={{
                        padding: "5px 10px", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 500,
                        background: s.accent, color: s.color, cursor: "pointer", outline: "none",
                      }}>
                        {STAGES.map(x => <option key={x.id} value={x.id}>{t.stages[x.id]}</option>)}
                        <option value="__del__">🗑 {t.delete}</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {jobs.length === 0 && <div style={{ padding: 48, textAlign: "center", color: "#B0B0BA", fontSize: 13 }}>{t.noMatch}</div>}
      </Glass>
      {filter.search && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, fontSize: 12, color: "#8A8A9A", flexWrap: "wrap" }}>
          <span>{t.externalSearch}</span>
          {[
            ["LinkedIn", `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(filter.search + " new grad")}&f_TPR=r86400`],
            ["Google Jobs", `https://www.google.com/search?q=${encodeURIComponent(filter.search + " new grad jobs")}&ibp=htl;jobs`],
            ["Indeed", `https://www.indeed.com/jobs?q=${encodeURIComponent(filter.search + " new grad")}&fromage=1`],
          ].map(([name, url]) => (
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" style={{ padding: "6px 16px", background: "rgba(255,255,255,0.55)", borderRadius: 999, color: "#5A7EA0", textDecoration: "none", fontWeight: 600, backdropFilter: "blur(8px)" }}>
              {name} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== Pipeline =====
function PipelineView({ jobs, filter, setFilter, moveJob, setEditJob, t }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{t.pipeline}</h2>
        <div style={{ flex: 1 }} />
        <TypePills filter={filter} setFilter={setFilter} t={t} />
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
        {STAGES.map(stage => {
          const list = jobs.filter(j => j.stage === stage.id);
          return (
            <div key={stage.id} style={{ minWidth: 210, width: 210, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px 12px" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{t.stages[stage.id]}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: stage.color, background: stage.accent, padding: "2px 9px", borderRadius: 999, marginLeft: "auto" }}>{list.length}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 100 }}>
                {list.map(j => (
                  <Glass key={j.id} style={{ padding: 14, cursor: "pointer", borderLeft: `3px solid ${stage.color}` }} onClick={() => setEditJob(j)}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 6, marginBottom: 4 }}>
                      <div style={{ fontWeight: 500, fontSize: 12, lineHeight: 1.35 }}>{j.title}</div>
                      <TypeBadge type={j.type} />
                    </div>
                    <div style={{ fontSize: 11, color: "#8A8A9A", marginBottom: 8 }}>{j.company}</div>
                    {j.notes && <div style={{ fontSize: 10.5, color: "#A0885A", background: "rgba(201,168,108,0.12)", padding: "5px 8px", borderRadius: 8, marginBottom: 6, lineHeight: 1.4 }}>{j.notes}</div>}
                    {j.referralContact && <div style={{ fontSize: 10.5, color: "#5A8A6A", background: "rgba(123,175,139,0.12)", padding: "5px 8px", borderRadius: 8, marginBottom: 6 }}>🤝 {j.referralContact}</div>}
                    <div style={{ display: "flex", gap: 4 }}>
                      {STAGES.map((s, i) => {
                        const cur = STAGES.findIndex(x => x.id === j.stage);
                        if (i !== cur + 1 && i !== cur - 1) return null;
                        return (
                          <button key={s.id} onClick={e => { e.stopPropagation(); moveJob(j.id, s.id); }} style={{
                            flex: 1, padding: "5px 4px", fontSize: 10, border: "none", borderRadius: 999,
                            background: i > cur ? s.accent : "rgba(0,0,0,0.04)", color: i > cur ? s.color : "#9A9AAA",
                            fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
                          }}>{i > cur ? `${t.stages[s.id]} →` : `← ${t.stages[s.id]}`}</button>
                        );
                      })}
                    </div>
                  </Glass>
                ))}
                {list.length === 0 && <div style={{ padding: 20, textAlign: "center", color: "#C0C0CA", fontSize: 11, border: "1.5px dashed rgba(0,0,0,0.08)", borderRadius: 14 }}>{t.empty}</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}



// ===== Resume Lab: JD analysis + resume tailoring (v0.2) =====

// ===== BYO API key (stored locally in this browser only) =====
function getApiKey() { try { return localStorage.getItem("op2-apikey") || ""; } catch { return ""; } }
function apiHeaders() {
  return {
    "Content-Type": "application/json",
    "x-api-key": getApiKey(),
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  };
}

async function analyzeJD(resume, jd, company, title, lang, portfolio) {
  const zhOut = lang === "zh";
  const prompt = `You are a job-application strategist. Analyze resume-vs-JD fit.

INTERNAL PROCESS (silent): 1) Decode JD: hiring manager's real needs / HARD requirements (years, degrees, named skills/tools — disqualifiers if missing) vs SOFT requirements (traits, ways of working) / hidden signals / level. 2) Match 0-100 (60% hard-requirement coverage, 20% domain, 20% soft/nice-to-have). 3) ATS keywords: exact terms from the JD a recruiter would keyword-search — tools, methods, domain nouns. Compare against resume: which appear ("have") vs which are absent and MUST be added ("miss"). Use the JD's exact spelling. 4) Scan JD for visa red flags (citizenship/clearance/no sponsorship/export control). 5) Predict interview questions. 6) Tailor bullets: ONLY rephrase facts already in THAT SAME bullet, never invent and never borrow facts from other bullets/jobs; missing numbers = [${zhOut ? "待确认" : "TBC"}]. Where natural, weave missing ATS keywords into the rewrites.

BULLET PRESERVATION RULES (non-negotiable): keep brand/company names (they are credibility anchors); keep all metrics; keep ownership verbs (Led/Owned/Drove) — never downgrade to weaker verbs; unfamiliar-to-US context (e.g. WeChat) may be briefly glossed but not deleted. Each bullet change must ship with "w": a one-line reason for the change.

BULLET LENGTH DISCIPLINE: the rewrite "n" must NOT be longer than the original "o" by more than 10% in word count — prefer SHORTER. Every word must carry information the JD cares about; cut redundant nouns repeated across bullets, trailing purpose clauses ("to support...", "in order to..."), and doubled adjectives. Density over length.

ELICITATION: also produce "ask" — up to 2 pointed questions for the candidate about experiences they might have that would fix a "miss" or strengthen a weak bullet (e.g. "Do you have any A/B testing experience from X? It would cover requirement Y"). Only ask about plausible experiences given their background; never suggest inventing.

LANGUAGE RULE for "bullets": both "o" and "n" MUST be in the SAME language as the resume itself (e.g. English resume -> English bullets), because they will be pasted directly into the resume. Everything else follows the output language below.


Also produce "persona": what candidate this team is REALLY looking for (beyond the recruiting copy) + hidden signals you decoded from the JD.
${portfolio ? 'PORTFOLIO provided below: also produce "folio": which project to lead with for THIS role, how the portfolio aligns, and the biggest missing piece. If portfolio is only a URL, use web search to look it up; if unreachable, set folio values to what you can infer and note it.' : ""}

RESUME:
${resume.slice(0, 4500)}
${portfolio ? `\nPORTFOLIO:\n${portfolio.slice(0, 2500)}\n` : ""}
JD (${company || "?"} - ${title || "?"}):
${jd.slice(0, 4500)}

Output ONLY minified JSON, no markdown fences. Analysis fields (verdict/level/h1b/must/gaps/q/assume) ${zhOut ? "in Simplified Chinese" : "in English"}; "bullets" in the resume's own language. BE EXTREMELY TERSE — every string under 15 words:
{"co":"<company name extracted from JD, or empty>","ti":"<job title extracted from JD, or empty>","match":<int>,"verdict":"<apply/caveat/skip + why, 1 short sentence>","level":"<NG-friendly? 5 words>","h1b":["<flag or empty>"],"kw":{"have":["<keyword>"],"miss":["<keyword>"]},"persona":{"who":"<what they really want, max 20 words>","sig":["<hidden signal, max 10 words>"]},"must":[{"req":"<hard req, 8 words>","s":"hit|partial|miss","ev":"<8 words>"}],"soft":[{"req":"<soft req, 6 words>","s":"hit|partial|miss","ev":"<6 words>"}],"gaps":[{"g":"<8 words>","fix":"<10 words>"}],"bullets":[{"o":"<resume line, may truncate>","n":"<improved, keep brands+metrics+ownership verbs>","w":"<why, 12 words>"}]${portfolio ? ',"folio":{"lead":"<project to lead with + why, 15 words>","align":"<alignment, 12 words>","gap":"<missing piece, 10 words>"}' : ""},"q":["<question>"],"ask":["<question to candidate, ${zhOut ? "Simplified Chinese" : "English"}>"],"assume":["<assumption>"]}
Hard limits: kw.have=5, kw.miss=8 (single words or 2-3 word phrases), persona.sig=2, must=4, soft=3, gaps=2, bullets=2, q=3, ask=2, assume=1.`;

  const callOnce = async () => {
    if (!getApiKey()) throw new Error("NO_KEY");
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: apiHeaders(),
      body: JSON.stringify({
        model: "claude-sonnet-4-6", max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
        ...(portfolio && /https?:\/\//.test(portfolio) ? { tools: [{ type: "web_search_20250305", name: "web_search" }] } : {}),
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error.message || "API error");
    return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  };

  const repairJSON = (s) => {
    let x = s.replace(/```json|```/g, "").trim();
    const start = x.indexOf("{");
    if (start === -1) throw new Error("no JSON");
    x = x.slice(start);
    try { return JSON.parse(x); } catch {}
    // 截断修复: 逐步回退到最后一个完整的值边界, 补齐括号
    for (let cut = x.length; cut > 50; cut--) {
      const seg = x.slice(0, cut);
      const last = seg[seg.length - 1];
      if (last !== '"' && last !== "}" && last !== "]" && !/[0-9]/.test(last)) continue;
      let braces = 0, brackets = 0, inStr = false, esc = false;
      for (const ch of seg) {
        if (esc) { esc = false; continue; }
        if (ch === "\\") { esc = true; continue; }
        if (ch === '"') inStr = !inStr;
        if (inStr) continue;
        if (ch === "{") braces++; if (ch === "}") braces--;
        if (ch === "[") brackets++; if (ch === "]") brackets--;
      }
      if (inStr || braces < 0 || brackets < 0) continue;
      const fixed = seg + "]".repeat(brackets) + "}".repeat(braces);
      try { return JSON.parse(fixed); } catch {}
    }
    throw new Error("unrepairable");
  };

  // 最多尝试2次
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const text = await callOnce();
      return repairJSON(text);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

const SEED_RESUMES = [{"id": "r-demo", "name": "Sample Resume (replace with yours)", "cat": "Product Manager", "content": "# ALEX SAMPLE\n\nProduct Manager | alex@example.com | (555) 000-0000\n\n## SUMMARY\nSample resume for demo purposes. Click Edit to replace with your own, or delete and upload your .md/.txt resume.\n\n## EXPERIENCE\n\n### Product Manager Intern | Acme Corp\n*Jun. 2025 - Sep. 2025*\n- Led discovery and launch of a customer onboarding flow, lifting activation 12%.\n- Wrote PRDs and coordinated UAT across design and engineering.\n\n### Growth Associate | Example Inc\n*Jul. 2023 - May. 2025*\n- Ran lifecycle email campaigns for 50K users; improved conversion 8% via A/B testing.\n\n## SKILLS\nPRD Writing, User Research, A/B Testing, SQL, Figma, Data Analysis", "updated": "2026-07-24"}];

const CAT_LABEL = { "Product Manager": "PM", "Product Designer": "UX/PD", "Hardware": "HW", "Project Management": "PjM", "Product Ops": "Ops" };
const CAT_COLOR = { "Product Manager": ["rgba(123,161,199,0.15)", "#5A7EA0"], "Product Designer": ["rgba(155,142,196,0.15)", "#7A6EA4"], "Hardware": ["rgba(201,168,108,0.18)", "#9A7A3A"], "Project Management": ["rgba(107,175,171,0.18)", "#3A8A84"], "Product Ops": ["rgba(224,122,122,0.15)", "#B05A5A"] };

async function pickResume(jd, resumes, lang) {
  const zh = lang === "zh";
  const list = resumes.map(r => `[${r.id}] ${r.name} (${r.cat}):\n${r.content.slice(0, 1200)}`).join("\n---\n");
  const prompt = `A candidate has multiple resumes. Given the JD below, decide: 1) which role category this JD belongs to: "Product Manager" | "Product Designer" | "Hardware" | "Project Management" | "Product Ops"; PM-category resumes may serve Project Management and Product Ops JDs when no dedicated resume exists in those categories; 2) among ONLY the resumes of that category, which single resume fits best.

JD:
${jd.slice(0, 2500)}

RESUMES:
${list}

Output ONLY minified JSON, ${zh ? "reason in Simplified Chinese" : "reason in English"}: {"cat":"<category>","best":"<resume id>","why":"<reason, 20 words max>"}`;
  if (!getApiKey()) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function ResumeLab({ t, lang }) {
  const [resumes, setResumes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [editing, setEditing] = useState(null); // {id?, name, cat, content}
  const [portfolio, setPortfolio] = useState("");
  const [folioSaved, setFolioSaved] = useState(false);
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [picking, setPicking] = useState(false);
  const [pickWhy, setPickWhy] = useState("");
  const [err, setErr] = useState("");
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => { (async () => {
    let lib = null;
    try { const r = await window.storage.get("op2-resumes"); if (r?.value) lib = JSON.parse(r.value); } catch {}
    if (!lib || lib.length === 0) {
      // migrate old single resume if present, else seed with her three resumes
      let old = "";
      try { const r = await window.storage.get("op2-resume"); if (r?.value) old = r.value; } catch {}
      lib = old ? [{ id: "r-old", name: lang === "zh" ? "导入的简历" : "Imported resume", cat: "Product Manager", content: old, updated: new Date().toISOString().split("T")[0] }, ...SEED_RESUMES] : SEED_RESUMES;
      try { await window.storage.set("op2-resumes", JSON.stringify(lib)); } catch {}
    }
    setResumes(lib);
    try { const r = await window.storage.get("op2-active-resume"); if (r?.value && lib.some(x => x.id === r.value)) setActiveId(r.value); else setActiveId(lib[0]?.id || null); } catch { setActiveId(lib[0]?.id || null); }
    try { const r = await window.storage.get("op2-portfolio"); if (r?.value) { setPortfolio(r.value); setFolioSaved(true); } } catch {}
    try { const r = await window.storage.get("op2-reports"); if (r?.value) setHistory(JSON.parse(r.value)); } catch {}
  })(); }, []);

  const persistLib = async (lib) => {
    setResumes(lib);
    try { await window.storage.set("op2-resumes", JSON.stringify(lib)); } catch {}
  };
  const selectResume = async (id) => {
    setActiveId(id); setPickWhy("");
    try { await window.storage.set("op2-active-resume", id); } catch {}
  };
  const saveEditing = async () => {
    if (!editing.name.trim() || !editing.content.trim()) return;
    const today = new Date().toISOString().split("T")[0];
    let lib;
    if (editing.id) lib = resumes.map(r => r.id === editing.id ? { ...r, ...editing, updated: today } : r);
    else { const id = "r" + Date.now(); lib = [...resumes, { ...editing, id, updated: today }]; setActiveId(id); }
    await persistLib(lib);
    setEditing(null);
  };
  const deleteResume = async (id) => {
    const lib = resumes.filter(r => r.id !== id);
    await persistLib(lib);
    if (activeId === id) selectResume(lib[0]?.id || null);
    setEditing(null);
  };
  const savePortfolioFn = async () => {
    try { await window.storage.set("op2-portfolio", portfolio); setFolioSaved(!!portfolio); } catch {}
  };
  const saveHistory = async (h) => {
    setHistory(h);
    try { await window.storage.set("op2-reports", JSON.stringify(h.slice(0, 20))); } catch {}
  };

  const autoPick = async () => {
    setErr(""); setPickWhy("");
    if (!jd.trim()) { setErr(t.needJD); return; }
    if (resumes.length === 0) { setErr(t.needResume); return; }
    setPicking(true);
    try {
      const p = await pickResume(jd, resumes, lang);
      if (p.best && resumes.some(r => r.id === p.best)) {
        await selectResume(p.best);
        const chosen = resumes.find(r => r.id === p.best);
        setPickWhy(`${chosen.name} — ${p.why || ""}`);
      }
    } catch { setErr(t.pickFail); }
    setPicking(false);
  };

  const run = async (rerunOf) => {
    setErr("");
    const active = resumes.find(r => r.id === activeId);
    if (!active) { setErr(t.needResume); return; }
    const useJd = rerunOf ? rerunOf.jd : jd;
    if (!useJd || !useJd.trim()) { setErr(t.needJD); return; }
    if (portfolio.trim() && !folioSaved) await savePortfolioFn();
    setBusy(true);
    try {
      const usePf = active.cat === "Product Designer" ? portfolio.trim() : "";
      const co = rerunOf ? rerunOf.company : (company || "?");
      const ti = rerunOf ? rerunOf.title : (title || "?");
      const rep = await analyzeJD(active.content, useJd, co, ti, lang, usePf);
      const finalCo = co !== "?" ? co : (rep.co || "?");
      const finalTi = ti !== "?" ? ti : (rep.ti || "?");
      if (!rerunOf) { if (company === "" && rep.co) setCompany(rep.co); if (title === "" && rep.ti) setTitle(rep.ti); }
      const entry = {
        id: Date.now().toString(), company: finalCo, title: finalTi,
        url: rerunOf ? rerunOf.url : jobUrl.trim(),
        jd: useJd,
        date: new Date().toISOString().split("T")[0], resumeName: active.name, rep,
        prev: rerunOf ? { match: rerunOf.rep.match, missKw: (rerunOf.rep.kw?.miss || []).length, date: rerunOf.date } : null,
      };
      setReport(entry);
      saveHistory([entry, ...history]);
    } catch (e) { setErr(t.analyzeFail); }
    setBusy(false);
  };

  const S_COLORS = { hit: "#4A8A5A", partial: "#C9A86C", miss: "#A04A5A" };
  const S_LABEL = { hit: t.hit, partial: t.partial, miss: t.miss };
  const active = resumes.find(r => r.id === activeId);

  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [showKey, setShowKey] = useState(false);
  const saveKey = (v) => { try { localStorage.setItem("op2-apikey", v.trim()); } catch {} setApiKeyState(v.trim()); };

  return (
    <div>
      {!apiKey && (
        <Glass style={{ marginBottom: 14, padding: "14px 20px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>🔑 {t.keyTitle}</div>
          <div style={{ fontSize: 11.5, color: "#9A9AAA", lineHeight: 1.5, marginBottom: 8 }}>{t.keyHint}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input type={showKey ? "text" : "password"} placeholder="sk-ant-..." onKeyDown={e => e.key === "Enter" && saveKey(e.target.value)}
              style={{ flex: 1, padding: "9px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "monospace" }} id="op-key-input" />
            <button onClick={() => setShowKey(s => !s)} style={{ padding: "9px 14px", background: "rgba(0,0,0,0.05)", border: "none", borderRadius: 999, fontSize: 11, cursor: "pointer", color: "#5A5A6E" }}>{showKey ? "🙈" : "👁"}</button>
            <button onClick={() => saveKey(document.getElementById("op-key-input").value)} style={{ padding: "9px 20px", background: "rgba(123,175,139,0.85)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.saveBtn}</button>
          </div>
        </Glass>
      )}
      {apiKey && (
        <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 12 }}>
          🔑 {t.keySet} <button onClick={() => saveKey("")} style={{ background: "none", border: "none", color: "#A05A6A", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>{t.keyClear}</button>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        {/* ===== Resume Library ===== */}
        <Glass>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{t.resumeLib}</div>
            <div style={{ flex: 1 }} />
            <button onClick={() => setEditing({ name: "", cat: "Product Manager", content: "" })}
              style={{ padding: "5px 14px", background: "rgba(123,175,139,0.85)", color: "#fff", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
              + {t.addResume}
            </button>
          </div>

          {resumes.map(r => (
            <div key={r.id} onClick={() => selectResume(r.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", marginBottom: 6,
                background: r.id === activeId ? "rgba(123,175,139,0.12)" : "rgba(255,255,255,0.35)",
                border: r.id === activeId ? "1.5px solid rgba(123,175,139,0.5)" : "1.5px solid transparent" }}>
              <span style={{ width: 14, height: 14, borderRadius: "50%", border: `2px solid ${r.id === activeId ? "#4A8A5A" : "#C0C0CA"}`, background: r.id === activeId ? "#4A8A5A" : "transparent", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: "#9A9AAA" }}>{r.content.length} {t.chars} · {r.updated}</div>
              </div>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, fontWeight: 700, background: CAT_COLOR[r.cat][0], color: CAT_COLOR[r.cat][1], whiteSpace: "nowrap" }}>{CAT_LABEL[r.cat]}</span>
              <button onClick={e => { e.stopPropagation(); setEditing({ ...r }); }}
                style={{ padding: "4px 10px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 999, fontSize: 10.5, cursor: "pointer", color: "#5A7EA0", fontWeight: 600 }}>{t.editBtn}</button>
            </div>
          ))}
          {resumes.length === 0 && <div style={{ fontSize: 12, color: "#B0B0BA", padding: "12px 0" }}>{t.noResumes}</div>}

          {/* Inline editor */}
          {editing && (
            <div style={{ marginTop: 12, padding: 14, background: "rgba(255,255,255,0.5)", borderRadius: 14, border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 8, marginBottom: 8 }}>
                <input value={editing.name} onChange={e => setEditing(x => ({ ...x, name: e.target.value }))} placeholder={t.resumeName}
                  style={{ padding: "8px 12px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, fontSize: 12, outline: "none", background: "#fff", fontFamily: "inherit" }} />
                <select value={editing.cat} onChange={e => setEditing(x => ({ ...x, cat: e.target.value }))}
                  style={{ padding: "8px 10px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, fontSize: 12, outline: "none", background: "#fff", fontFamily: "inherit" }}>
                  <option value="Product Manager">PM</option>
                  <option value="Product Designer">UX/PD</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Project Management">PjM</option>
                  <option value="Product Ops">Ops</option>
                </select>
              </div>
              <div style={{ marginBottom: 8 }}>
                <input type="file" accept=".md,.markdown,.txt" id="op-resume-file" style={{ display: "none" }}
                  onChange={e => {
                    const f = e.target.files && e.target.files[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = () => setEditing(x => ({
                      ...x,
                      content: String(reader.result || ""),
                      name: x.name && x.name.trim() ? x.name : f.name.replace(/\.(md|markdown|txt)$/i, ""),
                    }));
                    reader.readAsText(f);
                    e.target.value = "";
                  }} />
                <label htmlFor="op-resume-file" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 16px", background: "rgba(123,161,199,0.15)", color: "#5A7EA0", borderRadius: 999, fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}>
                  📄 {t.uploadFile}
                </label>
                <span style={{ fontSize: 10.5, color: "#B0B0BA", marginLeft: 8 }}>{t.uploadHint}</span>
              </div>
              <textarea value={editing.content} onChange={e => setEditing(x => ({ ...x, content: e.target.value }))} placeholder="# RESUME (Markdown)..."
                style={{ width: "100%", height: 150, padding: 12, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 10, fontSize: 11.5, outline: "none", boxSizing: "border-box", background: "#fff", resize: "vertical", fontFamily: "monospace", lineHeight: 1.5 }} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={saveEditing} style={{ flex: 1, padding: 9, background: "rgba(123,175,139,0.85)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.saveBtn}</button>
                <button onClick={() => setEditing(null)} style={{ padding: "9px 18px", background: "rgba(0,0,0,0.05)", color: "#5A5A6E", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.cancel}</button>
                {editing.id && <button onClick={() => deleteResume(editing.id)} style={{ padding: "9px 16px", background: "rgba(196,123,139,0.12)", color: "#A05A6A", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{t.delete}</button>}
              </div>
            </div>
          )}

          {/* Portfolio */}
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700 }}>{t.myPortfolio}</div>
              {folioSaved && <span style={{ fontSize: 11, color: "#4A8A5A", fontWeight: 600 }}>✓</span>}
            </div>
            <textarea value={portfolio} onChange={e => { setPortfolio(e.target.value); setFolioSaved(false); }} placeholder={t.portfolioPlaceholder}
              style={{ width: "100%", height: 66, padding: 10, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 11.5, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.6)", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />
            <button onClick={savePortfolioFn} style={{ marginTop: 6, padding: "6px 16px", background: "rgba(155,142,196,0.75)", color: "#fff", border: "none", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{t.saveBtn}</button>
          </div>
        </Glass>

        {/* ===== JD Analysis ===== */}
        <Glass>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{t.jdAnalysis}</div>
          <div style={{ fontSize: 11.5, color: "#9A9AAA", marginBottom: 10 }}>{t.jdHint}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder={t.jdCompany}
              style={{ padding: "9px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit" }} />
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t.jdTitle}
              style={{ padding: "9px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit" }} />
          </div>
          <input value={jobUrl} onChange={e => setJobUrl(e.target.value)} placeholder={t.jdUrl}
            style={{ width: "100%", boxSizing: "border-box", padding: "9px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit", marginBottom: 8 }} />
          <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="About the role..."
            style={{ width: "100%", height: 150, padding: 14, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, fontSize: 12, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.6)", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }} />

          {/* Active resume + auto pick */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, color: "#9A9AAA" }}>{t.usingResume}:</span>
            {active ? (
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: CAT_COLOR[active.cat][0], color: CAT_COLOR[active.cat][1] }}>{active.name}</span>
            ) : <span style={{ fontSize: 11.5, color: "#A04A5A" }}>—</span>}
            <button onClick={autoPick} disabled={picking} style={{ padding: "5px 14px", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: picking ? "wait" : "pointer", color: "#5A7EA0" }}>
              {picking ? t.picking : `🎯 ${t.autoPick}`}
            </button>
          </div>
          {pickWhy && <div style={{ fontSize: 11, color: "#4A8A5A", marginTop: 6, lineHeight: 1.5 }}>✓ {pickWhy}</div>}

          <button onClick={() => run()} disabled={busy} style={{ marginTop: 12, padding: "10px 26px", background: busy ? "rgba(0,0,0,0.1)" : "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: busy ? "wait" : "pointer", width: "100%" }}>
            {busy ? t.analyzing : `✨ ${t.analyze}`}
          </button>
          {err && <div style={{ fontSize: 11.5, color: "#A04A5A", marginTop: 8 }}>{err}</div>}
        </Glass>
      </div>

      {/* Report */}
      {report && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
            {report.resumeName && <span style={{ fontSize: 11.5, color: "#9A9AAA" }}>{t.usingResume}: <b>{report.resumeName}</b></span>}
            {report.prev && (
              <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 12px", borderRadius: 999,
                background: report.rep.match >= report.prev.match ? "rgba(123,175,139,0.15)" : "rgba(196,123,139,0.15)",
                color: report.rep.match >= report.prev.match ? "#4A8A5A" : "#A04A5A" }}>
                {report.prev.match}% → {report.rep.match}% ({report.rep.match >= report.prev.match ? "+" : ""}{report.rep.match - report.prev.match})
              </span>
            )}
            <span style={{ flex: 1 }} />
            {report.jd && (
              <button onClick={() => run(report)} disabled={busy}
                style={{ padding: "6px 16px", background: busy ? "rgba(0,0,0,0.08)" : "rgba(123,175,139,0.85)", color: "#fff", border: "none", borderRadius: 999, fontSize: 11.5, fontWeight: 600, cursor: busy ? "wait" : "pointer" }}>
                {busy ? t.analyzing : `↻ ${t.rerun}`}
              </button>
            )}
          </div>
          <ReportCard entry={report} t={t} sColors={S_COLORS} sLabel={S_LABEL} />
          <RefineChat entry={report} resume={(resumes.find(r => r.id === activeId) || {}).content || ""} t={t} lang={lang}
            onUpdate={(u) => { setReport(u); saveHistory(history.map(h => h.id === u.id ? u : h)); }} />
        </div>
      )}

      {/* History */}
      <Glass style={{ marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{t.reportHistory}</div>
        {history.length === 0 && <div style={{ fontSize: 12, color: "#B0B0BA" }}>{t.noReports}</div>}
        {history.map(h => (
          <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: h.rep.match >= 70 ? "#4A8A5A" : h.rep.match >= 50 ? "#C9A86C" : "#A04A5A", width: 44 }}>{h.rep.match}%</span>
            {h.prev && <span style={{ fontSize: 10, fontWeight: 700, color: h.rep.match >= h.prev.match ? "#4A8A5A" : "#A04A5A" }}>{h.rep.match >= h.prev.match ? "↑" : "↓"}{Math.abs(h.rep.match - h.prev.match)}</span>}
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 12.5, fontWeight: 500 }}>{h.title}</span>
              <span style={{ fontSize: 11.5, color: "#9A9AAA" }}> · {h.company} · {h.date}{h.resumeName ? ` · ${h.resumeName}` : ""}</span>
            </div>
            <button onClick={() => setReport(h)} style={{ padding: "5px 14px", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.06)", borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: "pointer", color: "#5A7EA0" }}>{t.reopen}</button>
            <button onClick={() => saveHistory(history.filter(x => x.id !== h.id))} style={{ padding: "5px 12px", background: "transparent", border: "none", fontSize: 11, cursor: "pointer", color: "#B0B0BA" }}>✕</button>
          </div>
        ))}
      </Glass>
    </div>
  );
}

async function refineChat(resume, jd, reportJson, messages, lang) {
  const zh = lang === "zh";
  const sys = `You are a sharp, honest resume coach in an ongoing session. Context: candidate's resume, the target JD, and an analysis report are below. The candidate will push back on suggestions, answer your elicitation questions with new facts, or ask for adjustments.

RULES: 1) When the candidate provides new facts, produce a revised bullet that weaves them in — in the RESUME'S language, no longer than the bullet it replaces (+10% max). 2) Never invent facts; if a detail is missing, ask or mark [${zh ? "待确认" : "TBC"}]. 3) If the candidate questions a suggestion, either defend it with a concrete reason or concede and revise. 4) Be terse: answer in under 150 words. 5) Analysis language: ${zh ? "Simplified Chinese" : "English"}; bullets in resume language.

RESUME:\n${resume.slice(0, 2500)}\n\nJD:\n${jd.slice(0, 2000)}\n\nREPORT:\n${reportJson.slice(0, 1500)}`;
  const msgs = [{ role: "user", content: sys }, { role: "assistant", content: zh ? "明白，我们开始微调。" : "Got it — let's refine." }, ...messages.slice(-8)];
  if (!getApiKey()) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: apiHeaders(),
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: msgs }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  return (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
}

function RefineChat({ entry, resume, t, lang, onUpdate }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const chat = entry.chat || [];

  const send = async () => {
    const q = input.trim();
    if (!q || busy) return;
    setInput(""); setBusy(true);
    const newChat = [...chat, { role: "user", content: q }];
    onUpdate({ ...entry, chat: newChat });
    try {
      const reply = await refineChat(resume, entry.jd || "", JSON.stringify(entry.rep), newChat, lang);
      onUpdate({ ...entry, chat: [...newChat, { role: "assistant", content: reply }] });
    } catch {
      onUpdate({ ...entry, chat: [...newChat, { role: "assistant", content: t.analyzeFail }] });
    }
    setBusy(false);
  };

  return (
    <Glass style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>💬 {t.refineTitle}</div>
      <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 12, lineHeight: 1.5 }}>{t.refineHint}</div>
      <div style={{ maxHeight: 300, overflowY: "auto", marginBottom: 10 }}>
        {chat.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 8 }}>
            <div style={{ maxWidth: "82%", padding: "9px 14px", borderRadius: 14, fontSize: 12, lineHeight: 1.6, whiteSpace: "pre-wrap",
              background: m.role === "user" ? "linear-gradient(135deg, rgba(155,142,196,0.2), rgba(123,161,199,0.2))" : "rgba(255,255,255,0.65)",
              color: "#2C2C3A", border: m.role === "user" ? "none" : "1px solid rgba(0,0,0,0.05)" }}>
              {m.content}
            </div>
          </div>
        ))}
        {busy && <div style={{ fontSize: 11.5, color: "#9A9AAA" }}>{t.refineThinking}</div>}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={t.refinePlaceholder}
          style={{ flex: 1, padding: "10px 16px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit" }} />
        <button onClick={send} disabled={busy} style={{ padding: "10px 22px", background: busy ? "rgba(0,0,0,0.08)" : "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: busy ? "wait" : "pointer" }}>
          {t.refineSend}
        </button>
      </div>
    </Glass>
  );
}

function ReportCard({ entry, t, sColors, sLabel }) {
  const r = entry.rep;
  const ring = r.match >= 70 ? "#4A8A5A" : r.match >= 50 ? "#C9A86C" : "#A04A5A";
  return (
    <Glass>
      {/* Header: score + verdict */}
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", width: 86, height: 86, flexShrink: 0 }}>
          <svg width="86" height="86" viewBox="0 0 86 86">
            <circle cx="43" cy="43" r="37" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="7" />
            <circle cx="43" cy="43" r="37" fill="none" stroke={ring} strokeWidth="7" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 37 * r.match / 100} ${2 * Math.PI * 37}`} transform="rotate(-90 43 43)" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, color: ring }}>{r.match}%</div>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span>{entry.title} · {entry.company}</span>
            {entry.url && <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 600, padding: "3px 12px", borderRadius: 999, background: "rgba(123,161,199,0.15)", color: "#5A7EA0", textDecoration: "none" }}>↗ {t.applyLink}</a>}
          </div>
          <div style={{ fontSize: 13, color: "#5A5A6E", lineHeight: 1.5 }}><b>{t.verdict}:</b> {r.verdict}</div>
          {r.level && <div style={{ fontSize: 12, color: "#9A9AAA", marginTop: 4 }}>{t.levelCheck}: {r.level}</div>}
        </div>
      </div>

      {/* Persona: what they really want */}
      {r.persona && (
        <div style={{ background: "rgba(123,161,199,0.1)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#3B6FA0", marginBottom: 6 }}>🎯 {t.persona}</div>
          <div style={{ fontSize: 12.5, color: "#3A4A5E", lineHeight: 1.6, marginBottom: r.persona.sig?.length ? 8 : 0 }}>{r.persona.who}</div>
          {(r.persona.sig || []).map((s, i) => (
            <div key={i} style={{ fontSize: 11.5, color: "#5A7EA0", lineHeight: 1.5 }}>· {t.hiddenSignal}: {s}</div>
          ))}
        </div>
      )}

      {/* Portfolio review */}
      {r.folio && (
        <div style={{ background: "rgba(155,142,196,0.1)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#7A6EA4", marginBottom: 8 }}>🎨 {t.folioReview}</div>
          <div style={{ fontSize: 12, color: "#4A4460", lineHeight: 1.6 }}><b>{t.folioLead}:</b> {r.folio.lead}</div>
          <div style={{ fontSize: 12, color: "#4A4460", lineHeight: 1.6, marginTop: 4 }}><b>{t.folioAlign}:</b> {r.folio.align}</div>
          <div style={{ fontSize: 12, color: "#8A5A6A", lineHeight: 1.6, marginTop: 4 }}><b>{t.folioGap}:</b> {r.folio.gap}</div>
        </div>
      )}

      {/* H1B flags */}
      {r.h1b && r.h1b.length > 0 && (
        <div style={{ background: "rgba(196,123,139,0.1)", borderRadius: 14, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#A04A5A", marginBottom: 6 }}>⚠️ {t.h1bFlags}</div>
          {r.h1b.map((f, i) => <div key={i} style={{ fontSize: 12, color: "#8A5A6A", lineHeight: 1.5 }}>· {f}</div>)}
        </div>
      )}

      {/* ATS keywords */}
      {r.kw && ((r.kw.miss || []).length > 0 || (r.kw.have || []).length > 0) && (
        <div style={{ background: "rgba(201,168,108,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A7A3A", marginBottom: 10 }}>🔑 {t.atsKw}</div>
          {(r.kw.miss || []).length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: "#A04A5A", fontWeight: 600, marginBottom: 5 }}>{t.kwMiss}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {r.kw.miss.map((k, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 999, background: "rgba(196,123,139,0.15)", color: "#A04A5A" }}>{k}</span>)}
              </div>
            </div>
          )}
          {(r.kw.have || []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, color: "#4A8A5A", fontWeight: 600, marginBottom: 5 }}>{t.kwHave}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {r.kw.have.map((k, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 999, background: "rgba(123,175,139,0.15)", color: "#4A8A5A" }}>{k}</span>)}
              </div>
            </div>
          )}
          <div style={{ fontSize: 10.5, color: "#B0A88A", marginTop: 8, lineHeight: 1.4 }}>{t.kwNote}</div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Must-haves */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{t.hardReqs}</div>
          {(r.must || []).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.04)", fontSize: 12 }}>
              <span style={{ color: sColors[m.s], fontWeight: 700, whiteSpace: "nowrap", fontSize: 11 }}>{sLabel[m.s]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{m.req}</div>
                {m.ev && <div style={{ color: "#9A9AAA", fontSize: 11, marginTop: 2 }}>{m.ev}</div>}
              </div>
            </div>
          ))}
          {(r.soft || []).length > 0 && <div style={{ fontSize: 13, fontWeight: 700, margin: "16px 0 10px" }}>{t.softReqs}</div>}
          {(r.soft || []).map((m, i) => (
            <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.04)", fontSize: 12 }}>
              <span style={{ color: sColors[m.s], fontWeight: 700, whiteSpace: "nowrap", fontSize: 11 }}>{sLabel[m.s]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{m.req}</div>
                {m.ev && <div style={{ color: "#9A9AAA", fontSize: 11, marginTop: 2 }}>{m.ev}</div>}
              </div>
            </div>
          ))}
          {/* Gaps */}
          <div style={{ fontSize: 13, fontWeight: 700, margin: "16px 0 10px" }}>{t.gaps}</div>
          {(r.gaps || []).map((g, i) => (
            <div key={i} style={{ fontSize: 12, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ fontWeight: 500, color: "#A04A5A" }}>{g.g}</div>
              <div style={{ color: "#5A8A6A", fontSize: 11.5, marginTop: 2 }}>→ {g.fix}</div>
            </div>
          ))}
        </div>

        {/* Bullets + questions */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.tailored}</div>
          <div style={{ fontSize: 10.5, color: "#9A9AAA", marginBottom: 10, lineHeight: 1.4 }}>{t.tailorNote}</div>
          {(r.bullets || []).map((b, i) => (
            <div key={i} style={{ marginBottom: 12, fontSize: 11.5 }}>
              <div style={{ color: "#B0B0BA", textDecoration: "line-through", lineHeight: 1.4 }}>{b.o}</div>
              <div style={{ color: "#2C2C3A", background: "rgba(123,175,139,0.1)", padding: "6px 10px", borderRadius: 8, marginTop: 3, lineHeight: 1.5 }}>{b.n}</div>
              {b.w && <div style={{ color: "#9A8A5A", fontSize: 10.5, marginTop: 3, lineHeight: 1.4 }}>💡 {b.w}</div>}
            </div>
          ))}
          <div style={{ fontSize: 13, fontWeight: 700, margin: "16px 0 10px" }}>{t.questions}</div>
          {(r.q || []).map((q, i) => (
            <div key={i} style={{ fontSize: 12, padding: "6px 0", color: "#5A5A6E", lineHeight: 1.5 }}>{i + 1}. {q}</div>
          ))}
        </div>
      </div>

      {/* AI asks you */}
      {r.ask && r.ask.length > 0 && (
        <div style={{ marginTop: 16, background: "rgba(107,159,212,0.08)", borderRadius: 14, padding: "14px 18px" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "#4A7AA8", marginBottom: 8 }}>💬 {t.aiAsks}</div>
          {r.ask.map((a, i) => (
            <div key={i} style={{ fontSize: 12.5, color: "#4A5A7E", lineHeight: 1.7 }}>· {a}</div>
          ))}
          <div style={{ fontSize: 10.5, color: "#8AA0B8", marginTop: 6 }}>{t.aiAsksHint}</div>
        </div>
      )}

      {/* Assumptions */}
      {r.assume && r.assume.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.05)", fontSize: 11, color: "#9A9AAA" }}>
          <b>{t.assumptions}:</b> {r.assume.join(" · ")}
        </div>
      )}
    </Glass>
  );
}

// ===== Channels: 大厂直通车 =====
const CHANNEL_DATA = [
  { cat: { zh: "PM 项目 (APM/RPM)", en: "PM Programs (APM/RPM)" }, items: [
    { co: "Google APM", url: "https://www.google.com/about/careers/applications/programs/apm", note: { zh: "9月底开放", en: "Opens late Sep" }, h1b: true },
    { co: "Meta RPM", url: "https://www.metacareers.com/rotational-programs", note: { zh: "18个月轮岗", en: "18-mo rotational" }, h1b: true },
    { co: "Uber APM", url: "https://www.uber.com/us/en/careers/teams/university/", note: { zh: "", en: "" }, h1b: true },
    { co: "Salesforce Futureforce", url: "https://www.salesforce.com/company/careers/university-recruiting/", note: { zh: "校招统一入口", en: "All campus roles" }, h1b: true },
    { co: "Microsoft Students", url: "https://careers.microsoft.com/v2/global/en/students", note: { zh: "PM/Design/HW都有", en: "PM/Design/HW" }, h1b: true },
    { co: "Amazon University", url: "https://www.amazon.jobs/en/business_categories/student-programs", note: { zh: "含Devices硬件PM", en: "Incl. Devices" }, h1b: true },
  ]},
  { cat: { zh: "Design / UX", en: "Design / UX" }, items: [
    { co: "Google UX Students", url: "https://careers.google.com/students/", note: { zh: "", en: "" }, h1b: true },
    { co: "Meta Design", url: "https://www.metacareers.com/students", note: { zh: "", en: "" }, h1b: true },
    { co: "Apple Students", url: "https://www.apple.com/careers/us/students.html", note: { zh: "", en: "" }, h1b: true },
    { co: "Airbnb University", url: "https://careers.airbnb.com/university/", note: { zh: "", en: "" }, h1b: true },
    { co: "Adobe University", url: "https://www.adobe.com/careers/university.html", note: { zh: "", en: "" }, h1b: true },
    { co: "Figma", url: "https://www.figma.com/careers/", note: { zh: "", en: "" }, h1b: true },
  ]},
  { cat: { zh: "硬件方向 (H1B友好)", en: "Hardware (H1B-friendly)" }, items: [
    { co: "Amazon Devices (Lab126)", url: "https://www.amazon.jobs/en/teams/lab126", note: { zh: "西雅图/湾区, Echo/Kindle", en: "Echo/Kindle" }, h1b: true },
    { co: "Microsoft Devices", url: "https://careers.microsoft.com/v2/global/en/hardware", note: { zh: "Surface, 就在Redmond", en: "Surface, Redmond" }, h1b: true },
    { co: "Meta Reality Labs", url: "https://www.metacareers.com/teams/technology?tab=AR%2FVR", note: { zh: "AR/VR硬件", en: "AR/VR HW" }, h1b: true },
    { co: "Google Devices", url: "https://www.google.com/about/careers/applications/teams/devices-and-services", note: { zh: "Pixel/Nest", en: "Pixel/Nest" }, h1b: true },
    { co: "NVIDIA University", url: "https://www.nvidia.com/en-us/about-nvidia/careers/university-recruiting/", note: { zh: "", en: "" }, h1b: true },
    { co: "Tesla Students", url: "https://www.tesla.com/careers/students", note: { zh: "", en: "" }, h1b: true },
  ]},
  { cat: { zh: "Startup 平台", en: "Startup Platforms" }, items: [
    { co: "Wellfound (AngelList)", url: "https://wellfound.com/jobs", note: { zh: "可按融资轮筛选", en: "Filter by funding" }, h1b: false },
    { co: "Work at a Startup (YC)", url: "https://www.workatastartup.com/", note: { zh: "YC系公司", en: "YC companies" }, h1b: false },
    { co: "APM List", url: "https://apmlist.com/", note: { zh: "APM项目周更", en: "Weekly APM list" }, h1b: false },
  ]},
];

function Channels({ t, lang }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{t.channels}</h2>
      <div style={{ fontSize: 12, color: "#9A9AAA", marginBottom: 20 }}>
        {lang === "zh" ? "大厂校招官方入口 · 秋招季（8-10月）建议每周检查一次 APM/RPM 项目页" : "Official campus recruiting portals · Check APM/RPM pages weekly during Aug-Oct"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {CHANNEL_DATA.map((group, gi) => (
          <Glass key={gi}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: "#5A5A6E" }}>{group.cat[lang]}</div>
            {group.items.map((it, ii) => (
              <a key={ii} href={it.url} target="_blank" rel="noopener noreferrer" style={{
                display: "flex", alignItems: "center", gap: 8, padding: "9px 4px",
                borderBottom: ii < group.items.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                textDecoration: "none", color: "#2C2C3A",
              }}>
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{it.co}</span>
                {it.note[lang] && <span style={{ fontSize: 10.5, color: "#9A9AAA" }}>{it.note[lang]}</span>}
                {it.h1b && <span style={{ fontSize: 9.5, padding: "2px 7px", borderRadius: 999, background: "rgba(123,175,139,0.15)", color: "#4A8A5A", fontWeight: 600 }}>H1B✓</span>}
                <span style={{ color: "#B0B0BA", fontSize: 12 }}>↗</span>
              </a>
            ))}
          </Glass>
        ))}
      </div>
    </div>
  );
}

// ===== Modal =====
const iStyle = { width: "100%", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 13, outline: "none", boxSizing: "border-box", background: "rgba(255,255,255,0.6)", color: "#2C2C3A", fontFamily: "inherit" };
function Field({ label, children }) { return <div style={{ marginBottom: 14 }}><label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#8A8A9A", marginBottom: 5 }}>{label}</label>{children}</div>; }

function JobModal({ job, onSave, onDelete, onClose, t }) {
  const isEdit = !!job;
  const [form, setForm] = useState(job || { title: "", company: "", location: "", type: "Product Manager", posted: new Date().toISOString().split("T")[0], source: "manual", url: "", stage: "saved", notes: "", referralContact: "", tags: [] });
  const [tagInput, setTagInput] = useState("");
  const addTag = () => { const v = tagInput.trim(); if (v && !form.tags.includes(v)) { setForm(f => ({ ...f, tags: [...f.tags, v] })); setTagInput(""); } };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(44,44,58,0.25)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }} onClick={onClose}>
      <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", borderRadius: 24, padding: 28, width: 500, maxHeight: "86vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.6)", fontFamily: "inherit" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: "-0.02em" }}>{isEdit ? t.jobDetails : t.addNew}</h3>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(0,0,0,0.04)", border: "none", fontSize: 14, cursor: "pointer", color: "#9A9AAA", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        {isEdit && form.url && form.url !== "#" && (
          <a href={form.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 16, padding: "8px 16px", background: "rgba(123,175,139,0.12)", color: "#5A8A6A", borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>↗ {t.openOriginal}</a>
        )}
        <Field label={t.jobTitle}><input style={iStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Associate Product Manager" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label={t.company}><input style={iStyle} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Google" /></Field>
          <Field label={t.location}><input style={iStyle} value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Mountain View, CA" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label={t.typeCol}><select style={iStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}><option value="Product Manager">PM</option><option value="Product Designer">PD</option></select></Field>
          <Field label={t.stage}><select style={iStyle} value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>{STAGES.map(s => <option key={s.id} value={s.id}>{t.stages[s.id]}</option>)}</select></Field>
        </div>
        {!isEdit && <Field label={t.link}><input style={iStyle} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." /></Field>}
        <Field label={t.referralContact}><input style={iStyle} value={form.referralContact} onChange={e => setForm(f => ({ ...f, referralContact: e.target.value }))} placeholder="Mike · Designer @ Airbnb" /></Field>
        <Field label={t.tags}>
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...iStyle, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addTag()} placeholder={t.tagPlaceholder} />
            <button onClick={addTag} style={{ padding: "0 16px", background: "#2C2C3A", color: "#fff", border: "none", borderRadius: 12, cursor: "pointer", fontSize: 11, fontWeight: 600 }}>{t.add}</button>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 6 }}>{form.tags.map(tag => (<span key={tag} onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(x => x !== tag) }))} style={{ fontSize: 11, background: "rgba(155,142,196,0.12)", color: "#7A6EA4", padding: "3px 10px", borderRadius: 999, cursor: "pointer", fontWeight: 500 }}>{tag} ✕</span>))}</div>
        </Field>
        <Field label={t.notes}><textarea style={{ ...iStyle, height: 68, resize: "vertical" }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder={t.notesPlaceholder} /></Field>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button onClick={() => form.title && form.company && onSave(form)} style={{ flex: 1, padding: 12, background: "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{isEdit ? t.save : t.saveBtn}</button>
          {isEdit && onDelete && (<button onClick={() => onDelete(job.id)} style={{ padding: "12px 22px", background: "rgba(196,123,139,0.12)", color: "#A05A6A", border: "none", borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.delete}</button>)}
        </div>
      </div>
    </div>
  );
}
