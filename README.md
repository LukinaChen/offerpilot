# OfferPilot 🌿 — AI Job-Search Copilot

Personal job-search copilot for new-grad PM / UX / Hardware / Ops candidates.
Aggregates fresh postings daily from open-source job repos, tracks a 6-stage pipeline,
and (with your own Anthropic API key) scores resume-JD fit, checks ATS keywords,
drafts tailored bullets, and refines them via chat.

**Live demo:** (add your Vercel URL here)

## Deploy in 15 minutes

1. Push this folder to a GitHub repo
2. vercel.com → Add New Project → Import the repo (zero config, Vite auto-detected)
3. Done. Optional: Settings → Domains → add your custom domain

## Notes

- Job tracking works out of the box; the ↻ button live-fetches from GitHub raw (CORS-open)
- AI features are BYO-key: paste an Anthropic API key in Resume Lab — stored in your
  browser's localStorage only, never sent anywhere except api.anthropic.com
- Data sources: jobright-ai open-source job repos (star them — they do the daily heavy lifting)


## Stack

React 18 + Vite + Recharts · Claude Sonnet via Anthropic API · localStorage persistence
