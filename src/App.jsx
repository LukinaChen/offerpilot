import { useState, useEffect, useMemo } from "react";
// OFFERPILOT_VERSION: v0.4.26 (add-to-jobs from Resume Lab report)
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
    matchScore: "匹配度", verdict: "投递建议", mustHaves: "硬性要求逐条对照", gaps: "Gap 与补救", tailored: "简历定向改写建议", questions: "预测面试题", h1bFlags: "身份/签证信号", assumptions: "本报告的假设", levelCheck: "级别判断", visaRedTitle: "⚠️ 这个岗位可能不支持签证赞助", visaRedBody: "在JD原文里检测到不支持sponsorship的表述，作为F-1/需要H-1B的候选人，投递前请务必确认。命中：", visaGreen: "JD中提到可能支持签证赞助 —— 但仍建议投递前确认具体条款。",
    hit: "✓ 命中", partial: "◐ 部分", miss: "✗ 缺失",
    analyzeFail: "分析失败（已自动重试2次）。请稍等几秒再点一次；若持续失败请告诉 Claude 报错情况。",
    tailorNote: "改写只重组你简历中已有的事实，绝不虚构。数字若标 [待确认]，请核实后再用。",
    myPortfolio: "作品集（UX/PD 投递用）", portfolioHint: "粘贴项目简介（推荐）或作品集网址；保存一次反复使用", portfolioPlaceholder: "项目1: 智能家居App重设计, 负责端到端流程...\n或 https://yourportfolio.com",
    ftLabel: "全职", internLabel: "实习",
    picksTitle: "今日必投", picksSub: "按你的赛道胜率自动排序 · 近48小时", pkOps: "Ops/PjM主仓", pkGrowth: "Growth/CRM本命", pkAI: "AI进攻线", pkLocal: "🏠西雅图本地", pkRemote: "Remote", pkToday: "今日新发",
    interview: "面试",
    ivStories: "故事工坊", ivBank: "题库", ivCards: "答案卡",
    ivStoriesTitle: "每条简历bullet都该有一个能讲90秒的故事",
    ivStoriesHint: "从你的简历库自动提取所有bullet。点击一条，写下你的故事草稿，AI按STAR完整性、重点聚焦（反流水账）、口述时长三道标准审查——绝不替你编内容，缺事实只会追问。⚪未开发 🟡草稿 🟢已打磨",
    ivNoBullets: "简历库为空——先去简历工坊上传简历，bullet会自动出现在这里；或用上方输入框添加自定义故事",
    ivCustomPh: "贴入一条简历bullet原文（或写一段想准备的经历，如失败、冲突故事），点＋创建", ivCustomAdd: "添加", ivCustomTag: "手动添加",
    channelsSub: "官方校招入口",
    ivDraftLabel: "你的故事草稿（中英文都可以，怎么讲就怎么写）",
    ivDraftPh: "把这条bullet背后的故事写下来：当时什么情况、你的任务边界、你具体做了什么、结果如何…",
    ivReview: "审查这个故事", ivReviewing: "审查中…",
    ivMainPoint: "这个故事证明的核心能力", ivCuts: "建议删掉", ivPolished: "打磨版（≤90秒口述）",
    ivMarkDone: "标记为已打磨", ivMarkDraft: "退回草稿",
    ivAddQ: "添加题目", ivQCompany: "公司（选填）", ivQPh: "输入面试题（可一次粘贴多行，每行一题）。来源：JD分析预测、Claude帮你扫的面经、面试后回忆",
    ivBankEmpty: "题库为空。来源：简历工坊JD分析的预测面试题、面经搜集、真实面试后的回忆",
    ivBankFlow: "面经搜集工作流：把「公司＋岗位＋轮次」发给 Claude 对话，让它全网扫面经并整理成清单，回来整段粘贴（多行批量，每行一题）。",
    qTypes: { screening: "📞 筛选轮", behavioral: "🗣 行为面", product: "📦 产品题", analytical: "📊 数据分析", company: "🏢 公司面经", reverse: "🙋 反问环节" },
    ivCardsTitle: "筛选轮标准答案卡",
    ivCardsHint: "recruiter screen的四道必考题，答案提前定稿——这些不需要即兴发挥，需要的是每次都说得一样稳。",
    cardIntro: "60秒自我介绍", cardWhyUs: "为什么想来我们公司（通用框架，按公司填空）", cardVisa: "身份/签证话术（CPT/OPT时间线）", cardSalary: "薪资预期话术",
    ivAutoSave: "自动保存到本机",
    ivStoriesHint2: "为每条值得讲的经历打磨一个≤90秒的STAR故事。手动贴入bullet，或点「从简历导入」勾选；AI审查绝不编造，缺事实只追问。⚪未开发 🟡草稿 🟢已打磨", ivImport: "从简历导入", ivImportPick: "勾选要准备故事的bullet（已在列表中的显示✓）", ivImportBtn: "导入所选", ivCompany: "公司", ivNoCompany: "未分组", ivEmptyList: "还没有条目——上方贴入一条bullet，或从简历导入", del: "删除",
    delSure: "确认删除？",
    ivDelConfirm: "删除这条及其故事？", ivDelStoryConfirm: "删除这条bullet的故事草稿和审查记录？（bullet本身来自简历，仍会显示）",
    ivToManual: "转为手动条目（可编辑文本）", edit: "编辑",
    back: "返回",
    regionAll: "全部地区", allStages: "全部状态", allLocations: "全部地点", regionNA: "北美", regionCN: "中国", fRegion: "地区", fPosted: "岗位发布日期", fApplied: "我的投递日期（改阶段为已投递时自动记录，可修改）",
    menuHelp: "使用指南", resetJobs: "重置岗位数据", resetSure: "再点一次确认清空（保留简历和面试）", menuExport: "导出备份", menuImport: "导入备份",
    exportTip: "导出备份（不含API Key）", importTip: "导入备份", importOk: "导入成功，即将刷新", importBad: "文件格式不对，请选择 OfferPilot 导出的备份文件",
    aiAsks: "AI 想问你", aiAsksHint: "在下方对话框里回答，AI 会把你的补充事实织进改写",
    refineTitle: "对话微调", refineHint: "不认可某条改写？直接说。有报告没问到的经历？在这里补充，AI 会给出融合后的新版本（不超原句长度+10%）。",
    refinePlaceholder: "例如：第二条我其实还做过A/B测试... (Opt+Enter to send)", refineSend: "发送", refineThinking: "思考中...",
    jdUrl: "投递链接（选填，会存进报告）", applyLink: "投递入口", addToJobs: "加入岗位列表", addConfirm: "再点一次确认（标为已投递）", addedToJobs: "已加入", rerun: "简历改完了，重测对比",
    atsKw: "ATS 关键词核对", kwAdd: "可以补 — 你有对应经历，融进对应bullet即可", kwCant: "补不了 — 这些是你确实没有的领域知识", kwCantNote: "不要硬塞或编造。这类词决定了你在这个岗位的关键词天花板，投递时靠其他优势取胜。", kwReach: "补齐后可达", kwHave: "已覆盖", kwNote: "分数=recruiter按关键词搜索时你的可见度，不是资格判定。硬门槛（学历/工作授权/时间）才是真正卡人的。",
    hardReqs: "硬性条件（缺了就是硬伤）", softReqs: "软性条件（特质与工作方式）",
    keyTitle: "连接你的 Anthropic API Key 以启用 AI 功能", keyHint: "Key 只保存在你自己的浏览器（localStorage），不会上传到任何服务器。在 console.anthropic.com 免费获取。没有 Key 也可以使用岗位追踪的全部功能。", keySet: "API Key 已连接（仅存本机）", keyClear: "断开",
    uploadFile: "上传文件", uploadHint: "支持 .md / .txt（PDF请先转文本）",
    resumeLib: "简历库", addResume: "添加简历", resumeName: "简历名称", editBtn: "编辑", noResumes: "还没有简历，点击添加",
    usingResume: "使用简历", autoPick: "帮我选简历", picking: "AI 判断中...", pickFail: "自动选择失败，请手动选一份",
    persona: "他们在找什么人", hiddenSignal: "隐藏信号", folioReview: "作品集评审", folioLead: "主打项目", folioAlign: "对齐度", folioGap: "缺口",
    stages: { saved: "收藏", applied: "已投递", referral_asked: "求内推", referral_got: "获内推", written_test: "已笔试", interview: "面试中", offer: "Offer", rejected: "已拒" },
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
    matchScore: "Match", verdict: "Verdict", mustHaves: "Must-have requirements", gaps: "Gaps & fixes", tailored: "Tailored bullet suggestions", questions: "Predicted questions", h1bFlags: "Visa/status signals", assumptions: "Assumptions", levelCheck: "Level check", visaRedTitle: "⚠️ This role may NOT offer visa sponsorship", visaRedBody: "Detected sponsorship-exclusion language in the JD. As an F-1 / H-1B-dependent candidate, confirm before applying. Matched:", visaGreen: "The JD mentions possible visa sponsorship — still confirm specifics before applying.",
    hit: "✓ Hit", partial: "◐ Partial", miss: "✗ Miss",
    analyzeFail: "Analysis failed (auto-retried twice). Wait a few seconds and try again; if it persists, tell Claude.",
    tailorNote: "Rewrites only reorganize facts already in your resume — nothing is fabricated. Verify any number marked [TBC].",
    myPortfolio: "Portfolio (for UX/PD roles)", portfolioHint: "Paste project summaries (recommended) or portfolio URL; saved for reuse", portfolioPlaceholder: "Project 1: Smart home app redesign, end-to-end...\nor https://yourportfolio.com",
    ftLabel: "Full-time", internLabel: "Intern",
    picksTitle: "Today's Picks", picksSub: "Ranked by your lane strategy · last 48h", pkOps: "Ops/PjM", pkGrowth: "Growth/CRM", pkAI: "AI lane", pkLocal: "🏠Seattle local", pkRemote: "Remote", pkToday: "New today",
    interview: "Interview",
    ivStories: "Story Studio", ivBank: "Question Bank", ivCards: "Answer Cards",
    ivStoriesTitle: "Every resume bullet deserves a 90-second story",
    ivStoriesHint: "Bullets are auto-extracted from your resume library. Click one, draft your story, and AI reviews it against STAR completeness, single-point focus (anti-rambling), and spoken length — it never invents facts, only asks for missing ones. ⚪ not started 🟡 draft 🟢 polished",
    ivNoBullets: "Resume library is empty — upload a resume in Resume Lab first, or add a custom story above",
    ivCustomPh: "Paste a resume bullet, or describe any experience worth preparing (a failure, a conflict), then click +", ivCustomAdd: "Add", ivCustomTag: "Manual",
    channelsSub: "official campus portals",
    ivDraftLabel: "Your story draft (write it the way you'd say it)",
    ivDraftPh: "Tell the story behind this bullet: the situation, your ownership, what YOU did, and the result…",
    ivReview: "Review this story", ivReviewing: "Reviewing…",
    ivMainPoint: "The ONE thing this story proves", ivCuts: "Cut these", ivPolished: "Polished (≤90s spoken)",
    ivMarkDone: "Mark polished", ivMarkDraft: "Back to draft",
    ivAddQ: "Add a question", ivQCompany: "Company (optional)", ivQPh: "Paste questions (multi-line = one per line). Sources: JD predictions, interview research, post-interview recall",
    ivBankEmpty: "Empty. Sources: predicted questions from Resume Lab's JD analysis, interview research, real-interview recall",
    ivBankFlow: "Research workflow: send company + role + round to Claude in chat for a web sweep, then paste the list back here (one question per line).",
    qTypes: { screening: "📞 Screening", behavioral: "🗣 Behavioral", product: "📦 Product", analytical: "📊 Analytical", company: "🏢 Company-specific", reverse: "🙋 Reverse Qs" },
    ivCardsTitle: "Screening-round answer cards",
    ivCardsHint: "The four questions every recruiter screen asks. Script them once — these reward consistency, not improvisation.",
    cardIntro: "60-second intro", cardWhyUs: "Why us (framework, fill per company)", cardVisa: "Visa talk track (CPT/OPT timeline)", cardSalary: "Salary expectations talk track",
    ivAutoSave: "Auto-saved locally",
    ivStoriesHint2: "Polish a ≤90s STAR story for every experience worth telling. Paste a bullet manually, or use Import to pick from your resumes. AI never invents — it only asks. ⚪ not started 🟡 draft 🟢 polished", ivImport: "Import from resumes", ivImportPick: "Pick bullets to prepare (✓ = already in list)", ivImportBtn: "Import selected", ivCompany: "Company", ivNoCompany: "Ungrouped", ivEmptyList: "Nothing yet — paste a bullet above, or import from your resumes", del: "Delete",
    delSure: "Confirm?",
    ivDelConfirm: "Delete this entry and its story?", ivDelStoryConfirm: "Delete this bullet's story draft and review? (The bullet itself comes from your resume and will remain listed.)",
    ivToManual: "Convert to manual entry (editable text)", edit: "Edit",
    back: "Back",
    regionAll: "All regions", allStages: "All stages", allLocations: "All locations", regionNA: "North America", regionCN: "China", fRegion: "Region", fPosted: "Job posted date", fApplied: "My application date (auto-set when moved to Applied; editable)",
    menuHelp: "How to use", resetJobs: "Reset job data", resetSure: "Tap again to confirm (resumes & interview kept)", menuExport: "Export backup", menuImport: "Import backup",
    exportTip: "Export backup (API key excluded)", importTip: "Import backup", importOk: "Imported — reloading", importBad: "Invalid file — choose an OfferPilot backup",
    aiAsks: "AI asks you", aiAsksHint: "Answer in the chat below — new facts get woven into revised bullets",
    refineTitle: "Refine via chat", refineHint: "Disagree with a rewrite? Say so. Have experience the report didn't ask about? Add it here — you'll get a merged version (max +10% length).",
    refinePlaceholder: "e.g. For bullet 2, I actually also ran A/B tests... (Opt+Enter to send)", refineSend: "Send", refineThinking: "Thinking...",
    jdUrl: "Application URL (optional, saved with report)", applyLink: "Apply", addToJobs: "Add to jobs", addConfirm: "Tap again — marks applied", addedToJobs: "Added", rerun: "Resume updated? Re-test",
    atsKw: "ATS keyword check", kwAdd: "Can add — you have this experience, weave it into the named bullet", kwCant: "Cannot add — domain knowledge you genuinely lack", kwCantNote: "Do not fake these. They set your keyword ceiling for this role; win on other strengths instead.", kwReach: "Reachable", kwHave: "Covered", kwNote: "The score reflects recruiter keyword-search visibility, not whether you qualify. Hard requirements (degree, work authorization, timing) are what actually gate you.",
    hardReqs: "Hard requirements (dealbreakers)", softReqs: "Soft requirements (traits & ways of working)",
    keyTitle: "Connect your Anthropic API key to enable AI features", keyHint: "Stored only in your own browser (localStorage), never uploaded anywhere. Get one free at console.anthropic.com. All job-tracking features work without a key.", keySet: "API key connected (local only)", keyClear: "Disconnect",
    uploadFile: "Upload file", uploadHint: ".md / .txt (convert PDF to text first)",
    resumeLib: "Resume Library", addResume: "Add resume", resumeName: "Resume name", editBtn: "Edit", noResumes: "No resumes yet — add one",
    usingResume: "Using", autoPick: "Pick for me", picking: "Deciding...", pickFail: "Auto-pick failed — select manually",
    persona: "Who they really want", hiddenSignal: "Hidden signal", folioReview: "Portfolio review", folioLead: "Lead with", folioAlign: "Alignment", folioGap: "Gap",
    stages: { saved: "Saved", applied: "Applied", referral_asked: "Asked", referral_got: "Secured", written_test: "Test done", interview: "Interview", offer: "Offer", rejected: "Rejected" },
    pm: "PM", pd: "PD",
    today: "Today", yesterday: "Yesterday", daysAgo: d => `${d}d ago`, weeksAgo: w => `${w}w ago`,
  },
};

