# OfferPilot Evals

A consistency-evaluation harness for the resume–JD analysis feature. LLM outputs are probabilistic; this answers "how stable is the analysis?" before trusting it.

## Golden set
`golden_set.json`: 10 real, public job descriptions (condensed) across all five role categories the product serves, paired with the public demo resume. Each pair carries human labels:
- **expect_band** — the match-score range a reasonable human reviewer would assign
- **expect_must** — the hard requirements the analysis should detect

## Protocol
Each pair runs **3×** with identical input. We measure:
- **Score stability**: range and standard deviation across runs (pass: range ≤ 12)
- **Must-have consistency**: pairwise Jaccard overlap of detected requirements (pass: ≥ 0.6)
- **Label agreement**: mean score within the human-labeled band

## Run
```bash
ANTHROPIC_API_KEY=sk-ant-... node run_evals.mjs   # ~30 calls, < $0.50
```
Outputs `results.md` with a per-pair table and summary. Re-run after any prompt change — this doubles as a regression suite for prompt iterations.