let __uidc=0;
function uid(prefix){return prefix+"-"+Date.now().toString(36)+"-"+(__uidc++).toString(36);}
const LOC_PRESETS = [
  { v: "seattle", n: "Seattle" }, { v: "bellevue", n: "Bellevue" }, { v: "redmond", n: "Redmond" },
  { v: "san francisco", n: "San Francisco" }, { v: "new york", n: "New York" }, { v: "los angeles", n: "Los Angeles" },
  { v: "austin", n: "Austin" }, { v: "boston", n: "Boston" }, { v: "chicago", n: "Chicago" },
  { v: "remote", n: "Remote" }, { v: ", wa", n: "Washington 州" }, { v: ", ca", n: "California 州" },
  { v: "beijing", n: "北京" }, { v: "shanghai", n: "上海" }, { v: "shenzhen", n: "深圳" }, { v: "hangzhou", n: "杭州" },
];
const STAGES = [
  { id: "saved", color: "#8B8FA3", accent: "#C8CAD4" },
  { id: "applied", color: "#7BA1C7", accent: "#B8D4F0" },
  { id: "referral_asked", color: "#C9A86C", accent: "#F0DFB8" },
  { id: "referral_got", color: "#7BAF8B", accent: "#B8E5C8" },
  { id: "written_test", color: "#8FA3C4", accent: "#C4D4EC" },
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
  return{jobs:all.filter(j=>{const k=`${j.company}::${j.title}::${j.location}`.toLowerCase();if(seen.has(k))return false;seen.add(k);return true;}).sort((a,b)=>b.posted.localeCompare(a.posted)).map((j)=>({...j,id:uid("lv")})),errors:errs};
}
const MAJOR_COS=["tiktok","bytedance","google","meta","microsoft","amazon","apple","nvidia","salesforce","adobe","uber","lyft","airbnb","doordash","stripe","paypal","intuit","netflix","linkedin","pinterest","snap","databricks","snowflake","oracle","ibm","capital one","jpmorgan","goldman","morgan stanley","visa","mastercard","walmart","tesla","samsung","dell","atlassian","figma","openai","anthropic","expedia","zillow","qualcomm","intel","amd","cisco","bloomberg","disney","spotify","reddit","roblox","ebay","coinbase","instacart","starbucks","boeing","t-mobile","nike","cvs","unitedhealth","gartner","servicenow","workday","veeva","salesforce"];
function isMajor(co){const x=(co||"").toLowerCase();return MAJOR_COS.some(m=>x.includes(m));}
function relDate(ds,t){const diff=Math.max(0,Math.floor((new Date()-new Date(ds))/864e5));if(diff===0)return "🆕 "+t.today;if(diff===1)return t.yesterday;if(diff<7)return t.daysAgo(diff);return t.weeksAgo(Math.floor(diff/7));}

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
  const INITIAL_JOBS = [{"id": "applied-sf", "company": "Salesforce", "title": "Associate Product Manager (starting summer 2027)", "location": "San Francisco, CA", "url": "https://salesforce.com/careers", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-16", "source": "manual", "region": "NA", "h1b": "likely", "stage": "applied", "appliedDate": "2026-08-16", "tags": [], "notes": "", "referralContact": ""}, {"company": "Dealpath", "title": "Associate Product Manager, Strategic Accounts", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a91c6d48e59685453377c29?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-0", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Eaton", "title": "Product Specialist", "location": "Waukesha, WI, United States", "url": "https://jobright.ai/jobs/info/6a91bcca360363009919428a?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-1", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "SharkNinja", "title": "Associate Product Developer - Floorcare", "location": "Needham, MA, United States", "url": "https://jobright.ai/jobs/info/6a91b30e3603630099193d1c?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-2", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Gesa Credit Union", "title": "Product Owner I", "location": "Richland, WA, United States", "url": "https://jobright.ai/jobs/info/6a582a7b9838a11e5d8372e1?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-3", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "SUNPAN", "title": "Product Data Coordinator", "location": "Scarborough, ON, Canada", "url": "https://jobright.ai/jobs/info/6a760a90bb6ca93ae5610938?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-4", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Instawork", "title": "Product Operations Analyst", "location": "San Francisco, CA, United States", "url": "https://jobright.ai/jobs/info/6a6ab634394f9d64d8be6ada?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-5", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Acosta", "title": "Product Demonstrator Part Time", "location": "Long Beach, CA, United States", "url": "https://jobright.ai/jobs/info/6a5a6ed03ac7627fe9003f44?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-6", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Acosta", "title": "Product Demonstrator Part Time - 6367", "location": "Humble, TX, United States", "url": "https://jobright.ai/jobs/info/6a59dd7bc8e3a473cb8a88bc?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-7", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "FDH Aero", "title": "Associate Product Manager", "location": "Oklahoma City, OK, United States", "url": "https://jobright.ai/jobs/info/6a91cbac9864261ccd29f1ac?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-8", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Gap Inc.", "title": "Assistant Manager, Product Operations", "location": "Oak Brook, IL, United States", "url": "https://jobright.ai/jobs/info/6a918650a27a2d3c984885c6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-9", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Leaf Home", "title": "Product Demonstrator ($18/hr + Commission)", "location": "San Antonio, TX, United States", "url": "https://jobright.ai/jobs/info/6a6470208d5360344960663e?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-10", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "The Travel Corporation", "title": "Product Coordinator, Uniworld", "location": "Calabasas, CA, United States", "url": "https://jobright.ai/jobs/info/6a91bf6bd18f756748279f7c?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-11", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Centric Brands", "title": "Product Development Assistant -Off Price", "location": "Los Angeles, CA, United States", "url": "https://jobright.ai/jobs/info/6a5e6e49270e3033b045dddb?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-12", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Arden Fair", "location": "Sacramento, CA, United States", "url": "https://jobright.ai/jobs/info/6a90d6348ffa38557e6cf115?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-13", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Camping World", "title": "Product Specialist Advisor", "location": "Kaysville, UT, United States", "url": "https://jobright.ai/jobs/info/6a5c3726686b4755d1e1b3ba?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-14", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Leaf Home", "title": "Product Demonstrator ($18/hr PLUS Commission)", "location": "800 Conestoga Pkwy, Shepherdsville, KY 40165, USA", "url": "https://jobright.ai/jobs/info/6a5e654b67b2850e77df0d68?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-15", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Nelnet", "title": "Product Owner - FACTS Financial Aid", "location": "Lincoln, NE, United States", "url": "https://jobright.ai/jobs/info/6a90c6537c32860d14cfb6f6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-16", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Databricks", "title": "Associate Product Manager, New Grad (2027 Start)", "location": "Bellevue, WA, United States", "url": "https://jobright.ai/jobs/info/6a5908d5c8e3a473cb8a4916?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-17", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Victoria’s Secret & Co.", "title": "Associate Product Developer, Lingerie & Apparel", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a90d7657c32860d14cfb9fc?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-18", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vail Resorts", "title": "Retail Product Data Processor", "location": "Broomfield, CO, United States", "url": "https://jobright.ai/jobs/info/6a9089c2d96ad228f1261cc3?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-19", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Dominion Energy", "title": "Associate Business Technology Analyst (CAYCE, SC, US, 29033)", "location": "Cayce, SC, United States", "url": "https://jobright.ai/jobs/info/6a90cffc2e254e06fb9f2f98?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-20", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "RELX", "title": "Product Operations Coordinator", "location": "Duluth, GA, United States", "url": "https://jobright.ai/jobs/info/6a91d8eec12c90443efc885b?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-21", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "LexisNexis Risk Solutions", "title": "Product Operations Coordinator", "location": "Duluth, GA, United States", "url": "https://jobright.ai/jobs/info/6a91e22b8e5968545337832f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-22", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Hewlett Packard Enterprise", "title": "Product Management Graduate (Master's/MBA)", "location": "Spring, TX, United States", "url": "https://jobright.ai/jobs/info/6a91dc609864261ccd29f607?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-23", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "The Hartford", "title": "Associate, Product Leadership Development Program", "location": "Hartford, CT, United States", "url": "https://jobright.ai/jobs/info/6a91a194360363009919378f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-24", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Bending Spoons", "title": "Graduate product manager", "location": "London, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a909fd1d96ad228f12624b5?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-25", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Baylor Scott & White Health", "title": "Product Associate — Employee Activation", "location": "United States", "url": "https://jobright.ai/jobs/info/6a76f4d67b3417772ade9bb2?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-26", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Bending Spoons", "title": "Product manager", "location": "London, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a907e7c8ffa38557e6cd331?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-27", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "VF Corporation", "title": "The North Face: Global Associate Merchant Apparel - Tops, Bottoms (Men)", "location": "Denver, CO, United States", "url": "https://jobright.ai/jobs/info/6a9079188ffa38557e6cd1ba?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-28", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "KeyBank", "title": "Product Associate, Core Treasury Fraud Product Team", "location": "Brooklyn, OH, United States", "url": "https://jobright.ai/jobs/info/6a9048418ffa38557e6cbe7d?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-29", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "OpenEye", "title": "Technical Product Manager", "location": "Liberty Lake, WA, United States", "url": "https://jobright.ai/jobs/info/6a57d0aef7517b519ad5d48a?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-30", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Steve Madden", "title": "Product Development Associate", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a904b61a19886486676030f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-31", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Pets+People Consumer Products", "title": "Sourcing Coordinator", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a90710d2e254e06fb9f0f0f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-32", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "EAB", "title": "Product Experience Designer (PXD), Analyst", "location": "Richmond, VA, United States", "url": "https://jobright.ai/jobs/info/6a554fd8ae07d60a8d01076d?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-33", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vertafore", "title": "Product Owner I", "location": "Denver, CO, United States", "url": "https://jobright.ai/jobs/info/6a749ea1bb6ca93ae560add3?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-34", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Cresco Labs", "title": "Product Development Technician", "location": "Joliet, IL, United States", "url": "https://jobright.ai/jobs/info/6a906919a198864866760ec5?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-35", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "KITH", "title": "Technical Product Associate", "location": "Brooklyn, NY, United States", "url": "https://jobright.ai/jobs/info/6a9044410bd89e205d2494c6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-36", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Winland Foods", "title": "Product Development Intern", "location": "Oak Brook, IL, United States", "url": "https://jobright.ai/jobs/info/6a7395221ce9647cdbca9068?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-37", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Gilbane Building", "title": "Product Management Specialist", "location": "Providence, RI, United States", "url": "https://jobright.ai/jobs/info/6a7370e41ce9647cdbca82d9?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-38", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Bath & Body Works", "title": "Assistant Digital Merchant", "location": "Columbus, OH, United States", "url": "https://jobright.ai/jobs/info/6a904ae08ffa38557e6cbf47?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-39", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Medtronic", "title": "Associate Product Specialist - Pain (Onsite in Minneapolis, MN)", "location": "Minneapolis, MN, United States", "url": "https://jobright.ai/jobs/info/6a9033e12e254e06fb9ef9d2?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-40", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Zayo Group", "title": "Product Management Specialist", "location": "CO - Denver, United States of America", "url": "https://jobright.ai/jobs/info/6a4becec4f64ba41dcb5dc02?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-41", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Tris Pharma", "title": "Product Development Technician", "location": "Monmouth Junction, NJ, United States", "url": "https://jobright.ai/jobs/info/6a902e32d96ad228f125fe2a?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-42", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Kiss Beauty Group", "title": "Product Associate, Lash", "location": "Port Washington, NY, United States", "url": "https://jobright.ai/jobs/info/6a564005f7517b519ad545e1?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-43", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Mizuho OSI", "title": "Regional Product Specialist", "location": "Atlanta, GA, United States", "url": "https://jobright.ai/jobs/info/6a69c05b19d76667a2abc1fe?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-44", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Mizuho OSI", "title": "Regional Product Specialist Job Details / Mizuho OSI", "location": "Atlanta, GA, United States", "url": "https://jobright.ai/jobs/info/6a8293b53eeac101cfa9b7a9?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-45", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Federal Signal", "title": "Product Specialist - Systems", "location": "University Park, IL, United States", "url": "https://jobright.ai/jobs/info/6a8fe209d96ad228f125eefd?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-46", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "VF Corporation", "title": "The North Face: Global Associate Merchant Apparel - Tops, Bottoms (Women)", "location": "Denver, CO, United States", "url": "https://jobright.ai/jobs/info/6a8fcf1c7c32860d14cf6ce3?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-47", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "EDS Strategy", "title": "Product Demonstrator", "location": "Orlando, FL, United States", "url": "https://jobright.ai/jobs/info/6a58521d68d16a30e24127d2?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-48", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Halma plc", "title": "Associate Product Manager", "location": "Garden Grove, CA, United States", "url": "https://jobright.ai/jobs/info/6a90d03f0bd89e205d24c656?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-49", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "The North Face", "title": "The North Face: Global Associate Merchant Apparel - Tops, Bottoms (Men)", "location": "Denver, CO, United States", "url": "https://jobright.ai/jobs/info/6a90720ea1988648667612f1?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-50", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "BRG", "title": "Junior Product Manager", "location": "United States", "url": "https://jobright.ai/jobs/info/6a7dcbdbe2030208f2765ec2?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-51", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Health Care Service Corporation", "title": " Product Analyst - LHB", "location": "Rosemont, IL, United States", "url": "https://jobright.ai/jobs/info/6a90c1c4a1988648667631ae?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-52", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Evertree Insurance", "title": "Product Operations Analyst", "location": "United States", "url": "https://jobright.ai/jobs/info/6a8f5191309e5f224870b7f0?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-53", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "FFF Enterprises", "title": "1350 Product Contracts Management - Project Specialist - PM", "location": "Temecula, CA, United States", "url": "https://jobright.ai/jobs/info/6a59eceac8e3a473cb8a8ec9?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-54", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Siemens", "title": "Product Manager, New Graduate (12-month contract)- Experience@Siemens", "location": "Vaughan, ON, Canada", "url": "https://jobright.ai/jobs/info/6a8f160fd7c91d0cf446d7bf?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-55", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Williams-Sonoma, Inc.", "title": "Sample Coordinator, Bed Bath - Pottery Barn", "location": "San Francisco, CA, United States", "url": "https://jobright.ai/jobs/info/6a6130bfab14335fc0f16b34?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-56", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Deutsche Bank", "title": "Product & Solutions Analyst", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a556a10268af95237beba12?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-57", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Fortress Investment Group", "title": "Analyst, Product Management and Investor Relations", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a76ea85a26ccc369f836a4f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-58", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "BuyWander", "title": "Product Grading Associate", "location": "Plymouth, MN, United States", "url": "https://jobright.ai/jobs/info/6a8f380d3ac3a34f92d8029d?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-59", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Beyond Retail (UK)", "title": "Product Associate", "location": "Bournemouth, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a8ecd6df841e649a718f352?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-60", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Five Star Bank", "title": "Deposit Product Analyst", "location": "Rochester, NY, United States", "url": "https://jobright.ai/jobs/info/6a67a1535d2a117fb9cec59e?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-61", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Supermicro", "title": "Associate Product Manager", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a560dd8efb06a45240d3945?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-62", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Best Buy", "title": "SWAT Product Flow Specialist", "location": "Tinley Park, IL, United States", "url": "https://jobright.ai/jobs/info/6a6cd15eba7efe79c2f66bcf?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-63", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Canada Goose", "title": "Associate Product Developer", "location": "Toronto, ON, Canada", "url": "https://jobright.ai/jobs/info/6a5fd45c33ef5c58b40004d1?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-64", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Sharp Electronics Corporation USA", "title": "Associate Product Manager - Product Planning", "location": "Memphis, TN, United States", "url": "https://jobright.ai/jobs/info/6a50abb22e2ceb72963b4ba0?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-65", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Summit Birmingham", "location": "Birmingham, AL, United States", "url": "https://jobright.ai/jobs/info/6a8e172ad34f700f87fd7da7?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-66", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Advisors Asset Management, Inc.", "title": "Product Management & Operations Analyst", "location": "Princeton, NJ, United States", "url": "https://jobright.ai/jobs/info/6a74d747972ac843c6997781?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-67", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Castle Megastore Group, Inc.", "title": "Product Upload Specialist", "location": "Phoenix, AZ, United States", "url": "https://jobright.ai/jobs/info/6a8e384b47679c68bf5e7079?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-68", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Dashing Diva", "title": "Product Development Coordinator", "location": "Port Washington, NY, United States", "url": "https://jobright.ai/jobs/info/6a8ee48dd7c91d0cf446c66d?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-69", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Market Square", "location": "Lake Forest, IL, United States", "url": "https://jobright.ai/jobs/info/6a69104fceb2691dfb2071a2?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-70", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Antech Diagnostics", "title": "Associate Product Manager (Loveland, CO)", "location": "Loveland, CO, United States", "url": "https://jobright.ai/jobs/info/6a50ba815165966a1161b569?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-71", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Scan.com", "title": "Associate Product Manager", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8dd1dc581f2d7bfdfe95b0?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-72", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "HP", "title": "Software Product Manager Graduate Roles - HP Solutions (HPS)", "location": "Fort Collins, CO, United States", "url": "https://jobright.ai/jobs/info/6a8e043325fc4e7ae3dbf480?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-73", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "PlanetArt", "title": "Associate Product Manager, Mobile", "location": "Calabasas, CA, United States", "url": "https://jobright.ai/jobs/info/6a7e49cfe2030208f2768bbf?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-74", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Houston", "location": "Houston, TX, United States", "url": "https://jobright.ai/jobs/info/6a8ddefc25fc4e7ae3dbe46b?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-75", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Rehoboth Beach Pop Up Outlet ( 7 Month Contract)", "location": "Rehoboth Beach, DE, United States", "url": "https://jobright.ai/jobs/info/6a8dfb0f581f2d7bfdfea4a6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-76", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "lululemon", "title": "Product Operations Lead / Santa Anita", "location": "Arcadia, CA, United States", "url": "https://jobright.ai/jobs/info/6a8dfb0a581f2d7bfdfea4a4?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-77", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Shoppers Drug Mart", "title": "Commis plancher - Temps plein", "location": "Mont-Laurier, QC, Canada", "url": "https://jobright.ai/jobs/info/6a8e00a325fc4e7ae3dbf2af?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-78", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "AlphaSense", "title": "Product Analyst, Financial Data", "location": "Vancouver, BC, Canada", "url": "https://jobright.ai/jobs/info/6a7b85ea3b399d106e4d71b8?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-79", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Lakeshore Learning Materials", "title": "Associate Product Developer (On-site)", "location": "Carson, CA, United States", "url": "https://jobright.ai/jobs/info/6a879ee0680f314a29d39970?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-80", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Alpine Bank", "title": "Digital Product Specialist", "location": "Grand Junction, CO, United States", "url": "https://jobright.ai/jobs/info/6a8de3b7581f2d7bfdfe9c50?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-81", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Ralph Lauren", "title": "Digital Technology Associate Product Manager", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a71ff4a45b6af1c30dbbe2f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-82", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Upper Canada Soap", "title": "Associate Product Manager -CPG/Retail", "location": "Mississauga, Ontario, Canada", "url": "https://jobright.ai/jobs/info/6a8dbe97d34f700f87fd5956?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-83", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Esri UK", "title": "Junior Product Manager", "location": "Edinburgh, Scotland, United Kingdom", "url": "https://jobright.ai/jobs/info/6a8dad14a5639a4810326cc6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-84", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "PISTOLA Denim", "title": "RTW Product Development Associate", "location": "Los Angeles, CA, United States", "url": "https://jobright.ai/jobs/info/6a8d67a425fc4e7ae3dbbeb8?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-85", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Veeva Systems", "title": "Associate Product Manager - Vault CRM Suite", "location": "Boston, MA, United States", "url": "https://jobright.ai/jobs/info/6a62e4de32abf9182432c142?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-86", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Procter & Gamble", "title": "IT Project & Product Manager (2027 Grads)", "location": "Cincinnati, OH, United States", "url": "https://jobright.ai/jobs/info/6a8cb49c25fc4e7ae3dba0f9?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-87", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Smithfield Foods", "title": "Product Development Assistant", "location": "Smithfield, VA, United States", "url": "https://jobright.ai/jobs/info/6a8cb23dd34f700f87fd234e?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-88", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Agave", "title": "Product Analyst", "location": "San Francisco, CA, US", "url": "https://jobright.ai/jobs/info/6a2b36d71de59e0682a889ef?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-89", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok USDS Joint Venture", "title": "Product Manager, E-Commerce Recommendations", "location": "Seattle, WA, United States", "url": "https://jobright.ai/jobs/info/6a8cd10fcde3717f9e9bf5d0?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-90", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "IsaacMorris", "title": "Licensing and Product Development Coordinator", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8ccf941d96e6541c8c31ab?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-91", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "iCapital", "title": "Product Manager - Analyst / Associate", "location": "Salt Lake City, UT, United States", "url": "https://jobright.ai/jobs/info/6a8cabbacde3717f9e9be8d9?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-92", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "SharkNinja", "title": "Associate Product Developer - Indoor Heated", "location": "Needham, MA, United States", "url": "https://jobright.ai/jobs/info/6a7a30a8a26ccc369f83cf82?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-93", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "ASUS", "title": "Associate Product Manager", "location": "Fremont, CA, United States", "url": "https://jobright.ai/jobs/info/6a8ca4b7581f2d7bfdfe4e5c?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-94", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Skorpios Technologies, Inc.", "title": "Associate Product Line Manager", "location": "Temecula, CA, United States", "url": "https://jobright.ai/jobs/info/6a8c700325fc4e7ae3db83ec?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-95", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Crystal Int'l (Group) Inc. & Crystal Claire Cosmetics Inc.", "title": "Junior Buyer/ Buyer", "location": "Scarborough, ON, Canada", "url": "https://jobright.ai/jobs/info/6a8c9f9cd34f700f87fd1a95?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-96", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Anglian Water Services", "title": "Junior Product Owner", "location": "Huntingdon, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a8c5b751d96e6541c8c0440?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-97", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Arc'teryx Equipment", "title": "Associate Product Line Manager, Veilance – Women’s", "location": "North Vancouver, BC, Canada", "url": "https://jobright.ai/jobs/info/6a4d94283122a76a8fd56013?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-98", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Procter & Gamble", "title": "Digital Product Manager", "location": "Cincinnati, OH, United States", "url": "https://jobright.ai/jobs/info/6a861060e459fa3baa865aa6?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-99", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Publicis Groupe", "title": "Associate Product Manager", "location": "Westminster, CO, United States", "url": "https://jobright.ai/jobs/info/6a4eb04e397d8d353c289f7d?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-100", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Polaris Inc.", "title": "Digital & IT Leadership Development Program Associate - Digital Product Development", "location": "Medina, MN, United States", "url": "https://jobright.ai/jobs/info/6a8c5955cde3717f9e9bc82a?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-101", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Picnic", "title": "Associate Product Manager, Platform", "location": "London, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a8b5916680f314a29d41076?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-102", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Anduril Industries", "title": "Product Operations Associate, Tier 1", "location": "Irvine, California, United States", "url": "https://jobright.ai/jobs/info/69c624bb1b5ad0288737eef7?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-103", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "MxD", "title": "Product Associate, Virtual Training Center", "location": "Chicago, IL, United States", "url": "https://jobright.ai/jobs/info/6a51b5e802522b5b722ea009?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-104", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "ChenMed", "title": "Associate IT Product Manager", "location": "Corporate Office, US", "url": "https://jobright.ai/jobs/info/69fd095a6b788e7e7a5c47de?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-105", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Armstrong World Industries", "title": "Associate Product Manager, Architectural Specialties Job Job Details / Armstrong World Industries", "location": "Lancaster, Pennsylvania, United States", "url": "https://jobright.ai/jobs/info/6a8a7d40cde3717f9e9b9887?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-106", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Amazon", "title": "Product Operations Coordinator, MGM+ Network Operations", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8a3a1b25fc4e7ae3db47f4?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-107", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Picnic", "title": "Product Manager, Platform", "location": "London, England, United Kingdom", "url": "https://jobright.ai/jobs/info/6a8b75314afae74a08350cbd?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-108", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Eastern Glass and Aluminum", "title": "Product Associate", "location": "Norcross, GA, United States", "url": "https://jobright.ai/jobs/info/6a4e60071544d7246c0d2767?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-109", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Baron & Baron", "title": "Bi-LingualMandarinChinese Product Develop Sales", "location": "Huntington Beach, CA, United States", "url": "https://jobright.ai/jobs/info/6a89f119680f314a29d3f86f?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-110", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "New Era Cap", "title": "Associate, Product Line (Key Account)", "location": "Buffalo, NY, United States", "url": "https://jobright.ai/jobs/info/6a7f4f12e51a1e18a2411854?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-111", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Veeva Systems", "title": "Associate Product Manager - Network MDM", "location": "Canada - Toronto", "url": "https://jobright.ai/jobs/info/6a176a62f45c6530ce9ac4b1?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-112", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Siemens EDA (Siemens Digital Industries Software)", "title": "Prototyping Product Manager", "location": "Santa Clara, CA, United States", "url": "https://jobright.ai/jobs/info/6a715d0bee751e0c793436b7?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-113", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "National Football League (NFL)", "title": "Seasonal Product Operations Coordinator", "location": "Inglewood, California, United States", "url": "https://jobright.ai/jobs/info/6a501abb1544d7246c0d7b79?utm_campaign=Product%20Management&utm_source=1103", "type": "Product Manager", "jobType": "fulltime", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-114", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Koch", "title": "Summer 2027", "location": "Wichita, KS, United States", "url": "https://jobright.ai/jobs/info/6a91ac73d18f756748279485?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-115", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Waresport", "title": "AI Product Intern (Fall)", "location": "United States", "url": "https://jobright.ai/jobs/info/6a9189c29864261ccd29d5f0?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-116", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Walt Disney World", "title": "Pricing & Product Development Intern, Spring 2027", "location": "Lake Buena Vista, FL, United States", "url": "https://jobright.ai/jobs/info/6a916ce40824ce0d7d1a09c6?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-117", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "PIMCO", "title": "2027 Summer Intern - Product Strategy Analyst, US", "location": "Newport Beach, CA, United States", "url": "https://jobright.ai/jobs/info/6a9164ba7c32860d14cfcb05?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-118", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Dreamwear", "title": "Product Development Intern", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a91a20f36036300991937b8?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-119", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "iA", "title": "Product Management Intern", "location": "Binghamton, NY, United States", "url": "https://jobright.ai/jobs/info/6a9181b1a27a2d3c984884ac?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-120", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Goldman Sachs", "title": "2027 / Americas / New York City Area/ AWM Management, Product Management / Summer Analyst", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a85dee24afae74a08341cee?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-121", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Databricks", "title": "Product Management Intern (Summer 2027)", "location": "Bellevue, WA, United States", "url": "https://jobright.ai/jobs/info/6a5908d763a8f619507bfd68?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-122", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Procter & Gamble", "title": "IT Project & Product Manager Internship", "location": "Cincinnati, OH, United States", "url": "https://jobright.ai/jobs/info/6a8ca1e025fc4e7ae3db9886?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-123", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "GE Vernova", "title": "GE Vernova Controls Product Management Intern - Summer 2027", "location": "Greenville, South Carolina, United States", "url": "https://jobright.ai/jobs/info/6a8dae3cd34f700f87fd5363?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-124", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Datadog", "title": "Product Management Intern", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a831bfe2dbaf907b07665e1?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-125", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "American Express", "title": "Campus Undergraduate Summer Internship Program - 2027 Product Management, Global Commercial Services - New York, NY", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a7146599a0ca4480c7d3a63?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-126", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Hewlett Packard Enterprise", "title": "Product Management Intern (Master's/MBA)", "location": "Spring, TX, United States", "url": "https://jobright.ai/jobs/info/6a91ddb79864261ccd29f642?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-127", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Workiva", "title": "Spring & Summer 2027 Intern - Product Management", "location": "United States", "url": "https://jobright.ai/jobs/info/6a9085ffd96ad228f1261b8f?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-128", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Toyota Material Handling", "title": "Product Planning Internship", "location": "Columbus, IN, United States", "url": "https://jobright.ai/jobs/info/6a909ae6d96ad228f12622f6?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-129", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "ROCKWOOL Group", "title": "Product Management - Intern", "location": "Chicago, IL, United States", "url": "https://jobright.ai/jobs/info/6a9096e67c32860d14cfa42b?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-130", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Johns Manville", "title": "Product Management Intern- Summer 2027", "location": "Denver, CO, United States", "url": "https://jobright.ai/jobs/info/6a906faf2e254e06fb9f0e9a?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-131", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Klein Tools", "title": "Product Management Intern", "location": "Lincolnshire, IL, United States", "url": "https://jobright.ai/jobs/info/6a908023a198864866761785?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-132", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Delta Air Lines", "title": "Co-op, Product and Brand Experience (Spring 2027)", "location": "Atlanta, GA, United States", "url": "https://jobright.ai/jobs/info/6a9003362e254e06fb9eeec5?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-133", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Marketeq Talent", "title": "Technical Product Management Associate (Internship)", "location": "United States", "url": "https://jobright.ai/jobs/info/6a8fa0a72e254e06fb9ede10?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-134", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Victoria’s Secret & Co.", "title": "Summer 2027 Merchandise Planning Internship with Victoria's Secret", "location": "Reynoldsburg, OH, United States", "url": "https://jobright.ai/jobs/info/6a8f85688ffa38557e6c98d0?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-135", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Amazon", "title": "2027 Amazon Leadership Accelerator (ALA) Product Manager Internship", "location": "Seattle, WA, United States", "url": "https://jobright.ai/jobs/info/6a722b0b71acd469eeda6576?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-136", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Spectrum Reach", "title": "Product Strategy Intern, Spectrum Reach Fall 2026", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8f6df5a19886486675d930?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-137", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Spectrum", "title": "Product Strategy Intern, Spectrum Reach Fall 2026", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8f4ac4f841e649a71919a0?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-138", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Xpansiv", "title": "Product Management Intern – AI Products", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8df9e347679c68bf5e5e48?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-139", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "American Express", "title": "Campus Undergraduate Summer Internship Program - 2027 Product Development, US Consumer Services - New York, NY", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a7243baee751e0c79347dc6?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-140", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Operations Intern (PGC) - 2027 Summer", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a8ec0f0382b237ac80c2b7f?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-141", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Strategist Project Intern (Advertisement Team) - 2026 Start (MBA)", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a8ea4c78f361f0a533d6929?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-142", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Synoptek", "title": "AI Product Development Intern", "location": "Boston, MA, United States", "url": "https://jobright.ai/jobs/info/6a8e41e9eb0ee5374a47ce58?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-143", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Copart", "title": "Technology Product Analyst Intern", "location": "Dallas, TX, United States", "url": "https://jobright.ai/jobs/info/6a8e09b2581f2d7bfdfeabcc?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-144", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vertiv", "title": "DC Power Product Management MBA Intern (Summer 2027)", "location": "Delaware, OH, United States", "url": "https://jobright.ai/jobs/info/6a8dc2e5cc0cf27068524f37?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-145", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Brunswick Corporation", "title": "Merucry Marine: Product Management Intern – Parts & Accessories", "location": "Fond du Lac, WI, United States", "url": "https://jobright.ai/jobs/info/6a8ddaba47679c68bf5e523d?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-146", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Brunswick Corporation", "title": "Mercury Marine: Product Management Intern – Oils & Lubricants", "location": "Fond du Lac, WI, United States", "url": "https://jobright.ai/jobs/info/6a8daac2cc0cf2706852456b?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-147", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "1KOMMA5°", "title": "Internship Global Product Management (m/f/d)", "location": "United States", "url": "https://jobright.ai/jobs/info/6a63ac8de8d8d22e3292a008?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-148", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "StudyFetch", "title": "Product Intern", "location": "Beverly Hills, CA, United States", "url": "https://jobright.ai/jobs/info/6a70fa239a0ca4480c7d23b0?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-149", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Walt Disney Imagineering", "title": "WDI Menu Planning Intern, Spring 2027", "location": "Glendale, CA, United States", "url": "https://jobright.ai/jobs/info/6a8d24c0a5639a481032559a?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-150", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Freddie Mac", "title": "Multifamily Digital Product Analysis Intern – Summer 2027", "location": "McLean, VA, United States", "url": "https://jobright.ai/jobs/info/6a8cac2dcde3717f9e9be8ed?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-151", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Retensa Employee Retention", "title": "AI Product Intern: Fall 2026", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8ccb1525fc4e7ae3dba7fa?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-152", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Operations Project Intern (TikTok-Platform Responsibility-Teen Experiences) - 2026 Start", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a8ce2d51d96e6541c8c3613?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-153", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Manager Intern (PGC) - 2027 Summer", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a8ce2d11d96e6541c8c3612?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-154", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vertiv", "title": "Product Management Intern (Summer 2027)", "location": "Delaware, OH, United States", "url": "https://jobright.ai/jobs/info/6a8cb5a225fc4e7ae3dba124?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-155", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "BNY", "title": "2027 BNY Summer Internship Program - Product Management (New York, NY)", "location": "New York, NY, United States", "url": "https://jobright.ai/jobs/info/6a8c77f6d34f700f87fd0b19?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-156", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Enercare Inc.", "title": "Associate Product Owner - Intern", "location": "Markham, ON, Canada", "url": "https://jobright.ai/jobs/info/6a8c71dd581f2d7bfdfe394e?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-157", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Solutions and Operations Project Intern (Scaled Growth, Paid Search) - 2026 Start", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a8c01c525fc4e7ae3db6b65?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-158", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Grainger", "title": "Brand, Online Experience and Assortment Intern Job Details / Grainger Businesses", "location": "Lake Forest, IL, United States", "url": "https://jobright.ai/jobs/info/6a8bcbfee8b6601d1290ca61?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-159", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Goldman Sachs", "title": "2027 / Americas / Dallas Metro Area / AWM Management, Product Management / Summer Analyst", "location": "Dallas, TX, United States", "url": "https://jobright.ai/jobs/info/6a85dbfecc81eb647e9efbed?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-160", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Amazon", "title": "Product Manager Technical (PMT) Intern - Summer 2027", "location": "Seattle, WA, United States", "url": "https://jobright.ai/jobs/info/6a87975925fc4e7ae3daddd7?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-161", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Littelfuse", "title": "Product Management Intern, Industrial Circuit Protection", "location": "Chicago, IL, United States", "url": "https://jobright.ai/jobs/info/6a5773df21f64463ad359380?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-162", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Springs Window Fashions", "title": "Product Management Competitive Product Assessment Intern - summer 2027", "location": "Middleton, WI, United States", "url": "https://jobright.ai/jobs/info/6a89b3c5e8b6601d1290a1a6?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-163", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Springs Window Fashions", "title": "Product Management Dashboard Analytic Internship - Summer 2027", "location": "Middleton, WI, United States", "url": "https://jobright.ai/jobs/info/6a89b3c2cde3717f9e9b88f2?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-164", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Springs Window Fashions", "title": "Product Management Internship - Summer 2027", "location": "Long Island City, NY, United States", "url": "https://jobright.ai/jobs/info/6a89b3c625fc4e7ae3db3d68?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-165", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Relay", "title": "Product & Strategy Intern (Summer 2027 Opportunity)", "location": "Raleigh, NC, United States", "url": "https://jobright.ai/jobs/info/6a6ce98357120971bf3ade41?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-166", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Jacques Marie Mage", "title": "Product Development Intern", "location": "Los Angeles, CA, United States", "url": "https://jobright.ai/jobs/info/6a6d1e5eacb0a61f9dbc9094?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-167", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "TikTok", "title": "Product Manager Intern (Content and Service Ads) - 2027 Summer (MBA)", "location": "San Jose, CA, United States", "url": "https://jobright.ai/jobs/info/6a88ee484afae74a0834e21a?utm_campaign=1047&utm_source=git", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-168", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vertiv", "title": "Product Management Intern 🛂", "location": "Westerville, OH", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-169", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Vertiv", "title": "Product Management Intern, MBA 🛂", "location": "Delaware, OH", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-170", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "American Express", "title": "Product Management Intern, Global Merchant & Network Services 🛂", "location": "Phoenix, AZ", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-171", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Microsoft", "title": "Product Manager Intern", "location": "Remote", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-172", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "American Express", "title": "Product Management Intern 🛂", "location": "New York, NY", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-173", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "Appian", "title": "Product Manager Intern 🛂", "location": "McLean, VA", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-174", "region": "NA", "tags": [], "notes": "", "referralContact": ""}, {"company": "ABC News", "title": "Product Management and Engineering Intern", "location": "New York, NY", "url": "", "type": "Product Manager", "jobType": "intern", "posted": "2026-08-28", "source": "fetch", "h1b": "unknown", "stage": "saved", "appliedDate": "", "id": "seed-175", "region": "NA", "tags": [], "notes": "", "referralContact": ""}];
  const [jobs,setJobs]=useState(INITIAL_JOBS);
  const [lang,setLang]=useState("zh");
  const [view,setView]=useState("dashboard");
  const [filter,setFilter]=useState({type:"all",search:"",window:"24h",h1bOnly:false,jobType:"all",region:"all",stage:"all",loc:"all"});
  const [showAdd,setShowAdd]=useState(false);
  const [editJob,setEditJob]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [loaded,setLoaded]=useState(false);
  const [refreshing,setRefreshing]=useState(false);
  const [refreshMsg,setRefreshMsg]=useState("");
  const [showHelp,setShowHelp]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const [resetArm,setResetArm]=useState(false);
  const [showChannels,setShowChannels]=useState(false);
  const t=I18N[lang];

  useEffect(()=>{(async()=>{
    try{
      const r=await window.storage.get("op2-data");
      if(r?.value){
        const stored=JSON.parse(r.value);
        if(stored.length>0){
          const cleaned=stored.filter(j=>j.h1b!=="no-intl"&&j.h1b!=="staffing").map((j)=>j.id?j:{...j,id:uid("mig")});
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
    // 搜索: 作为一个普通条件参与叠加(不再绕过其他筛选); 但会关闭时间窗以便全库查档
    if(filter.search){const s=filter.search.toLowerCase();
      if(!(j.title.toLowerCase().includes(s)||j.company.toLowerCase().includes(s)||(j.location||"").toLowerCase().includes(s)))return false;}
    if(filter.type!=="all"&&j.type!==filter.type)return false;
    if(j.jobType==="intern"&&seasonBlocked(j.title,"intern"))return false;
    if(filter.jobType!=="all"&&(j.jobType||"fulltime")!==filter.jobType)return false;
    if(filter.h1bOnly&&j.h1b!=="likely")return false;
    if(filter.region!=="all"&&(j.region||"NA")!==filter.region)return false;
    if(filter.stage!=="all"&&j.stage!==filter.stage)return false;
    if(filter.loc!=="all"&&!(j.location||"").toLowerCase().includes(filter.loc.toLowerCase()))return false;
    // 时间窗只隐藏"抓取来的、仍在saved且未被手动碰过"的旧岗位, 防止刷屏;
    // 手动添加(manual)或用户改过stage的岗位永不因时间窗消失
    const age=Math.floor((new Date()-new Date(j.posted))/864e5);
    const isFetched=(j.source!=="manual")&&!j.appliedDate;
    if(!filter.search && filter.stage==="all" && j.stage==="saved" && isFetched && age>WINDOW_DAYS[filter.window])return false;
    return true;
  }).sort((a,b)=>{const ma=isMajor(a.company)?0:1,mb=isMajor(b.company)?0:1;if(ma!==mb)return ma-mb;return b.posted.localeCompare(a.posted);});

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

  const moveJob=(id,ns)=>setJobs(p=>p.map(j=>(j.id&&j.id===id)?{...j,stage:ns,appliedDate:(ns!=="saved"&&!j.appliedDate)?new Date().toISOString().split("T")[0]:j.appliedDate}:j));

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
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="26" height="26" viewBox="0 0 130 130" style={{ flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="opGlow" cx="0.5" cy="0.45" r="0.55">
                  <stop offset="0" stopColor="#FFF6E6"/><stop offset="1" stopColor="#EAF1F7"/>
                </radialGradient>
                <linearGradient id="opBody" x1="0.3" y1="1" x2="0.6" y2="0">
                  <stop offset="0" stopColor="#EE7A3E"/><stop offset="1" stopColor="#F9AE6E"/>
                </linearGradient>
              </defs>
              <circle cx="65" cy="65" r="58" fill="url(#opGlow)"/>
              <g stroke="#FBC97F" strokeWidth="3" strokeLinecap="round" opacity="0.55">
                <line x1="65" y1="18" x2="65" y2="30"/><line x1="95" y1="35" x2="88" y2="43"/>
                <line x1="35" y1="35" x2="42" y2="43"/><line x1="100" y1="65" x2="90" y2="65"/><line x1="30" y1="65" x2="40" y2="65"/>
              </g>
              <path d="M28 92 Q65 84 102 92" stroke="#7BA1C7" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.5"/>
              <path d="M58 92 Q48 74 54 56 Q60 40 74 42 Q68 50 66 60 Q76 58 80 52 Q80 74 70 84 Q64 90 58 92 Z" fill="url(#opBody)"/>
              <path d="M58 92 Q46 96 40 104 Q50 100 56 96 Q52 102 52 108 Q60 100 58 92 Z" fill="#F9AE6E" opacity="0.9"/>
              <circle cx="68" cy="52" r="5" fill="#fff"/><circle cx="69" cy="53" r="2.8" fill="#2A3340"/><circle cx="70" cy="51.5" r="1.1" fill="#fff"/>
              <circle cx="62" cy="58" r="4" fill="#FF9A6A" opacity="0.35"/>
            </svg>
            <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.02em", color: "#5A5A6E" }}>
              Offer<span style={{ fontWeight: 300 }}>Pilot</span>
            </div>
          </div>
          {/* Nav */}
          <div style={{ display: "flex", gap: 4, marginLeft: 20 }}>
            {[{id:"dashboard",l:t.dashboard},{id:"jobs",l:t.jobs},{id:"pipeline",l:t.pipeline},{id:"lab",l:t.lab},{id:"interview",l:t.interview}].map(n => (
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
                  const keys = ["op2-data","op2-lang","op2-resumes","op2-active-resume","op2-portfolio","op2-reports","op2-interview","op2-apikey-excluded-intentionally"].filter(k=>!k.includes("excluded"));
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
                <div style={{ height: 1, background: "rgba(0,0,0,0.06)", margin: "4px 8px" }} />
                <button onClick={async () => {
                  if (!resetArm) { setResetArm(true); setTimeout(() => setResetArm(false), 3000); return; }
                  setShowMenu(false); setResetArm(false);
                  try {
                    const seeded = INITIAL_JOBS.map((j, i) => ({ ...j, id: j.id || ("seed-" + i) }));
                    await window.storage.set("op2-data", JSON.stringify(seeded));
                  } catch {}
                  location.reload();
                }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", border: "none", background: resetArm ? "rgba(224,122,122,0.15)" : "none", borderRadius: 10, fontSize: 12.5, color: resetArm ? "#B05A5A" : "#A05A6A", cursor: "pointer", textAlign: "left", fontWeight: resetArm ? 700 : 400 }}
                  onMouseEnter={e => { if(!resetArm) e.currentTarget.style.background = "rgba(0,0,0,0.04)"; }} onMouseLeave={e => { if(!resetArm) e.currentTarget.style.background = "none"; }}>
                  {resetArm ? ("⚠️ " + t.resetSure) : ("↺ " + t.resetJobs)}
                </button>
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
        {view === "jobs" && (<>
          <div style={{ marginBottom: 14 }}>
            <button onClick={() => setShowChannels(s => !s)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 14, fontSize: 12.5, fontWeight: 600, color: "#5A5A6E", cursor: "pointer", backdropFilter: "blur(8px)" }}>
              🚄 {t.channels} <span style={{ fontSize: 10, color: "#9A9AAA" }}>{t.channelsSub}</span> <span style={{ marginLeft: 4 }}>{showChannels ? "▾" : "▸"}</span>
            </button>
            {showChannels && <div style={{ marginTop: 12 }}><Channels t={t} lang={lang} /></div>}
          </div>
          <JobBoard jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} requestDelete={setConfirmDel} setEditJob={setEditJob} t={t} />
        </>)}
        {view === "pipeline" && <PipelineView jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} setEditJob={setEditJob} t={t} />}
        {view === "lab" && <ResumeLab t={t} lang={lang} />}
        {view === "interview" && <InterviewHub t={t} lang={lang} />}
      </div>

      {showHelp && <HelpModal lang={lang} onClose={() => setShowHelp(false)} />}
      {showAdd && <JobModal t={t} onSave={j => { setJobs(p => [{ ...j, id: uid("job") }, ...p]); setShowAdd(false); }} onClose={() => setShowAdd(false)} />}
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



// ===== v0.4a 面试中心 =====
const Q_TYPES = ["screening","behavioral","product","analytical","company","reverse"];
const STORY_STATUS = { none: "⚪", draft: "🟡", polished: "🟢" };

async function reviewStory(bullet, story, lang) {
  const zh = lang === "zh";
  const prompt = `You are a rigorous interview-story coach. The candidate wants to tell this resume bullet as a spoken behavioral-interview story.

BULLET: ${bullet.slice(0, 300)}
THEIR STORY DRAFT:
${story.slice(0, 3000)}

Review against these HARD RULES:
1. STAR completeness — Situation set? Task (their ownership boundary) clear? Actions use "I" not "we" for their own moves? Result quantified?
2. Anti-rambling — S+T must be ≤25% of the story (~15-20 seconds spoken). Flag any context bloat. ONE main point per story (judgment? collaboration? resilience?) — if it tries to prove 3 things, say which ONE to keep and what to cut.
3. Spoken length — estimate seconds when spoken aloud (~140 words/min English, ~240 chars/min Chinese). Over 90s = too long, provide a cut.
4. NEVER invent facts. If a detail is missing (a number, an outcome), ASK for it — max 2 questions.

Reply ONLY with JSON (analysis in ${zh ? "Simplified Chinese" : "English"}, rewrite in the story's language):
{"verdict":"<one-line overall>","seconds":<int>,"star":{"s":"ok|weak|missing","t":"ok|weak|missing","a":"ok|weak|missing","r":"ok|weak|missing"},"mainPoint":"<the ONE point this story proves>","issues":["<up to 4, most damaging first>"],"cuts":["<up to 3 things to delete>"],"polished":"<tightened version, ≤90s spoken, keep all real facts>","ask":["<up to 2 questions for missing facts>"],"tags":["<up to 3 competency tags e.g. leadership, conflict, data-driven>"]}`;
  if (!getApiKey()) throw new Error("NO_KEY");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers: apiHeaders(),
    body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1400, messages: [{ role: "user", content: prompt }] }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || "API error");
  const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function InterviewHub({ t, lang }) {
  const [resumes, setResumes] = useState([]);
  const [tab, setTab] = useState("stories");
  const [entries, setEntries] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [cards, setCards] = useState({ intro: "", visa: "", salary: "", whyus: "" });
  const [loaded, setLoaded] = useState(false);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [qForm, setQForm] = useState({ type: "behavioral", text: "", company: "" });
  const [manual, setManual] = useState({ bullet: "", company: "" });
  const [showImport, setShowImport] = useState(false);
  const [confirmDel, setConfirmDelId] = useState(null); // 两击删除确认
  const [picked, setPicked] = useState({});

  useEffect(() => { (async () => {
    try { const r = await window.storage.get("op2-interview"); if (r?.value) { const d = JSON.parse(r.value);
      const st = (d.stories || []).map((s, i) => ({ id: s.id || uid("s"), bullet: s.bullet, company: s.company || "", draft: s.draft || "", review: s.review || null, status: s.status || "none", updated: s.updated || "" }));
      setEntries(st); setQuestions(d.questions || []); setCards(d.cards || { intro: "", visa: "", salary: "", whyus: "" }); } } catch {}
    try { const rr = await window.storage.get("op2-resumes"); if (rr?.value) setResumes(JSON.parse(rr.value)); } catch {}
    setLoaded(true);
  })(); }, []);
  useEffect(() => { if (!loaded) return; window.storage.set("op2-interview", JSON.stringify({ stories: entries, questions, cards })).catch(() => {}); }, [entries, questions, cards, loaded]);

  // 从简历解析bullet并识别所属公司(经历段落标题格式: Title | Company | ...)
  const parsed = [];
  resumes.forEach(r => {
    let company = "";
    r.content.split("\n").forEach(line => {
      const h = line.match(/^#{2,4}\s+(.+)$/);
      if (h) { const parts = h[1].split("|").map(x => x.trim()); company = parts.length >= 2 ? parts[1] : parts[0]; return; }
      const b = line.match(/^[-•●]\s*(.+)$/);
      if (b && b[1].trim().length > 30) parsed.push({ company: company || r.name, text: b[1].trim(), resume: r.name });
    });
  });
  // 去重(同一bullet可能在多份简历重复)
  const seen = new Set();
  const importable = parsed.filter(p => { const k = p.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });

  const entry = entries.find(e => e.id === editId);
  const upd = (patch) => setEntries(p => p.map(e => e.id === editId ? { ...e, ...patch } : e));

  const runReview = async () => {
    if (!entry || !entry.draft.trim() || busy) return;
    setBusy(true);
    try {
      const rep = await reviewStory(entry.bullet, entry.draft, lang);
      upd({ review: rep, status: entry.status === "polished" ? "polished" : "draft", updated: new Date().toISOString().split("T")[0] });
    } catch (e) { upd({ review: { verdict: e.message === "NO_KEY" ? t.keyTitle : t.analyzeFail, issues: [] } }); }
    setBusy(false);
  };

  const groups = {};
  entries.forEach(e => { const k = e.company || t.ivNoCompany; (groups[k] = groups[k] || []).push(e); });

  const TabBtn = ({ id, label }) => (
    <button onClick={() => { setTab(id); setEditId(null); }} style={{ padding: "8px 18px", borderRadius: 999, border: "none", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      background: tab === id ? "rgba(255,255,255,0.85)" : "transparent", color: tab === id ? "#2C2C3A" : "#9A9AAA",
      boxShadow: tab === id ? "0 2px 8px rgba(0,0,0,0.06)" : "none" }}>{label}</button>
  );
  const btnStyle = (danger) => ({ padding: "5px 14px", borderRadius: 999, border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer", flexShrink: 0,
    background: danger ? "rgba(224,122,122,0.12)" : "rgba(123,161,199,0.15)", color: danger ? "#B05A5A" : "#5A7EA0" });

  return (
    <div>
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.35)", borderRadius: 999, padding: 4, width: "fit-content", marginBottom: 16 }}>
        <TabBtn id="stories" label={"📖 " + t.ivStories} />
        <TabBtn id="bank" label={"🗃 " + t.ivBank} />
        <TabBtn id="cards" label={"🎴 " + t.ivCards} />
      </div>

      {/* ===== 故事工坊: 列表 ===== */}
      {tab === "stories" && !editId && (
        <div>
          <Glass style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.ivStoriesTitle}</div>
            <div style={{ fontSize: 11.5, color: "#9A9AAA", marginBottom: 12, lineHeight: 1.6 }}>{t.ivStoriesHint2}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
              <textarea value={manual.bullet} onChange={e => setManual(m => ({ ...m, bullet: e.target.value }))} placeholder={t.ivCustomPh} rows={2}
                style={{ flex: "1 1 300px", padding: "10px 16px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
              <input value={manual.company} onChange={e => setManual(m => ({ ...m, company: e.target.value }))} placeholder={t.ivCompany}
                style={{ width: 130, padding: "10px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)" }} />
              <button onClick={() => { const b = manual.bullet.trim(); if (b) { setEntries(p => [...p, { id: uid("e"), bullet: b, company: manual.company.trim(), draft: "", review: null, status: "none", updated: "" }]); setManual({ bullet: "", company: "" }); } }}
                style={{ padding: "10px 22px", background: "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ {t.ivCustomAdd}</button>
              {importable.length > 0 && (
                <button onClick={() => { setShowImport(s => !s); setPicked({}); }} style={{ padding: "10px 18px", background: "rgba(255,255,255,0.6)", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#5A5A6E" }}>
                  📥 {t.ivImport} {showImport ? "▾" : "▸"}
                </button>
              )}
            </div>
          </Glass>

          {/* 导入选择面板 */}
          {showImport && (
            <Glass style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>{t.ivImportPick}</div>
              {[...new Set(importable.map(p => p.company))].map(co => (
                <div key={co} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#7A6EA4", marginBottom: 4 }}>{co}</div>
                  {importable.filter(p => p.company === co).map((p, i) => {
                    const already = entries.some(e => e.bullet === p.text);
                    return (
                      <label key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", cursor: already ? "default" : "pointer", opacity: already ? 0.45 : 1 }}>
                        <input type="checkbox" disabled={already} checked={!!picked[p.text]} onChange={e => setPicked(pk => ({ ...pk, [p.text]: e.target.checked }))} style={{ marginTop: 2 }} />
                        <span style={{ fontSize: 11.5, lineHeight: 1.5 }}>{p.text.slice(0, 110)}{p.text.length > 110 ? "…" : ""}{already && " ✓" }</span>
                      </label>
                    );
                  })}
                </div>
              ))}
              <button onClick={() => {
                const sel = importable.filter(p => picked[p.text]);
                if (sel.length) setEntries(prev => [...prev, ...sel.map((p, i) => ({ id: uid("i"), bullet: p.text, company: p.company, draft: "", review: null, status: "none", updated: "" }))]);
                setShowImport(false); setPicked({});
              }} style={{ padding: "9px 22px", background: "rgba(123,175,139,0.85)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {t.ivImportBtn} ({Object.values(picked).filter(Boolean).length})
              </button>
            </Glass>
          )}

          {/* 按公司分组的条目列表 */}
          {entries.length === 0 && !showImport && <Glass><div style={{ fontSize: 12, color: "#9A9AAA", textAlign: "center", padding: 20 }}>{t.ivEmptyList}</div></Glass>}
          {Object.entries(groups).map(([co, list]) => (
            <Glass key={co} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: "#7A6EA4", marginBottom: 6 }}>{co} <span style={{ color: "#B0B0BA", fontWeight: 400 }}>({list.length})</span></div>
              {list.map(e => (
                <div key={e.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "9px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: 14, flexShrink: 0 }}>{STORY_STATUS[e.status === "polished" ? "polished" : e.draft ? "draft" : "none"]}</span>
                  <div onClick={() => setEditId(e.id)} style={{ flex: 1, minWidth: 0, cursor: "pointer" }}>
                    <div style={{ fontSize: 12, lineHeight: 1.5 }}>{e.bullet.slice(0, 110)}{e.bullet.length > 110 ? "…" : ""}</div>
                    {e.review?.tags && <div style={{ fontSize: 10.5, color: "#B0B0BA", marginTop: 2 }}>{e.review.tags.join(" / ")}</div>}
                  </div>
                  <button onClick={() => setEditId(e.id)} style={btnStyle(false)}>{t.edit}</button>
                  <button onClick={() => { if (confirmDel === e.id) { setEntries(p => p.filter(x => x.id !== e.id)); setConfirmDelId(null); } else { setConfirmDelId(e.id); setTimeout(() => setConfirmDelId(cur => cur === e.id ? null : cur), 2500); } }}
                    style={{ ...btnStyle(true), background: confirmDel === e.id ? "rgba(224,122,122,0.85)" : "rgba(224,122,122,0.12)", color: confirmDel === e.id ? "#fff" : "#B05A5A" }}>
                    {confirmDel === e.id ? t.delSure : t.del}</button>
                </div>
              ))}
            </Glass>
          ))}
        </div>
      )}

      {/* ===== 故事编辑页 ===== */}
      {tab === "stories" && entry && (
        <div>
          <button onClick={() => setEditId(null)} style={{ background: "none", border: "none", color: "#7A6EA4", fontSize: 12, cursor: "pointer", marginBottom: 10, padding: 0 }}>← {t.back}</button>
          <Glass style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 4 }}>BULLET</div>
                <textarea value={entry.bullet} onChange={e => upd({ bullet: e.target.value })} rows={2}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12.5, lineHeight: 1.6, outline: "none", resize: "vertical", fontFamily: "inherit", background: "rgba(123,161,199,0.06)", boxSizing: "border-box" }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 4 }}>{t.ivCompany}</div>
                <input value={entry.company} onChange={e => upd({ company: e.target.value })}
                  style={{ width: 130, padding: "10px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)" }} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 6 }}>{t.ivDraftLabel}</div>
            <textarea value={entry.draft} onChange={e => upd({ draft: e.target.value })} placeholder={t.ivDraftPh}
              style={{ width: "100%", minHeight: 180, padding: 14, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, fontSize: 12.5, lineHeight: 1.7, outline: "none", resize: "vertical", fontFamily: "inherit", background: "rgba(255,255,255,0.6)", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "center" }}>
              <button onClick={runReview} disabled={busy} style={{ padding: "10px 24px", background: busy ? "rgba(0,0,0,0.08)" : "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: busy ? "wait" : "pointer" }}>
                {busy ? t.ivReviewing : "✨ " + t.ivReview}
              </button>
              <button onClick={() => upd({ status: entry.status === "polished" ? "draft" : "polished" })}
                style={{ padding: "10px 20px", background: "rgba(123,175,139,0.15)", color: "#4A8A5A", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                {entry.status === "polished" ? "🟡 " + t.ivMarkDraft : "🟢 " + t.ivMarkDone}
              </button>
              <button onClick={() => { if (confirmDel === editId) { setEntries(p => p.filter(x => x.id !== editId)); setConfirmDelId(null); setEditId(null); } else { setConfirmDelId(editId); setTimeout(() => setConfirmDelId(cur => cur === editId ? null : cur), 2500); } }}
                style={{ ...btnStyle(true), background: confirmDel === editId ? "rgba(224,122,122,0.85)" : "rgba(224,122,122,0.12)", color: confirmDel === editId ? "#fff" : "#B05A5A" }}>
                {confirmDel === editId ? t.delSure : t.del}</button>
            </div>
          </Glass>
          {entry.review && (
            <Glass>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>{entry.review.verdict}</div>
              {entry.review.star && (
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {["s","t","a","r"].map(k => (
                    <span key={k} style={{ fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999,
                      background: entry.review.star[k] === "ok" ? "rgba(123,175,139,0.15)" : entry.review.star[k] === "weak" ? "rgba(201,168,108,0.18)" : "rgba(224,122,122,0.15)",
                      color: entry.review.star[k] === "ok" ? "#4A8A5A" : entry.review.star[k] === "weak" ? "#9A7A3A" : "#B05A5A" }}>
                      {k.toUpperCase()} {entry.review.star[k] === "ok" ? "✓" : entry.review.star[k] === "weak" ? "△" : "✗"}
                    </span>
                  ))}
                  {entry.review.seconds && <span style={{ fontSize: 11, padding: "4px 12px", borderRadius: 999, background: entry.review.seconds > 90 ? "rgba(224,122,122,0.15)" : "rgba(0,0,0,0.05)", color: entry.review.seconds > 90 ? "#B05A5A" : "#5A5A6E", fontWeight: 700 }}>⏱ ~{entry.review.seconds}s</span>}
                </div>
              )}
              {entry.review.mainPoint && <div style={{ fontSize: 12, marginBottom: 10 }}><b>{t.ivMainPoint}:</b> {entry.review.mainPoint}</div>}
              {entry.review.issues?.length > 0 && <div style={{ marginBottom: 10 }}>{entry.review.issues.map((x, i) => <div key={i} style={{ fontSize: 12, color: "#8A5A5A", lineHeight: 1.7 }}>· {x}</div>)}</div>}
              {entry.review.cuts?.length > 0 && <div style={{ marginBottom: 10, padding: "10px 14px", background: "rgba(224,122,122,0.06)", borderRadius: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#B05A5A", marginBottom: 4 }}>✂️ {t.ivCuts}</div>{entry.review.cuts.map((x, i) => <div key={i} style={{ fontSize: 11.5, color: "#7A5A5A", lineHeight: 1.6 }}>· {x}</div>)}</div>}
              {entry.review.polished && <div style={{ padding: "12px 16px", background: "rgba(123,175,139,0.08)", borderRadius: 12, marginBottom: 10 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#4A8A5A", marginBottom: 6 }}>✨ {t.ivPolished}</div><div style={{ fontSize: 12.5, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{entry.review.polished}</div></div>}
              {entry.review.ask?.length > 0 && <div style={{ padding: "10px 14px", background: "rgba(107,159,212,0.08)", borderRadius: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: "#4A7AA8", marginBottom: 4 }}>💬 {t.aiAsks}</div>{entry.review.ask.map((x, i) => <div key={i} style={{ fontSize: 12, color: "#4A5A7E", lineHeight: 1.6 }}>· {x}</div>)}</div>}
            </Glass>
          )}
        </div>
      )}

      {/* ===== 题库 ===== */}
      {tab === "bank" && (
        <div>
          <Glass style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.ivAddQ}</div>
            <div style={{ fontSize: 11, color: "#9A9AAA", marginBottom: 10, lineHeight: 1.6 }}>{t.ivBankFlow}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <select value={qForm.type} onChange={e => setQForm(f => ({ ...f, type: e.target.value }))}
                style={{ padding: "8px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)" }}>
                {Q_TYPES.map(q => <option key={q} value={q}>{t.qTypes[q]}</option>)}
              </select>
              <input value={qForm.company} onChange={e => setQForm(f => ({ ...f, company: e.target.value }))} placeholder={t.ivQCompany}
                style={{ padding: "8px 14px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 999, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", width: 140 }} />
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <textarea value={qForm.text} onChange={e => setQForm(f => ({ ...f, text: e.target.value }))} placeholder={t.ivQPh} rows={2}
                style={{ flex: 1, padding: "10px 16px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit", resize: "vertical" }} />
              <button onClick={() => {
                const lines = qForm.text.split("\n").map(x => x.trim()).filter(Boolean);
                if (!lines.length) return;
                setQuestions(p => [...lines.map((ln, i) => ({ type: qForm.type, company: qForm.company, text: ln, id: uid("q"), added: new Date().toISOString().split("T")[0] })), ...p]);
                setQForm(f => ({ ...f, text: "" }));
              }} style={{ padding: "10px 22px", background: "linear-gradient(135deg, #9B8EC4, #7BA1C7)", color: "#fff", border: "none", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+</button>
            </div>
          </Glass>
          {Q_TYPES.map(qt => {
            const qs = questions.filter(q => q.type === qt);
            if (!qs.length) return null;
            return (
              <Glass key={qt} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>{t.qTypes[qt]} <span style={{ color: "#B0B0BA", fontWeight: 400 }}>({qs.length})</span></div>
                {qs.map(q => (
                  <div key={q.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                    <div style={{ flex: 1, fontSize: 12, lineHeight: 1.6 }}>{q.text}{q.company && <span style={{ fontSize: 10, color: "#8AA0B8", marginLeft: 8 }}>@{q.company}</span>}</div>
                    <button onClick={() => setQuestions(p => p.filter(x => x.id !== q.id))} style={btnStyle(true)}>{t.del}</button>
                  </div>
                ))}
              </Glass>
            );
          })}
          {questions.length === 0 && <div style={{ fontSize: 12, color: "#9A9AAA", textAlign: "center", padding: 30 }}>{t.ivBankEmpty}</div>}
        </div>
      )}

      {/* ===== 答案卡 ===== */}
      {tab === "cards" && (
        <Glass>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.ivCardsTitle}</div>
          <div style={{ fontSize: 11.5, color: "#9A9AAA", marginBottom: 14, lineHeight: 1.6 }}>{t.ivCardsHint}</div>
          {[["intro", t.cardIntro], ["whyus", t.cardWhyUs], ["visa", t.cardVisa], ["salary", t.cardSalary]].map(([k, label]) => (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 5 }}>{label}</div>
              <textarea value={cards[k]} onChange={e => setCards(p => ({ ...p, [k]: e.target.value }))}
                style={{ width: "100%", minHeight: 70, padding: 12, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, fontSize: 12, lineHeight: 1.7, outline: "none", resize: "vertical", fontFamily: "inherit", background: "rgba(255,255,255,0.6)", boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ fontSize: 10.5, color: "#B0B0BA" }}>{t.ivAutoSave}</div>
        </Glass>
      )}
    </div>
  );
}

// ===== 使用指南 =====
const HELP = {
  zh: [
    ["🔍 搜索框（查档模式）", "输入任意连续字符即可匹配公司名、职位名或地点（如输入 veev 找 Veeva）。搜索时自动忽略所有筛选器和时间窗口，在全部数据中查找——包括你已投递、已拒的历史岗位。想确认某公司投过没有：直接搜名字，看阶段列。"],
    ["📥 岗位页", "每天自动从8个开源仓库抓取新岗位（打开网站自动刷新，1小时冷却）。默认显示24小时内新发；筛选器：时间窗口 / 全职·实习 / 🌱只看H1B友好 / 五类岗位标签。已过滤：Senior岗、TPM、仅限美国公民、猎头、超出资格窗口的实习。"],
    ["📌 今日必投", "概览页顶部，按赛道胜率自动为近48小时新岗打分排序（Ops/PjM > Growth/CRM > AI > 其他），叠加本地、H1B、新发加分。点击条目直接编辑，↗ 直达申请页。"],
    ["🗂 看板", "八阶段管道：收藏→已投递→求内推→获内推→已笔试→面试中→Offer / 已拒。地区筛选（北美/中国）在筛选栏下拉框。拖不了卡片时用岗位行的下拉框改阶段。手动添加的岗位（右下角+）与抓取岗位完全同权：一样计入统计、漏斗和趋势图。"],
    ["🤖 简历工坊", "上传简历（.md/.txt）→ 贴JD（公司职位自动识别）→ 🎯帮我选简历 → 生成报告：匹配分、ATS关键词、persona解码、带保护规则的bullet改写、AI反问。不满意就在报告下方对话微调；改完简历用同一JD重测看分数变化。需要自己的 Anthropic API Key（只存本机浏览器）。"],
    ["🎤 面试中心", "三件套：故事工坊——从简历自动提取bullet，为每条打磨一个≤90秒的STAR故事（AI审重点聚焦和时长，绝不编造）；题库——按六种题型归档（筛选/行为/产品/数据/公司面经/反问）；答案卡——筛选轮四道必考题的定稿话术。深度复盘和模拟面试在Claude对话里进行。"],
    ["🚄 直通车", "位于岗位页顶部的折叠区（🚄按钮展开）：大厂官方校招入口合集——Amazon/Google 这类只发自家官网的岗位走这里+LinkedIn alert，不经过抓取管道。"],
    ["💾 数据与隐私", "所有数据（简历、看板、报告、Key）只存在你自己浏览器的 localStorage，不上传任何服务器。⤓ 导出JSON备份（不含Key），⤒ 导入恢复。换电脑/清缓存前记得先导出。"],
  ],
  en: [
    ["🔍 Search (lookup mode)", "Type any contiguous characters to match company, title, or location (e.g. 'veev' finds Veeva). Search bypasses all filters and time windows — it looks through your entire library including applied and rejected jobs. To check if you've applied somewhere: search the name, read the stage column."],
    ["📥 Jobs", "Auto-fetches daily from 8 open-source repos (on page load, 1h cooldown). Defaults to last 24h; filters: time window / full-time·intern / 🌱H1B-friendly / five role tags. Pre-filtered out: senior roles, TPM, citizens-only, staffing agencies, out-of-window internships."],
    ["📌 Today's Picks", "Top of Overview — scores jobs from the last 48h by your lane strategy (Ops/PjM > Growth/CRM > AI > others) plus local, H1B, and freshness bonuses. Click to edit; ↗ opens the application page."],
    ["🗂 Pipeline", "Eight stages: saved → applied → referral asked → secured → written test → interview → offer / rejected. Region filter (NA/China) in the filter bar. Change stages via the dropdown on each row. Manually added jobs (+ button) are first-class: counted in all stats, funnels, and trends."],
    ["🤖 Resume Lab", "Upload resumes (.md/.txt) → paste a JD (company/title auto-detected) → 🎯 pick resume for me → get a report: match score, ATS keywords, persona decode, guarded bullet rewrites, elicitation questions. Refine via chat below the report; re-test after editing. Requires your own Anthropic API key (stored in your browser only)."],
    ["🎤 Interview Hub", "Three tools: Story Studio — bullets auto-extracted from your resumes, each polished into a ≤90s STAR story (AI reviews focus and length, never invents); Question Bank — six question types (screening/behavioral/product/analytical/company/reverse); Answer Cards — scripted answers for the four standard recruiter-screen questions."],
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
        <select value={filter.region} onChange={e => setFilter(f => ({ ...f, region: e.target.value }))}
          style={{ padding: "8px 14px", borderRadius: 999, border: "1px solid rgba(255,255,255,0.5)", background: "rgba(255,255,255,0.45)", fontSize: 12, outline: "none", color: "#5A5A6E", cursor: "pointer", backdropFilter: "blur(8px)" }}>
          <option value="all">🌍 {t.regionAll}</option>
          <option value="NA">{t.regionNA}</option>
          <option value="CN">{t.regionCN}</option>
        </select>
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
              {[
                { h: t.jobCol },
                { h: t.company },
                { h: t.location, key: "loc", opts: LOC_PRESETS.map(l => ({ v: l.v, n: l.n })), allLabel: t.allLocations },
                { h: t.typeCol },
                { h: t.postedCol },
                { h: t.stageCol, key: "stage", opts: STAGES.map(s => ({ v: s.id, n: t.stages[s.id] })), allLabel: t.allStages },
              ].map((col, i) => {
                const active = col.key && filter[col.key] !== "all";
                return (
                  <th key={i} style={{ padding: "14px 20px", textAlign: "left", fontSize: 10.5, fontWeight: 500, color: active ? "#7A6EA4" : "#9A9AAA", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid rgba(0,0,0,0.05)", whiteSpace: "nowrap" }}>
                    {col.key ? (
                      <span style={{ position: "relative", display: "inline-block" }}>
                        <select value={filter[col.key]} onChange={e => setFilter(f => ({ ...f, [col.key]: e.target.value }))}
                          style={{ appearance: "none", WebkitAppearance: "none", border: "none", background: active ? "rgba(155,142,196,0.18)" : "transparent", borderRadius: 8, padding: active ? "3px 20px 3px 8px" : "3px 20px 3px 2px", fontSize: 10.5, fontWeight: active ? 700 : 500, color: "inherit", textTransform: "uppercase", letterSpacing: "0.06em", cursor: "pointer", outline: "none", fontFamily: "inherit" }}>
                          <option value="all">{col.h}</option>
                          {col.opts.map(o => <option key={o.v} value={o.v}>{o.n}</option>)}
                        </select>
                        <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", fontSize: 8, pointerEvents: "none", color: active ? "#7A6EA4" : "#B0B0BA" }}>▾</span>
                      </span>
                    ) : col.h}
                  </th>
                );
              })}
            </tr></thead>
            <tbody>
              {jobs.map(j => {
                const s = STAGES.find(x => x.id === j.stage);
                return (
                  <tr key={j.id} onClick={() => setEditJob(j)} style={{ cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.03)", transition: "background 0.15s", background: isMajor(j.company) ? "rgba(123,161,199,0.09)" : "transparent" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.35)"} onMouseLeave={e => e.currentTarget.style.background = isMajor(j.company) ? "rgba(123,161,199,0.09)" : "transparent"}>
                    <td style={{ padding: "14px 20px", maxWidth: 300 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{j.title}</div>
                      {j.tags.length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 4 }}>{j.tags.slice(0, 2).map(tag => <span key={tag} style={{ fontSize: 10, background: "rgba(0,0,0,0.04)", color: "#8A8A9A", padding: "2px 8px", borderRadius: 999 }}>{tag}</span>)}</div>}
                    </td>
                    <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 500 }}><div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>{isMajor(j.company) && <span title="Major company">🏢</span>}{j.company} <H1BBadge tag={j.h1b} t={t} /></div></td>
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

function scanVisa(jd) {
  const t = (jd || "").toLowerCase();
  // 不支持赞助的信号(红)
  const noSponsor = [
    "will not sponsor", "not sponsor", "no sponsorship", "without sponsorship",
    "not able to sponsor", "unable to sponsor", "does not sponsor", "do not sponsor",
    "not provide sponsorship", "no visa sponsorship", "cannot sponsor",
    "us citizens only", "u.s. citizens only", "must be a us citizen", "citizenship is required",
    "requires us work authorization", "must be authorized to work in the united states",
    "not require sponsorship now or in the future", "now or in the future",
    "security clearance", "us person"
  ];
  // 明确支持(绿)
  const yesSponsor = ["will sponsor", "sponsorship available", "visa sponsorship is available", "we sponsor", "h-1b sponsorship", "open to sponsorship"];
  for (const p of noSponsor) if (t.includes(p)) return { level: "red", hit: p };
  for (const p of yesSponsor) if (t.includes(p)) return { level: "green", hit: p };
  return { level: "none" };
}

async function analyzeJD(resume, jd, company, title, lang, portfolio) {
  const zhOut = lang === "zh";
  const prompt = `You are a job-application strategist. Analyze resume-vs-JD fit.

INTERNAL PROCESS (silent): 1) Decode JD: hiring manager's real needs / HARD requirements (years, degrees, named skills/tools — disqualifiers if missing) vs SOFT requirements (traits, ways of working) / hidden signals / level. 2) Match 0-100 (60% hard-requirement coverage, 20% domain, 20% soft/nice-to-have). 3) ATS keywords: exact terms from the JD a recruiter would keyword-search — tools, methods, domain nouns. Compare against resume and split the ABSENT ones into TWO groups: (a) "add" = the candidate plausibly HAS this experience under a different name, so it can be honestly woven into an existing bullet — for each, name WHICH bullet it belongs in; (b) "cant" = domain/industry knowledge the candidate genuinely lacks (e.g. a specific hardware protocol, an industry they never worked in) — these MUST NOT be faked; say so plainly. Use the JD's exact spelling. Also estimate "reach": realistic match score after adding all "add" keywords (be honest — if the ceiling is still low, say so). 4) Scan JD for visa red flags (citizenship/clearance/no sponsorship/export control). 5) Predict interview questions. 6) Tailor bullets: ONLY rephrase facts already in THAT SAME bullet, never invent and never borrow facts from other bullets/jobs; missing numbers = [${zhOut ? "待确认" : "TBC"}]. Where natural, weave missing ATS keywords into the rewrites.

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
{"co":"<company name extracted from JD, or empty>","ti":"<job title extracted from JD, or empty>","match":<int>,"verdict":"<apply|caveat|skip. Use skip ONLY for hard blockers: explicit no-sponsorship, clearance/citizenship required, or a location/timing the candidate cannot meet. Low keyword overlap or missing domain knowledge is NEVER a reason to skip — use caveat. 1 short sentence>","level":"<NG-friendly? 5 words>","h1b":["<flag or empty>"],"kw":{"have":["<keyword>"],"add":[{"k":"<keyword>","where":"<which bullet/section it fits, 8 words>"}],"cant":["<keyword candidate genuinely lacks>"],"reach":<int: realistic score after adding all "add" keywords>},"persona":{"who":"<what they really want, max 20 words>","sig":["<hidden signal, max 10 words>"]},"must":[{"req":"<hard req, 8 words>","s":"hit|partial|miss","ev":"<8 words>"}],"soft":[{"req":"<soft req, 6 words>","s":"hit|partial|miss","ev":"<6 words>"}],"gaps":[{"g":"<8 words>","fix":"<10 words>"}],"bullets":[{"o":"<resume line, may truncate>","n":"<improved, keep brands+metrics+ownership verbs>","w":"<why: name the JD phrase this now matches AND why this employer cares, 18 words>"}]${portfolio ? ',"folio":{"lead":"<project to lead with + why, 15 words>","align":"<alignment, 12 words>","gap":"<missing piece, 10 words>"}' : ""},"q":["<question>"],"ask":["<question to candidate, ${zhOut ? "Simplified Chinese" : "English"}>"],"assume":["<assumption>"]}
Hard limits: kw.have=5, kw.add=5, kw.cant=4, must=4, soft=3, gaps=2, bullets=3, q=3, ask=2, assume=1, persona.sig=2. Keyword entries are single words or 2-3 word phrases.`;

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
  const [delConfirm, setDelConfirm] = useState(null);
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
        id: uid("job"), company: finalCo, title: finalTi,
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
            <input type={showKey ? "text" : "password"} placeholder="sk-ant-..." onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && saveKey(e.target.value)}
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
              <button onClick={e => { e.stopPropagation(); if (delConfirm === r.id) { deleteResume(r.id); setDelConfirm(null); } else { setDelConfirm(r.id); setTimeout(() => setDelConfirm(cur => cur === r.id ? null : cur), 2500); } }}
                style={{ padding: "4px 10px", border: "none", borderRadius: 999, fontSize: 10.5, cursor: "pointer", fontWeight: 600, background: delConfirm === r.id ? "rgba(196,90,106,0.9)" : "rgba(196,123,139,0.12)", color: delConfirm === r.id ? "#fff" : "#A05A6A" }}>{delConfirm === r.id ? t.delSure : t.delete}</button>
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
        <textarea value={input} onChange={e => setInput(e.target.value)} rows={2}
          onKeyDown={e => { if (e.key === "Enter" && (e.altKey || e.metaKey || e.ctrlKey) && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }}
          placeholder={t.refinePlaceholder}
          style={{ flex: 1, padding: "10px 16px", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 14, fontSize: 12, outline: "none", background: "rgba(255,255,255,0.6)", fontFamily: "inherit", resize: "vertical", lineHeight: 1.6 }} />
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
  const [addState, setAddState] = useState("idle"); // idle | confirm | added
  const addToJobs = async () => {
    if (addState === "idle") { setAddState("confirm"); setTimeout(() => setAddState(s => s === "confirm" ? "idle" : s), 3000); return; }
    if (addState !== "confirm") return;
    const today = new Date().toISOString().split("T")[0];
    let __ac = Date.now();
    const job = {
      id: "lab-" + __ac.toString(36),
      company: entry.company || "?", title: entry.title || "?",
      location: "", url: entry.url || "",
      type: "Product Manager", jobType: "fulltime",
      posted: entry.date || today, region: "NA", source: "manual",
      h1b: "unknown", stage: "applied", appliedDate: today,
      tags: [], notes: "Added from Resume Lab · match " + (r.match || 0) + "%", referralContact: "",
    };
    try {
      const cur = await window.storage.get("op2-data");
      const list = cur?.value ? JSON.parse(cur.value) : [];
      // 去重: 同公司+同职位已存在则不重复加
      const key = (job.company + "::" + job.title).toLowerCase();
      const exists = list.some(j => ((j.company||"") + "::" + (j.title||"")).toLowerCase() === key);
      if (!exists) { list.unshift(job); await window.storage.set("op2-data", JSON.stringify(list)); }
      setAddState("added");
    } catch { setAddState("added"); }
  };
  return (
    <Glass>
      {/* 签证扫描横幅(确定性, 扫JD原文) */}
      {(() => {
        const v = scanVisa(entry.jd);
        if (v.level === "red") return (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 16px", background: "rgba(224,122,122,0.12)", border: "1px solid rgba(224,122,122,0.3)", borderRadius: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
            <div><div style={{ fontSize: 12.5, fontWeight: 700, color: "#B05A5A", marginBottom: 2 }}>{t.visaRedTitle}</div>
            <div style={{ fontSize: 11.5, color: "#8A5A5A", lineHeight: 1.5 }}>{t.visaRedBody} <span style={{ fontFamily: "monospace", background: "rgba(224,122,122,0.15)", padding: "1px 6px", borderRadius: 6 }}>"{v.hit}"</span></div></div>
          </div>
        );
        if (v.level === "green") return (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: "rgba(123,175,139,0.12)", borderRadius: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 14 }}>✓</span>
            <div style={{ fontSize: 12, color: "#4A8A5A", fontWeight: 600 }}>{t.visaGreen}</div>
          </div>
        );
        return null;
      })()}
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
            <button onClick={addToJobs} disabled={addState === "added"} style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, border: "none", cursor: addState === "added" ? "default" : "pointer",
              background: addState === "added" ? "rgba(123,175,139,0.2)" : addState === "confirm" ? "rgba(155,142,196,0.9)" : "rgba(155,142,196,0.15)",
              color: addState === "added" ? "#4A8A5A" : addState === "confirm" ? "#fff" : "#7A6EA4" }}>
              {addState === "added" ? ("✓ " + t.addedToJobs) : addState === "confirm" ? t.addConfirm : ("➕ " + t.addToJobs)}
            </button>
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

      {/* ATS keywords - actionable split */}
      {r.kw && ((r.kw.add || []).length > 0 || (r.kw.cant || []).length > 0 || (r.kw.have || []).length > 0) && (
        <div style={{ background: "rgba(201,168,108,0.08)", borderRadius: 14, padding: "14px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#9A7A3A" }}>🔑 {t.atsKw}</div>
            {typeof r.kw.reach === "number" && (
              <div style={{ fontSize: 11, color: "#8A7A5A" }}>
                {t.kwReach}: <b style={{ color: "#9A7A3A" }}>{r.match}% → {r.kw.reach}%</b>
              </div>
            )}
          </div>
          {(r.kw.add || []).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#A04A5A", fontWeight: 700, marginBottom: 6 }}>✍️ {t.kwAdd}</div>
              {r.kw.add.map((k, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "4px 0", borderBottom: i < r.kw.add.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 11px", borderRadius: 999, background: "rgba(196,123,139,0.15)", color: "#A04A5A", whiteSpace: "nowrap", flexShrink: 0 }}>{typeof k === "string" ? k : k.k}</span>
                  {typeof k === "object" && k.where && <span style={{ fontSize: 11, color: "#8A7A5A", lineHeight: 1.5 }}>→ {k.where}</span>}
                </div>
              ))}
            </div>
          )}
          {(r.kw.cant || []).length > 0 && (
            <div style={{ marginBottom: 10, padding: "8px 12px", background: "rgba(0,0,0,0.03)", borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: "#8A8A9A", fontWeight: 700, marginBottom: 5 }}>🚫 {t.kwCant}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 4 }}>
                {r.kw.cant.map((k, i) => <span key={i} style={{ fontSize: 11, padding: "3px 11px", borderRadius: 999, background: "rgba(0,0,0,0.05)", color: "#8A8A9A", textDecoration: "line-through" }}>{k}</span>)}
              </div>
              <div style={{ fontSize: 10.5, color: "#A0A0AA", lineHeight: 1.4 }}>{t.kwCantNote}</div>
            </div>
          )}
          {(r.kw.have || []).length > 0 && (
            <details>
              <summary style={{ fontSize: 11, color: "#4A8A5A", fontWeight: 600, cursor: "pointer", outline: "none" }}>{t.kwHave} ({r.kw.have.length})</summary>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginTop: 6 }}>
                {r.kw.have.map((k, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "3px 11px", borderRadius: 999, background: "rgba(123,175,139,0.15)", color: "#4A8A5A" }}>{k}</span>)}
              </div>
            </details>
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
  { cat: { zh: "🇨🇳 国内大厂校招", en: "🇨🇳 China Campus Recruiting" }, items: [
    { co: "字节跳动", url: "https://jobs.bytedance.com/campus", note: { zh: "2027届秋招", en: "ByteDance" }, h1b: false },
    { co: "腾讯", url: "https://join.qq.com", note: { zh: "校招", en: "Tencent" }, h1b: false },
    { co: "阿里巴巴", url: "https://talent.alibaba.com/campus", note: { zh: "校招", en: "Alibaba" }, h1b: false },
    { co: "美团", url: "https://campus.meituan.com", note: { zh: "校招", en: "Meituan" }, h1b: false },
    { co: "拼多多", url: "https://careers.pinduoduo.com", note: { zh: "校招", en: "PDD" }, h1b: false },
    { co: "小红书", url: "https://job.xiaohongshu.com", note: { zh: "校招", en: "Xiaohongshu" }, h1b: false },
    { co: "快手", url: "https://campus.kuaishou.cn", note: { zh: "校招", en: "Kuaishou" }, h1b: false },
    { co: "网易", url: "https://campus.163.com", note: { zh: "校招", en: "NetEase" }, h1b: false },
    { co: "百度", url: "https://talent.baidu.com", note: { zh: "校招", en: "Baidu" }, h1b: false },
    { co: "京东", url: "https://campus.jd.com", note: { zh: "校招", en: "JD" }, h1b: false },
    { co: "华为", url: "https://career.huawei.com", note: { zh: "校招", en: "Huawei" }, h1b: false },
    { co: "小米", url: "https://hr.xiaomi.com", note: { zh: "校招", en: "Xiaomi" }, h1b: false },
    { co: "滴滴", url: "https://talent.didiglobal.com", note: { zh: "校招", en: "DiDi" }, h1b: false },
    { co: "携程", url: "https://careers.trip.com", note: { zh: "校招", en: "Trip.com" }, h1b: false },
    { co: "B站", url: "https://jobs.bilibili.com", note: { zh: "校招", en: "Bilibili" }, h1b: false },
    { co: "大疆", url: "https://we.dji.com", note: { zh: "校招·硬件", en: "DJI" }, h1b: false },
    { co: "SHEIN", url: "https://careers.shein.com", note: { zh: "校招", en: "SHEIN" }, h1b: false },
    { co: "蚂蚁集团", url: "https://talent.antgroup.com", note: { zh: "校招", en: "Ant Group" }, h1b: false },
  ]},
  { cat: { zh: "🇨🇳 国内求职聚合平台", en: "🇨🇳 China Job Aggregators" }, items: [
    { co: "牛客网", url: "https://www.nowcoder.com", note: { zh: "笔试题+面经+内推码", en: "Tests & interviews" }, h1b: false },
    { co: "实习僧", url: "https://www.shixiseng.com", note: { zh: "实习为主", en: "Internships" }, h1b: false },
    { co: "应届生求职网", url: "https://www.yingjiesheng.com", note: { zh: "校招汇总", en: "NG roundup" }, h1b: false },
    { co: "超级简历校招", url: "https://www.wondercv.com", note: { zh: "投递工具", en: "Apply tool" }, h1b: false },
  ]},
  { cat: { zh: "PM 项目 (APM/RPM)", en: "PM Programs (APM/RPM)" }, items: [
    { co: "Google APM", url: "https://www.google.com/about/careers/applications/programs/apm", note: { zh: "9月底开放", en: "Opens late Sep" }, h1b: true },
    { co: "Meta RPM", url: "https://www.metacareers.com/rotational-programs", note: { zh: "18个月轮岗", en: "18-mo rotational" }, h1b: true },
    { co: "Uber APM", url: "https://www.uber.com/us/en/careers/teams/university/", note: { zh: "", en: "" }, h1b: true },
    { co: "Intuit RPM", url: "https://www.intuit.com/careers", note: { zh: "轮岗PM项目", en: "Rotational PM" }, h1b: true },
    { co: "LinkedIn APM", url: "https://careers.linkedin.com", note: { zh: "APM项目", en: "APM program" }, h1b: true },
    { co: "Yahoo APM", url: "https://www.yahooinc.com/careers", note: { zh: "APM项目", en: "APM program" }, h1b: true },
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
  { cat: { zh: "⭐ 西雅图本地", en: "⭐ Seattle Local" }, items: [
    { co: "Expedia", url: "https://careers.expediagroup.com", note: { zh: "旅行科技", en: "Travel tech" }, h1b: true },
    { co: "Zillow", url: "https://www.zillow.com/careers", note: { zh: "房产科技", en: "Real estate" }, h1b: true },
    { co: "T-Mobile", url: "https://www.t-mobile.com/careers", note: { zh: "电信", en: "Telecom" }, h1b: true },
    { co: "Smartsheet", url: "https://www.smartsheet.com/careers", note: { zh: "协作SaaS", en: "Work mgmt" }, h1b: true },
    { co: "Remitly", url: "https://www.remitly.com/careers", note: { zh: "跨境汇款", en: "Fintech" }, h1b: true },
    { co: "Redfin", url: "https://www.redfin.com/careers", note: { zh: "房产", en: "Real estate" }, h1b: false },
    { co: "Axon", url: "https://www.axon.com/careers", note: { zh: "公共安全硬件", en: "Public safety" }, h1b: true },
    { co: "Starbucks", url: "https://careers.starbucks.com", note: { zh: "数字化团队", en: "Digital team" }, h1b: false },
    { co: "PitchBook", url: "https://pitchbook.com/careers", note: { zh: "金融数据", en: "Fin data" }, h1b: true },
  ]},
  { cat: { zh: "企业 SaaS / 云", en: "Enterprise SaaS" }, items: [
    { co: "ServiceNow", url: "https://careers.servicenow.com", note: { zh: "", en: "" }, h1b: true },
    { co: "Workday", url: "https://www.workday.com/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Atlassian", url: "https://www.atlassian.com/company/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Datadog", url: "https://www.datadoghq.com/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Snowflake", url: "https://careers.snowflake.com", note: { zh: "", en: "" }, h1b: true },
    { co: "HubSpot", url: "https://www.hubspot.com/careers", note: { zh: "", en: "" }, h1b: false },
    { co: "Okta", url: "https://www.okta.com/company/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "MongoDB", url: "https://www.mongodb.com/careers", note: { zh: "", en: "" }, h1b: true },
  ]},
  { cat: { zh: "AI 公司", en: "AI Companies" }, items: [
    { co: "OpenAI", url: "https://openai.com/careers", note: { zh: "产品岗稀少手快", en: "Rare, fast" }, h1b: true },
    { co: "Anthropic", url: "https://www.anthropic.com/careers", note: { zh: "你的模型供应商", en: "Your model vendor" }, h1b: true },
    { co: "Perplexity", url: "https://www.perplexity.ai/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Scale AI", url: "https://scale.com/careers", note: { zh: "", en: "" }, h1b: true },
  ]},
  { cat: { zh: "消费 & 金融科技", en: "Consumer & Fintech" }, items: [
    { co: "DoorDash", url: "https://careers.doordash.com", note: { zh: "", en: "" }, h1b: true },
    { co: "Instacart", url: "https://instacart.careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Duolingo", url: "https://careers.duolingo.com", note: { zh: "APM项目", en: "APM program" }, h1b: true },
    { co: "Robinhood", url: "https://robinhood.com/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Coinbase", url: "https://www.coinbase.com/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "Pinterest", url: "https://www.pinterestcareers.com", note: { zh: "", en: "" }, h1b: true },
    { co: "Snap", url: "https://careers.snap.com", note: { zh: "", en: "" }, h1b: true },
    { co: "Visa", url: "https://usa.visa.com/careers", note: { zh: "", en: "" }, h1b: true },
    { co: "PayPal", url: "https://careers.pypl.com", note: { zh: "", en: "" }, h1b: true },
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
  const [form, setForm] = useState(job || { title: "", company: "", location: "", type: "Product Manager", posted: new Date().toISOString().split("T")[0], source: "manual", url: "", stage: "saved", notes: "", referralContact: "", tags: [], region: "NA", appliedDate: "", addedDate: new Date().toISOString().split("T")[0] });
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
          <Field label={t.fRegion}><select style={iStyle} value={form.region || "NA"} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}><option value="NA">{t.regionNA}</option><option value="CN">{t.regionCN}</option></select></Field>
          <Field label={t.fPosted}><input type="date" style={iStyle} value={form.posted} onChange={e => setForm(f => ({ ...f, posted: e.target.value }))} /></Field>
          <Field label={t.fApplied}><input type="date" style={iStyle} value={form.appliedDate || ""} onChange={e => setForm(f => ({ ...f, appliedDate: e.target.value }))} /></Field>
          <Field label={t.stage}><select style={iStyle} value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>{STAGES.map(s => <option key={s.id} value={s.id}>{t.stages[s.id]}</option>)}</select></Field>
        </div>
        {!isEdit && <Field label={t.link}><input style={iStyle} value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://..." /></Field>}
        <Field label={t.referralContact}><input style={iStyle} value={form.referralContact} onChange={e => setForm(f => ({ ...f, referralContact: e.target.value }))} placeholder="Mike · Designer @ Airbnb" /></Field>
        <Field label={t.tags}>
          <div style={{ display: "flex", gap: 6 }}>
            <input style={{ ...iStyle, flex: 1 }} value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.nativeEvent.isComposing && addTag()} placeholder={t.tagPlaceholder} />
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
