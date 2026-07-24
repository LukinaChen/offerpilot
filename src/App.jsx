import { useState, useEffect, useMemo } from "react";
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
    stages: { saved: "收藏", applied: "已投递", referral_asked: "求内推", referral_got: "获内推", interview: "面试中", offer: "Offer" },
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
    stages: { saved: "Saved", applied: "Applied", referral_asked: "Asked", referral_got: "Secured", interview: "Interview", offer: "Offer" },
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
];

const GH = [
  { name: "jobright-PM", url: "https://raw.githubusercontent.com/jobright-ai/2026-Product-Management-New-Grad/master/README.md", defaultType: "Product Manager", jobType: "fulltime" },
  { name: "jobright-Design", url: "https://raw.githubusercontent.com/jobright-ai/2026-Design-New-Grad/master/README.md", defaultType: "Product Designer", jobType: "fulltime" },
  { name: "jobright-Engineering", url: "https://raw.githubusercontent.com/jobright-ai/2026-Engineering-New-Grad/master/README.md", defaultType: "Hardware", jobType: "fulltime" },
  { name: "jobright-Marketing", url: "https://raw.githubusercontent.com/jobright-ai/2026-Marketing-New-Grad/master/README.md", defaultType: "Product Ops", jobType: "fulltime" },
  { name: "jobright-PM-Intern", url: "https://raw.githubusercontent.com/jobright-ai/2026-Product-Management-Internship/master/README.md", defaultType: "Product Manager", jobType: "intern" },
  { name: "jobright-Design-Intern", url: "https://raw.githubusercontent.com/jobright-ai/2026-Design-Internship/master/README.md", defaultType: "Product Designer", jobType: "intern" },
];
const ITAR=["spacex","blue origin","lockheed","northrop","raytheon","rtx","boeing defense","anduril","l3harris","general dynamics","bae systems","general atomics","leidos","palantir usg"];
const SPONSORS=["google","meta","microsoft","amazon","apple","nvidia","intel","amd","qualcomm","broadcom","cisco","oracle","salesforce","adobe","uber","lyft","airbnb","doordash","stripe","paypal","intuit","servicenow","workday","snowflake","databricks","tiktok","bytedance","linkedin","pinterest","snap","roblox","netflix","tesla","rivian","capital one","jpmorgan","goldman","morgan stanley","bloomberg","visa","mastercard","walmart","ford","micron","texas instruments","analog devices","samsung","ibm","dell","atlassian","figma","openai","anthropic","expedia","zillow","redfin","carrier","honeywell","medtronic","veeva"];
const STAFFING=/(staffing|recruiting|recruitment|insight global|teksystems|robert half|aerotek|randstad|kforce|cybercoders|jobot|motion recruitment|infosys|wipro|cognizant|hcl |capgemini)/i;
function h1bTag(co){const c=co.toLowerCase();if(ITAR.some(x=>c.includes(x)))return"no-intl";if(STAFFING.test(c))return"staffing";if(SPONSORS.some(x=>c.includes(x)))return"likely";return"unknown";}
function classify(ti,fb){const t=ti.toLowerCase();
if(/(hardware (design )?engineer|electrical (design )?engineer|pcb|circuit design|embedded hardware)/.test(t))return"Hardware";
if(/(product design|ux design|ui design|ux\/ui|ui\/ux|ux researcher|interaction design|experience design|digital (product )?design|visual design)/.test(t))return"Product Designer";
if(/(project manager|program manager|project coordinator|project management|program management|scrum)/.test(t))return"Project Management";
if(/(product operations|product ops|marketing operations|growth (manager|specialist|associate|analyst)|crm|lifecycle|retention (specialist|manager|associate)|engagement (specialist|manager)|product marketing|go-to-market|gtm )/.test(t))return"Product Ops";
if(/(product manager|product management|apm\b|associate product|rotational product)/.test(t))return"Product Manager";
return fb;}
function relevant(ti,srcType){const t=ti.toLowerCase();
if(/(senior|staff|principal|lead |director|vp |head of|sr\.? )/.test(t)&&!/associate/.test(t))return false;
if(/(apprentice|assembler|technician|electrician|journeyman)/.test(t))return false;
if(/(technical program manager|engineering program manager|tpm\b)/.test(t))return false;
if(/(industrial design|apparel|footwear|fashion|graphic design|interior design|jewelry|mechanical design|textile|landscape|architectural)/.test(t))return false;
if(srcType==="Hardware")return/(hardware (design )?engineer|electrical (design )?engineer|pcb|circuit design|embedded hardware|electronics engineer)/.test(t);
if(srcType==="Product Ops"){
if(/(sales representative|account executive|content (writer|creator)|copywriter|social media|seo |paid (media|search)|brand ambassador|influencer|event)/.test(t))return false;
return/(product operations|product ops|marketing operations|growth (manager|specialist|associate|analyst)|crm|lifecycle|retention|engagement|operations (associate|specialist|analyst)|product marketing|go-to-market|gtm )/.test(t);}
return/(product manager|product management|product designer|product design|ux design|ui design|ux designer|ui designer|ux\/ui|ui\/ux|ux researcher|interaction design|experience design|digital design|visual design|apm\b|associate product|program manager|project manager|project coordinator|product operations)/.test(t);}
function parseMD(md,src){const jobs=[],mo={Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12"};let last="",inT=false;for(const line of md.split("\n")){if(line.includes("| Company |")||line.includes("| ----")){inT=true;continue;}if(!inT||!line.startsWith("|"))continue;const cells=line.split("|").map(c=>c.trim()).filter(Boolean);if(cells.length<4)continue;const lr=/\[([^\]]+)\]\(([^)]+)\)/,cm=cells[0].match(lr),tm=cells[1].match(lr);let co=cm?cm[1]:cells[0].replace(/\*/g,"").trim();const ti=tm?tm[1]:cells[1].replace(/\*/g,"").trim(),url=tm?tm[2]:"";if(!ti||ti==="Job Title")continue;if(co==="↳"||co.includes("↳"))co=last;else last=co;if(!relevant(ti,src.defaultType))continue;
    const _h1b=h1bTag(co);if(_h1b==="no-intl"||_h1b==="staffing")continue;
    const jobType=src.jobType==="intern"||/(intern|internship|co-op|coop)\b/i.test(ti)?"intern":"fulltime";const p=cells[cells.length-1],dm=p.match(/([A-Z][a-z]{2})\s+(\d{1,2})/),yr=new Date().getFullYear();const ds=dm?`${yr}-${mo[dm[1]]||"01"}-${dm[2].padStart(2,"0")}`:new Date().toISOString().split("T")[0];jobs.push({id:`${co}::${ti}::${cells[2]}`.toLowerCase(),title:ti,company:co,location:cells[2]||"",type:classify(ti,src.defaultType),posted:ds,source:src.name,url,h1b:_h1b,jobType,stage:"saved",notes:"",referralContact:"",tags:[cells.length>=5?cells[3]:""].filter(Boolean)});}return jobs;}
async function fetchLive(){const rs=await Promise.allSettled(GH.map(async s=>{const r=await fetch(s.url);if(!r.ok)throw new Error();return parseMD(await r.text(),s);}));let all=[],errs=[];rs.forEach((r,i)=>{if(r.status==="fulfilled")all=all.concat(r.value);else errs.push(GH[i].name);});const seen=new Set();return{jobs:all.filter(j=>{if(seen.has(j.id))return false;seen.add(j.id);return true;}).sort((a,b)=>b.posted.localeCompare(a.posted)),errors:errs};}
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
  const INITIAL_JOBS = [{"title":"Associate Product Manager","company":"CDK Global","location":"Portland, OR, USA, US","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a1f3d8209442629a6858b96?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j0"},{"title":"Associate Product Manager","company":"CDK Global","location":"Portland, OR, USA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a53af768576ec69c0150973?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j1"},{"title":"Data Product Manager","company":"FanDuel","location":"New York, NY, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a51d0c302522b5b722ebf7b?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j2"},{"title":"Associate Product Manager","company":"Clerkie","location":"United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a42ec626a9c2774b3fa7d9f?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j3"},{"title":"Product Manager","company":"Worldwide Equipment, Inc.","location":"Knoxville, TN, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a60ce6dc752926c2268232e?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j4"},{"title":"Associate Product Line Manager II HybridLife & Kids","company":"KEEN","location":"Portland, OR, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a3dc23dd261407de9801ca7?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j5"},{"title":"Product Manager","company":"Workday","location":"USA, OH, Mason, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4618034f64ba41dcb4fd12?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j6"},{"title":"Associate Product Manager, MIS","company":"Aesculap (US)","location":"Bethlehem, PA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a60b2d12a30b85637874eb7?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j7"},{"title":"Product Manager","company":"Lumin Digital","location":"United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4e1218fc327f422fef1ca6?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j8"},{"title":"Associate Product Manager","company":"Ideal Tridon Group","location":"Smyrna, TN, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-22","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4032b31afc66714d3c9c3e?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j9"},{"title":"Interaction Designer, Google Maps","company":"Google","location":"New York, NY, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a55d8532ce8bf79a13a1d28?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j10"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Warrenville, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a610779ab9bd4676324982f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j11"},{"title":"Electrical Engineer I","company":"NEI Electric Power Engineering, Inc.","location":"Lakewood, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e639c397d8d353c288ab8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j12"},{"title":"Early Career Electrical Engineer - Power Systems","company":"Aspen Technology","location":"Medina, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e896f397d8d353c2895c6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j13"},{"title":"Electrical Engineer","company":"Constellation","location":"Marseilles, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55a9c03caa2642da419359?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j14"},{"title":"Electrical Engineer, Robotics Hardware","company":"FieldAI","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5dba52c8e3a473cb8b5577?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j15"},{"title":"ASICS Electronics Engineer","company":"Mission Technologies, a division of HII","location":"MD - Adelphi - Powder Mill Rd","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2a22ecd3ec8317fe141deb?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j16"},{"title":"ASICS Electronics Engineer Job Details / HII's Mission Technologies division","company":"Mission Technologies, a division of HII","location":"Adelphi, MD, Maryland, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a28c2d1fd37e62bb47aafbf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j17"},{"title":"ASICS Electronics Engineer","company":"Mission Technologies, a division of HII","location":"Adelphi, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5631e8efb06a45240d43e7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j18"},{"title":"Assistant Substation Engineer, Electrical Engineer - Transmission & Distribution (Akron or Columbus)","company":"Burns & McDonnell","location":"Akron, OH, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a287af41dbd8437bebcb809?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j19"},{"title":"Electrical Engineer","company":"Monolyth Technologies","location":"San Diego, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a60c8bf193c4d692385f6dc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j20"},{"title":"BAS Hardware Design Engineer ","company":"BCM Controls Corporation","location":"Woburn, MA (BCM HQ)","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69da073f9f97a42dc9c2755b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j21"},{"title":"Power Electronics/Electrical Engineer (Junior to Mid-Level, 0-10 Yrs Experience) - $80K","company":"RCT Systems","location":"Baltimore, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a487057971cd25b06f94360?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j22"},{"title":"Electrical Engineer","company":"Icarus","location":"Los Angeles, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4454a3b156014e414bc3ee?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j23"},{"title":"Hardware Engineer 1","company":"Dexcom","location":"San Diego, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f996b193b511309679642?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j24"},{"title":"Electrical Engineer I","company":"TRC Companies, Inc.","location":"Liverpool, New York, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a574d21e9b77f668bd67775?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j25"},{"title":"Electrical Engineer I - ASIC/FPGA (Onsite)","company":"Collins Aerospace","location":"Cedar Rapids, IA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a608bb4a4b66100689cb85a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j26"},{"title":"Electrical Engineering Associate I","company":"RS&H","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2864d57061b51a3a5f575e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j27"},{"title":"Avionics and Electrical Engineering Fall Co-op","company":"True Anomaly","location":"Denver, CO, United States","type":"Hardware","jobType":"intern","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a606aed2a30b85637873fc5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j28"},{"title":"Electrical Engineer","company":"MacKay","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51bd7f8d7d3e6cf1cc2163?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j29"},{"title":"Marketing and Growth Associate","company":"Arona Home Essentials","location":"Fort Dodge, IA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a60ed167196365a6f0089e6?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j30"},{"title":"Marketing Operations Assistant","company":"American Enterprise Institute","location":"Washington, DC, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a444248ef17a815538a38e8?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j31"},{"title":"Marketing Operations Coordinator","company":"Barnes & Noble Education, Inc.","location":"Florham Park, NJ, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-22","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a441f340153061b8b3df4bf?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j32"},{"title":"AI-Native Product Management Intern (Marketplace & Growth)","company":"Trucker Path","location":"Phoenix, AZ, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-22","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a5f6cc1b0f20036bc630df0?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j33"},{"title":"AI-Native Product Management Intern (Marketplace & Growth)","company":"Trucker Path","location":"Phoenix,AZ,US","type":"Product Manager","jobType":"intern","posted":"2026-07-22","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a2d54e8f1751b183c81ac15?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j34"},{"title":"Product Management Intern (Fall 2026)","company":"OneEthos","location":"United States","type":"Product Manager","jobType":"intern","posted":"2026-07-22","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a5a05883ac7627fe9001d02?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j35"},{"title":"Graduate product manager","company":"Bending Spoons","location":"London, England, United Kingdom","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a6092ae129b652e9cd29228?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j36"},{"title":"Math Competition Product Manager","company":"Think Academy U.S","location":"San Jose, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a3df9f4882f121f56a393d0?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j37"},{"title":"Associate Product Manager","company":"Relo Metrics","location":"Phoenix, AZ, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4ffea64649561ec08afc68?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j38"},{"title":"Product Operations Associate","company":"Prizeout","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a34195dce501060b5cef519?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j39"},{"title":"Product Operations Leader","company":"Indigo","location":"Ottawa, ON, Canada","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a57ab40e9b77f668bd69769?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j40"},{"title":"Associate Product Manager","company":"Publicis Sapient","location":"Westminster, CO, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4eb47e0ea38951a6ff4362?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j41"},{"title":"Associate Product Manager - Power & Energy Downstream Marketing (Onsite)","company":"Medtronic","location":"Lafayette, CO, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5fc6aeb0f20036bc63309b?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j42"},{"title":"TikTok Shop - Product Operations Manager, Brand Operation GTM","company":"TikTok","location":"Seattle","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a36df6f29c90c607e4e5aba?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j43"},{"title":"Product Management & Investor Relations – Real Assets, Analyst","company":"Blue Owl Capital","location":"New York City, NY, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a3c2997982bb239f812e9cd?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j44"},{"title":"Clinical Product Manager","company":"Science&Humans","location":"Mississauga, Ontario, Canada","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5f84b8b0f20036bc63158b?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j45"},{"title":"Product Manager","company":"Sauna by Wordware","location":"San Francisco","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a1ab613e24ef3652582cb22?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j46"},{"title":"Product Operations Associate","company":"Daisy","location":"NY, New York, US","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a2ef7dfa1d15e3c5530037c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j47"},{"title":"Product Operations Associate","company":"Daisy","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a53c5a38a74e077472f986d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j48"},{"title":"Associate Product Manager","company":"Publicis Groupe ANZ","location":"Westminster, CO, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a4eb04e397d8d353c289f7d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j49"},{"title":"Product Manager","company":"Alarm.com","location":"Tysons, VA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a457397c2d11a6a4666939d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j50"},{"title":"Product Operations Specialist (Remote)","company":"FMG","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5e8107270e3033b045e37c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j51"},{"title":"Product Designer","company":"Bridgepoint Group","location":"San Jose, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a603ebc129b652e9cd28259?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j52"},{"title":"Product Designer","company":"Bridgepoint Group","location":"Berkeley, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a603eb9a4b66100689ca993?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j53"},{"title":"Product Designer","company":"Bridgepoint Group","location":"Oakland, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a603eb82a30b8563787361b?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j54"},{"title":"Product Designer","company":"Bridgepoint Group","location":"San Francisco, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a603eb8129b652e9cd28258?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j55"},{"title":"Ui/Ux Designer","company":"Innovativity","location":"Utica–Rome metropolitan area, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5fa1fa8c7fd835513ba036?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j56"},{"title":"Electrical Engineer-in -Training","company":"IAMGOLD Corporation","location":"Gogama, ON, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5339078a74e077472f7b6a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j57"},{"title":"Electrical Engineer I-III, Systems","company":"True Anomaly","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a561ac1f7517b519ad53c77?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j58"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Long Beach, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3d79d04d047136e0933c75?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j59"},{"title":"Electrical Engineer 1","company":"Pillar Innovations","location":"Grantsville, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5265df8ef95364ead8e288?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j60"},{"title":"Electrical Engineer","company":"Haider Engineering Pc","location":"New York City, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a60289d8c7fd835513bceb8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j61"},{"title":"Electrical Engineer","company":"AECOM","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fe74b8c7fd835513bbdc5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j62"},{"title":"Entry Level Electrical Engineer","company":"Dewberry","location":"New York, NY, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a493557971cd25b06f95071?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j63"},{"title":"Electrical Engineer","company":"Applied Engineering, Inc.","location":"Beulah, ND, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a509e0ed5d2a327b664c1ce?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j64"},{"title":"Associate Electrical Design Engineer","company":"PACCAR","location":"Kirkland, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5342b78a74e077472f7d4b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j65"},{"title":"Electrical Design Engineer","company":"CMTA, Inc.","location":"Renton, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fdeb5193b51130967b50a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j66"},{"title":"Electrical Engineer I","company":"Quantum Space","location":"Rockville, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a521415e726ec56126a16e4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j67"},{"title":"Early Professional, Electrical Engineering","company":"WSP in the U.S.","location":"1001 Fourth Avenue, Seattle, WA, 98154, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5cbd32686b4755d1e1c51f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j68"},{"title":"Early Professional, Electrical Engineering","company":"WSP in the U.S.","location":"9452 51 Ave NW, Edmonton, AB, T6E 5A6, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3367e8649fdf16292f1f28?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j69"},{"title":"Early Career Substation Electrical Engineer","company":"WSP in the U.S.","location":"5675 Ruffin Rd, San Diego, CA, 92123, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5af44f686b4755d1e17bf5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j70"},{"title":"Early Career Substation Electrical Engineer","company":"WSP in the U.S.","location":"12755 Olive Boulevard, Saint Louis, MO, 63141, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a1957b6fee8f34024353b3e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j71"},{"title":"Electrical Engineering Graduate Designer / Denver, CO","company":"IMEG","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a545bad8576ec69c0152e3e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j72"},{"title":"Early Professional, Electrical Engineering","company":"WSP","location":"Syracuse, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fd0acb0f20036bc633310?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j73"},{"title":"Electrical Engineer (Engineer-In-Training)","company":"Woolpert","location":"Fairview Heights, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f969133ef5c58b4ffeb7a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j74"},{"title":"Entry Level Electrical Engineer","company":"Amentum","location":"US-MD-Lexington Park, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4e5ed6fc327f422fef26f7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j75"},{"title":"Entry Level Electrical Engineer","company":"Amentum","location":"Lexington Park, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69dd098af748bc5d08a5dc33?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j76"},{"title":"Electrical Engineer - Decatur, IL","company":"ADM","location":"United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fbb8ff68dd368023e8507?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j77"},{"title":"Entry Level Electrical Engineer (Hybrid) - Fort Wayne, IN","company":"Military Spouse Jobs","location":"Fort Wayne, IN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fbb5b6e0c3c7c7d3d8a68?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j78"},{"title":"Associate Hardware Engineer","company":"Schweitzer Engineering Laboratories (SEL)","location":"Washington - Pullman, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a53171ad007ee02d95fa36b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j79"},{"title":"Power Electronics Engineer (Entry Level - Mid Level $100K to $170K)","company":"VanSpeag Group","location":"Lapeer, MI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fb8996e0c3c7c7d3d8935?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j80"},{"title":"Electrical Engineer I","company":"Trane Technologies","location":"La Crosse, WI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5fb2ea33ef5c58b4fff7c8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j81"},{"title":"Electrical Engineer","company":"SSOE Group","location":"US-AZ-Scottsdale","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a08e3b1a203b1052e446ace?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j82"},{"title":"Entry Level Electrical Engineer - Boston, MA","company":"PAE","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a50ea550524e919f4a9ad31?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j83"},{"title":"New Jersey Institute of Technology Co-op: Electrical Engineering/Electro-Optics","company":"SRI","location":"Princeton, NJ, United States","type":"Hardware","jobType":"intern","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a509d3e2e2ceb72963b3790?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j84"},{"title":"Assistant Electrical Engineer, Transmission & Distribution - Network, Integration & Automation (Denver)","company":"Burns & McDonnell","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69d478ea891d7b11cfcfaab4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j85"},{"title":"Digital Hardware Engineer","company":"Siemens Healthineers","location":"KNV I, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f590833ef5c58b4ffd94b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j86"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"St. Louis Park, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f674fb0f20036bc630bef?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j87"},{"title":"Electrical Engineering Analyst","company":"Kimley-Horn","location":"Saint Paul, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f6b2ab0f20036bc630d43?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j88"},{"title":"Electrical Engineer I","company":"Baxter International Inc.","location":"Round Lake, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e635027bf767ea68f657a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j89"},{"title":"Electrical Engineer 1 (Entry-Level) - Nuclear","company":"Sargent & Lundy","location":"Chattanooga, TN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a565e44efb06a45240d53f6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j90"},{"title":"FM Electrical Engineer","company":"Richmond and Wandsworth Councils","location":"Wandsworth, England, United Kingdom","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f99258c7fd835513b9c98?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j91"},{"title":"Electrical Engineer-in -Training- EN","company":"IAMGOLD Corporation","location":"Gogama, ON, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a165092a429fd279da976b3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j92"},{"title":"Digital Hardware Engineer","company":"Varian","location":"KNV I, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f5976193b5113096782cb?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j93"},{"title":"Electrical Engineering Internships/Co-ops - $22/hr – $30/hr","company":"RCT Systems","location":"Baltimore, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f559c33ef5c58b4ffd7a3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j94"},{"title":"Electrical Engineer, Junior","company":"KAIROS, Inc.","location":"Newport, RI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55ba73ef22935f2e3f645d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j95"},{"title":"Electrical Engineer","company":"Brindley Engineering Corporation","location":"Lisle, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a52f69fd007ee02d95f9b89?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j96"},{"title":"MEP Electrical Engineer","company":"SEH","location":"Denver, CO","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a42c5a9ff87fd527f9857c1?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j97"},{"title":"MEP Electrical Engineer","company":"SEH","location":"Denver CO, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a461c7e0dd56c76cc2f603b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j98"},{"title":"Electrical Engineer I (BOS) (R5046)","company":"Shield AI","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5d49f4686b4755d1e1d4dc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j99"},{"title":"Assistant Electrical Engineer - Water (Chicago)","company":"Burns & McDonnell","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f303e42a5e6366266150b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j100"},{"title":"Assistant Electrical Engineer, Power (Denver)","company":"Burns & McDonnell","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f303e43310d6259cecc3d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j101"},{"title":"Audience Operations Analyst","company":"OpenAP","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a50dc596a85fe03ca8561a7?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j102"},{"title":"Associate, Lifecycle Marketing","company":"Modern Animal","location":"Culver City, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5aded963a8f619507c8a79?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j103"},{"title":"Product Marketing Associate / Senior Product Marketing Associate","company":"Skillz","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a4e21751544d7246c0d1e65?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j104"},{"title":"Retention Marketing Assistant","company":"Macy's","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5f661633ef5c58b4ffdbd2?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j105"},{"title":"Growth Specialist","company":"Constellation","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a53a79ad007ee02d95fc1a6?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j106"},{"title":"Amazon Organic Growth Specialist","company":"F&F Stores Ltd","location":"Milton Keynes, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5f991b6e0c3c7c7d3d7b5a?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j107"},{"title":"Client Engagement Coordinator","company":"Sidley Austin LLP","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-21","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5f6cb86e0c3c7c7d3d6d99?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j108"},{"title":"Product Management - Intern","company":"ROCKWOOL Group","location":"Chicago, IL, United States of America","type":"Product Manager","jobType":"intern","posted":"2026-07-21","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a5fa2f28c7fd835513ba0e6?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j109"},{"title":"Product Management Intern (Fall 2026)","company":"Gemini","location":"New York, New York","type":"Product Manager","jobType":"intern","posted":"2026-07-21","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a50b9415165966a1161b4eb?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j110"},{"title":"McMullan Arts Leadership Internship, Experience Design, Visual Design","company":"Art Institute of Chicago","location":"Chicago, Illinois, United States","type":"Product Designer","jobType":"intern","posted":"2026-07-21","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a4bf740c2d11a6a46679730?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j111"},{"title":"UX / Product Design Intern (Co-op) – Fall 2026, (Healthcare SaaS) - Remote","company":"SecureRx Technologies Inc.","location":"Ontario, Canada","type":"Product Designer","jobType":"intern","posted":"2026-07-21","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a5fd2388c7fd835513bb3d7?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j112"},{"title":"UX/UI Design Internship (Paid)","company":"hangin.tv","location":"New York City metropolitan area, United States","type":"Product Designer","jobType":"intern","posted":"2026-07-21","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a5f8d1f6e0c3c7c7d3d7864?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j113"},{"title":"Associate Product Manager, Traffic Shaping","company":"Magnite","location":"Massachusetts - Boston, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-20","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5e60c1f3674a0545d28946?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j114"},{"title":"Asset & Wealth Management, Wealth Investment Solutions (WIS), Digital Product Manager, Analyst - New York","company":"Goldman Sachs","location":"New York, NY, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-20","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a427ce86faf756060966e40?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j115"},{"title":"Product Manager, Intern","company":"Tessera Labs","location":"San Jose Office (HQ)","type":"Product Manager","jobType":"intern","posted":"2026-07-20","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a265baa4239a43538883bb0?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j116"},{"title":"Product Designer Graduate (TikTok Design UX) - 2026 Start (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5ef654470d4126fdeac7ba?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j117"},{"title":"Product Designer (Temporary)","company":"HYBE AMERICA","location":"Santa Monica, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5ecc45f29acc1a1174987d?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j118"},{"title":"UX Designer, Global Operations UX","company":"Amazon","location":"Seattle, Washington, USA","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a21dbb5c00e701fe83714c8?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j119"},{"title":"Product Design Assistant","company":"Visual Comfort & Co.","location":"Houston, TX, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5e8f6e050c423c792f01fb?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j120"},{"title":"UX Designer - Baltimore City Department of Information Technology","company":"City of Baltimore","location":"401 E Fayette St, United States of America","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5e2fa4f3674a0545d2764b?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j121"},{"title":"Junior UI/UX Designer","company":"MadeMarket","location":"United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5ec5ee270e3033b045fbfc?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j122"},{"title":"Entry Level Electrical Design Engineer (Rose-Hulman 2026)","company":"DMC Engineering","location":"Chicago (Headquarters)","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a458f720dd56c76cc2f3c92?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j123"},{"title":"Robotics - Hardware Development Engineer Co-op - 2026 (Robotics, Mechanical, Electrical, Hardware Test, Reliability, Failure Analysis, Operations, and more)","company":"Amazon","location":"Boston, Massachusetts, USA","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a52f78c8ef95364ead90830?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j124"},{"title":"Robotics - Hardware Development Engineer Co-op - 2026 (Robotics, Mechanical, Electrical, Hardware Test, Reliability, Failure Analysis, Operations, and more)","company":"Amazon","location":"Westboro, Wisconsin, USA","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a29705c2cde2824469bc166?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j125"},{"title":"Robotics - Hardware Development Engineer Co-op - 2026 (Robotics, Mechanical, Electrical, Hardware Test, Reliability, Failure Analysis, Operations, and more)","company":"Amazon","location":"Westborough, Massachusetts, USA","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2970592cde2824469bc164?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j126"},{"title":"Robotics - Hardware Development Engineer Co-op - 2026 (Robotics, Mechanical, Electrical, Hardware Test, Reliability, Failure Analysis, Operations, and more)","company":"Amazon","location":"North Reading, Massachusetts, USA","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2970592cde2824469bc163?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j127"},{"title":"Robotics - Hardware Development Engineer Co-op - 2026 (Robotics, Mechanical, Electrical, Hardware Test, Reliability, Failure Analysis, Operations, and more)","company":"Amazon","location":"San Francisco, California, USA","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a29704e2cde2824469bc15a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j128"},{"title":"Electrical Engineer Associate","company":"SAIC","location":"Lakehurst, NJ, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2f2848d3ec94183f4c19b4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j129"},{"title":"Power/Electrical Engineer (EIT)","company":"Guidant Power","location":"Wichita, KS, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e80d5270e3033b045e368?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j130"},{"title":"Power/Electrical Engineer (EIT)","company":"Guidant Power","location":"United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e80d867b2850e77df1818?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j131"},{"title":"Electrical Engineer I,","company":"Baxter International Inc.","location":"Round Lake, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ecef6d32b0656b39f5f80?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j132"},{"title":"Hardware Development Engineer","company":"Amazon","location":"Pasadena, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51e2f978e364789ca5e615?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j133"},{"title":"Electrical Engineering Intern","company":"DH Engineering","location":"Grand Rapids, MI, United States","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5eb45ff29acc1a11749270?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j134"},{"title":"Entry Level Electrical Engineer","company":"Naval Nuclear Laboratory (FMP)","location":"Idaho Falls, ID, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ea4b3050c423c792f0970?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j135"},{"title":"Electrical Engineer I - Relocate to Warroad, MN","company":"Marvin","location":"Warroad, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e832927bf767ea68f7295?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j136"},{"title":"Entry Level Electrical Engineer – Class of 2025/2026","company":"Amphenol TCS","location":"Santa Clara, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e81e667b2850e77df18ad?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j137"},{"title":"Entry Level Electrical Engineer – Class of 2025/2026","company":"Amphenol FCi","location":"Santa Clara, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e81dd27bf767ea68f71ef?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j138"},{"title":"Electrical Engineer - Lighting Distribution (Entry level)","company":"VARITE INC","location":"Orlando, FL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e81a6270e3033b045e3e9?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j139"},{"title":"ELECTRICAL ENGINEER I - CO","company":"City Light & Power, Inc.","location":"Denver, CO","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3aacc11232144fb156f5f8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j140"},{"title":"Electrical Engineer, Assistant - Customer Experience","company":"Seattle City Light","location":"Seattle, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5f577bb0f20036bc630887?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j141"},{"title":"Electrical Engineering - Hardware Design Co-op ","company":"Eclipse Automation","location":"Cambridge, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e1bfcf3674a0545d27208?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j142"},{"title":"Electrical Engineer","company":"CaptiveAire Systems","location":"East Petersburg, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51da27ae4052672fe9bf6f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j143"},{"title":"Electrical Engineer","company":"CaptiveAire Systems","location":"East Petersburg, PA","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a1d40a1b524ae49285a5a61?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j144"},{"title":"Salvage PCB Specialist POC","company":"Nova Biomedical","location":"Billerica, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e2d9cf3674a0545d275d0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j145"},{"title":"Electrical Engineer I (TX)","company":"Shield AI","location":"Dallas, TX, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e97275e0cd471b2f13d6b1?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j146"},{"title":"Power Electronics/Electrical Engineer (Junior to Mid-Level, 0-10 Yrs Experience) - $80K – $140K","company":"RCT Systems","location":"Baltimore, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4b4dcc4eb370649b279dee?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j147"},{"title":"Analyst, Customer Growth & Retention","company":"Foot Locker","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5ed1d1f29acc1a1174990b?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j148"},{"title":"Growth Associate - Seller Ops + Marketing","company":"Rabbu, Inc.","location":"Charlotte Metro","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5ea49427bf767ea68f81df?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j149"},{"title":"Associate Product Marketing Manager","company":"Amphenol FCi","location":"Santa Clara, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5e81e3270e3033b045e401?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j150"},{"title":"Associate Product Marketing Manager","company":"Amphenol TCS","location":"Santa Clara, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5e81ddf3674a0545d29680?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j151"},{"title":"Revenue Strategy & Growth Associate","company":"Clipboard","location":"Remote (New York, NY)","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a33c2f31232144fb155cf0e?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j152"},{"title":"Marketing & Engagement Associate","company":"Newmedica","location":"Ipswich, Suffolk, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5e4f95f29acc1a11746adb?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j153"},{"title":"Marketing & Engagement Associate","company":"Newmedica","location":"Bury St Edmunds, Suffolk, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-20","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5e4f8567b2850e77df057a?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j154"},{"title":"Summer 2027 Intern - Associate Product Manager (APM)","company":"Salesforce","location":"San Francisco, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-20","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a58e943c8e3a473cb8a3c00?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j155"},{"title":"Product Management Intern (Summer 2027)","company":"Databricks","location":"Bellevue, Washington","type":"Product Manager","jobType":"intern","posted":"2026-07-20","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a5908d763a8f619507bfd68?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j156"},{"title":"Product Management Intern (Fall 2026)","company":"Gemini","location":"New York, NY","type":"Product Manager","jobType":"intern","posted":"2026-07-20","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a45227d4f64ba41dcb4c5ee?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j157"},{"title":"UI/UX Design Intern","company":"Treehouse Strategy","location":"75 S Broadway, White Plains, NY 10601, USA","type":"Product Designer","jobType":"intern","posted":"2026-07-20","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a5f1405f29acc1a1174a4db?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j158"},{"title":"Product Design Intern","company":"Jacques Marie Mage","location":"Los Angeles, CA, United States","type":"Product Designer","jobType":"intern","posted":"2026-07-20","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a5bfb01c8e3a473cb8b138a?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j159"},{"title":"Digital Design Intern (Fall 2026)","company":"Third Way","location":"Washington, US","type":"Product Designer","jobType":"intern","posted":"2026-07-20","source":"jobright-Design-Intern","url":"https://jobright.ai/jobs/info/6a5e70cf27bf767ea68f6c93?utm_campaign=1049&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j160"},{"title":"Associate Product Manager","company":"Meissner","location":"Camarillo, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-19","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5da092686b4755d1e1e244?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j161"},{"title":"Associate Product Manager (Hardware)","company":"Sunco.com","location":"Valencia, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-19","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5d3466686b4755d1e1d28b?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j162"},{"title":"Associate Product Manager - AXS","company":"AEG","location":"Los Angeles, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-19","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a527d218576ec69c014c2be?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j163"},{"title":"Product Designer Graduate (TikTok-Design-Content Ecosystem & Integrity) - 2026 Start (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a509f6d42c6dc326e8ea6aa?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j164"},{"title":"UX/UI designer","company":"Bending Spoons","location":"London, England, United Kingdom","type":"Product Designer","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a5d754e3ac7627fe900c7cf?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j165"},{"title":"Product Designer - Clearance Required","company":"LMI","location":"Arlington, VA, US","type":"Product Designer","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a4e6243fc327f422fef285c?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j166"},{"title":"Junior Electrical Engineer","company":"APTIM","location":"Knoxville, TN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5dbf0f63a8f619507d07f2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j167"},{"title":"Junior Electrical Engineer  --  Radiological Work","company":"APTIM","location":"Niskayuna, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5dbefb79547a520df5edde?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j168"},{"title":"Electrical Design Engineer","company":"Beyond New Horizons","location":"Arnold AFB, TN, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5db68a3ac7627fe900d844?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j169"},{"title":"Electrical Engineer","company":"Shinkei","location":"El Segundo, California, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5da65a63a8f619507d0126?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j170"},{"title":"RF Hardware Design Engineer (Jr Level)","company":"Vanteon Corporation","location":"Pittsford, NY, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5bee9d3ac7627fe900967c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j171"},{"title":"Power Engineer / Electrical Engineer","company":"ETAP Software","location":"Irvine, California, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e80a5f3aa0c4796439d74e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j172"},{"title":"Electrical Engineer","company":"Daikin Applied Americas","location":"Staunton, VA 24402, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69fe31b752e2b44f558af169?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j173"},{"title":"Electrical Engineer","company":"Daikin Applied Americas","location":"Staunton, VA 24402, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a53721d8ef95364ead922d5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j174"},{"title":"Robotics Hardware Engineer","company":"Stridar","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5cc376856af468ab00fae6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j175"},{"title":"Electrical Engineer I (SD)","company":"Shield AI","location":"San Diego, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e8eb5a4b0fa35a70769f88?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j176"},{"title":"Multiskilled Electrical Engineer","company":"O-I","location":"Glasshouse Loan, Alloa FK10, UK","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e87969e0cd471b2f135615?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j177"},{"title":"Electrical Design Engineer (HE LLC) (53938)","company":"Hanley Energy","location":"Ashburn, VA 20147, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c8eb6686b4755d1e1c06a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j178"},{"title":"Ad Operations Specialist","company":"Entravision Digital - Global Advertising powered by Technology","location":"Burbank, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-19","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5d4b7a3ac7627fe900c0c1?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j179"},{"title":"Digital Designer, Oral-B Content Creation","company":"Procter & Gamble","location":"Mason, OH, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a2b95983f691a293d0b8c8e?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j180"},{"title":"Jr. Product Designer, Web","company":"Digital Extremes","location":"London, ON, Canada","type":"Product Designer","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a356901ce501060b5cf41ee?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j181"},{"title":"Electrical Engineer 1 Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Rock Hill, SC, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c58274da96a42cfd9c66c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j182"},{"title":"Electrical Engineer 1 Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Rock Hill, SC, US, 29730","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c57f44da96a42cfd9c64b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j183"},{"title":"I&C Hardware Engineer Job Details / Westinghouse Electric Company, LLC","company":"Westinghouse Electric Company","location":"Windsor, CT, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c57d74da96a42cfd9c632?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j184"},{"title":"Hardware Engineer (Fall Co-op)","company":"Verkada","location":"San Mateo, CA United States","type":"Hardware","jobType":"intern","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c348b856af468ab00e6d0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j185"},{"title":"Electrical Engineer","company":"Captiveaire - Region 114 Western PA","location":"East Petersburg, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5c076ac8e3a473cb8b15a1?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j186"},{"title":"Electrical Engineering Specialist","company":"STV","location":"Oklahoma City, OK","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a06075f7c753c287f6fe364?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j187"},{"title":"Electrical Engineering Specialist","company":"STV","location":"Oklahoma City, OK, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a524568e726ec56126a257c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j188"},{"title":"Electrical Engineering Specialist","company":"STV","location":"Oklahoma City, Oklahoma, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0fd652619335383fb2f773?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j189"},{"title":"Entry Level Electrical Engineer","company":"Haag, a Salas O'Brien Company","location":"Merritt Island, Florida, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5897539838a11e5d83947b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j190"},{"title":"Hardware Engineer I","company":"Honeywell Technologies","location":"Minneapolis, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4333434461bf091787b19f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j191"},{"title":"Electrical Engineer I","company":"MTS Systems Corporation","location":"Eden Prairie, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a332c76910b7349107143b9?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j192"},{"title":"Associate Engineer (Electrical Planning and Design), Electrical Engineering 1","company":"National Grid","location":"Syracuse, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e94e1de0cd471b2f13c718?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j193"},{"title":"Associate Electrical Engineer - Buildings","company":"WSP in the U.S.","location":"Denver, CO","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e7e86958811370cb11f373?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j194"},{"title":"Associate Electrical Engineer - Buildings","company":"WSP in the U.S.","location":"1001 Bishop Street, Honolulu, HI, 96813, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a58d5f0c8e3a473cb8a3385?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j195"},{"title":"Associate Electrical Engineer - Buildings","company":"WSP in the U.S.","location":"Denver, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59a7d13ac7627fe90003dc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j196"},{"title":"Junior Electrical Engineer  --  Radiological Work","company":"CB&I","location":"2401 River Road, Niskayuna, NY12309","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a11910612f8b43cf398aa3b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j197"},{"title":"Modem HW Design Engineer – AI Driven Next Gen Modem Hardware Development","company":"Qualcomm","location":"San Diego, California, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55dd724ca3b003c20ff985?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j198"},{"title":"Junior Electrical Engineer","company":"APTIM","location":"Knoxville, TN, 37934, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69e81f02e0cd471b2f12f991?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j199"},{"title":"Electrical Design Engineer (E)","company":"KLA","location":"Ann Arbor, MI, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0a75a28f3e371eb6188acf?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j200"},{"title":"Electrical Engineer, Robotics Hardware (copy)","company":"FieldAI","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5bec824da96a42cfd9b6bd?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j201"},{"title":"Electrical Design Engineer - Test Fixture","company":"KLA","location":"Ann Arbor, MI","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69cb1113a8c1822476e239c2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j202"},{"title":"Associate Electrical Engineer / Electronic Design Engineer.","company":"Moog Inc.","location":"Phoenix, AZ, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69efa19158811370cb1476a5?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j203"},{"title":"Associate Electrical Engineer / Electronic Design Engineer.","company":"Moog Inc.","location":"Phoenix, AZ, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51db1f57513b72e0c68fa8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j204"},{"title":"Electrical Engineer - Training Center","company":"Sungrow","location":"TX Office, Houston, TX, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2ca70ffc0644749054ad94?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j205"},{"title":"Electrical Engineer","company":"The Chemours Company","location":"US - TN - New Johnsonville, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2821481dbd8437bebc8ea6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j206"},{"title":"Coordinator, Product Marketing","company":"Dassault Systèmes","location":"New York, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a3f0b64ce7cce40b3422e37?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j207"},{"title":"Marketing Operations Coordinator","company":"Prometheus Real Estate Group","location":"San Mateo, California, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a4fe2984649561ec08af616?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j208"},{"title":"Content Operations Specialist","company":"Tebra","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-18","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a28ea4cfd37e62bb47abd52?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j209"},{"title":"Product Manager (Consumer Deposit) - Brooklyn, OH","company":"KeyBank","location":"Brooklyn, OH, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a57b150a791c6211bf0044c?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j210"},{"title":"Product Operations Associate I","company":"Maverick Payments","location":"Calabasas, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5a8c66856af468ab00916f?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j211"},{"title":"Associate Product Manager","company":"Fidelity Bank","location":"Merrimack, NH, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5a7377856af468ab00891b?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j212"},{"title":"Product Manager","company":"RealPage, Inc.","location":"Boston, MA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a51b71702522b5b722ea169?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j213"},{"title":"Product Manager","company":"RealPage, Inc.","location":"Boston, MA, US","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a3d447ed261407de97ff944?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j214"},{"title":"Associate -Digital Product Management","company":"American Express","location":"Phoenix, AZ, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5a6428c8e3a473cb8ab7dd?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j215"},{"title":"Assistant Product Manager","company":"ReaderLink","location":"Oak Brook, IL, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a552a092084cd792b476936?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j216"},{"title":"TikTok Shop - Risk Strategy Product Manager","company":"TikTok","location":"Seattle, WA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-17","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5a074b3ac7627fe9001df9?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j217"},{"title":"Asset & Wealth Management, UI/UX Design, Analyst - New York","company":"Goldman Sachs","location":"New York, NY, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a51d1b1bf63b66c7997d62b?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j218"},{"title":"Assistant Electrical Engineer (Represented)","company":"Metropolitan Transportation Authority","location":"Brooklyn, NY, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5afc06686b4755d1e17e18?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j219"},{"title":"New Grad Electrical Engineer - Power Studies","company":"Shermco Industries","location":"Irving, TX, US","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5786a610c4d945d864e98a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j220"},{"title":"Embedded Electronics Engineer Job Details / Calian","company":"Calian Group","location":"Ottawa, ON, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a9384c8e3a473cb8ac81f?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j221"},{"title":"Associate Electrical Engineer","company":"Pyka","location":"Alameda HQ","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5adf0363a8f619507c8ae2?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j222"},{"title":"Associate Electrical Engineer","company":"Pyka","location":"Alameda, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5adef9686b4755d1e16f34?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j223"},{"title":"Associate Electrical Design Engineer, Infrastructure Design","company":"Tesla","location":"Palo Alto, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ad84a856af468ab00a022?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j224"},{"title":"Hardware Engineer Co-op","company":"Arlo Technologies, Inc.","location":"Richmond, BC, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a5e133ac7627fe9003afa?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j225"},{"title":"Assistant Electrical Engineer, Power (Denver)","company":"Burns & McDonnell","location":"Denver, CO","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3d383c122f340d29cef8cd?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j226"},{"title":"Electrical Design Engineer Job Details / PACCAR","company":"Kenworth Truck Co.","location":"Kirkland, WA, US, 98033","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a32968d7f3fdd180d4c27a7?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j227"},{"title":"Associate Electrical Design Engineer","company":"Kenworth Truck Co.","location":"Kirkland, WA, US, 98033","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a2a31b90c4972328e7e7bb4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j228"},{"title":"Associate Electrical Design Engineer","company":"Kenworth Truck Co.","location":"Kirkland, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a57f21b8f51964c04045e63?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j229"},{"title":"Electrical Design Engineer","company":"Kenworth Truck Co.","location":"Kirkland, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55f88defb06a45240d279d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j230"},{"title":"Associate Electrical Design Engineer Job Details / PACCAR","company":"Kenworth Truck Co.","location":"Kirkland, WA, US, 98033","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a32969829c90c607e4d723e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j231"},{"title":"Electrical Engineer","company":"ISG","location":"Cleveland, OH","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3447891232144fb155f2a3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j232"},{"title":"Co-op, Electrical Engineering Job Details / Knorr-Bremse","company":"Knorr-Bremse Lisieux – Systèmes pour Véhicules Utilitaires","location":"Avon, OH, United States","type":"Hardware","jobType":"intern","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a392e4c649fdf16292ff9c9?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j233"},{"title":"Marine Electrical Engineer Entry Level - Providence, RI","company":"Glosten","location":"Providence, RI, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a60ef777196365a6f008ad8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j234"},{"title":"Co-op, Electrical Engineer","company":"Enedym Inc.","location":"Hamilton, ON, CA","type":"Hardware","jobType":"intern","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a570cc8e3a473cb8ab1a9?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j235"},{"title":"Electrical Engineer I","company":"Marvin","location":"Warroad, MN, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a56fe686b4755d1e1492b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j236"},{"title":"Strategic Electrical Engineer","company":"Constellation","location":"Clinton, Illinois, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a423d6a6a9c2774b3fa57c6?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j237"},{"title":"Electrical Engineer - Decatur, IL","company":"ADM","location":"Decatur IL - Illinois","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a52a98f8ef95364ead8f4c4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j238"},{"title":"Electrical Engineer (Hybrid)","company":"Tetra Tech","location":"Tampa, Florida, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a3968856af468ab0074f0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j239"},{"title":"Electrical Engineer (all levels)","company":"Skydio","location":"San Mateo, California, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a0e329247fea1610bca7ed0?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j240"},{"title":"Electrical Engineer","company":"Bastion Technologies, Inc.","location":"Littleton, CO, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69cdd59e54f00230c6cf6e0c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j241"},{"title":"Hardware Engineer","company":"HID","location":"Delta, British Columbia, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a214e92902d19201c7b6ee8?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j242"},{"title":"Hardware Engineering Program Specialist","company":"Verkada","location":"San Mateo, CA United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a3da55078237a036d5e2473?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j243"},{"title":"Electrical Engineer","company":"RFA Engineering","location":"Chillicothe, Illinois, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a1fd5c8e3a473cb8a9f3e?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j244"},{"title":"Electrical Engineer","company":"City of Starkville","location":"STARKVILLE, MS 39759-2823, USA","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5a0c30856af468ab00691c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j245"},{"title":"Electrical Design Engineer","company":"Moog Inc.","location":"Buffalo, NY, United States of America","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a46aa3a971cd25b06f8faaa?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j246"},{"title":"Bright Apply Testing - TTP - Graduate Electronics Engineer","company":"Kombo","location":"80 Middlesex St, London E1 7EZ, UK","type":"Hardware","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59e9813ac7627fe900115d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j247"},{"title":"Junior Ad Operations Specialist","company":"Priceline","location":"Ontario - Remote, Canada","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5a892e3ac7627fe90048c5?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j248"},{"title":"Go-To-Market Engineer","company":"InstaLILY AI","location":"New York, New York, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5a83844da96a42cfd965e4?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j249"},{"title":"Development Coordinator, Community Giving & Engagement - RMH Foundation","company":"Ross Memorial Hospital","location":"Lindsay, ON, CA","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5a751863a8f619507c70db?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j250"},{"title":"Product Marketing Assistant","company":"Dinamic AS Group","location":"Dayton, OH, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5adc6c4da96a42cfd97940?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j251"},{"title":"Livestream Operations Specialist","company":"36samplesale","location":"Auburndale, MA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5adcc7856af468ab00a2be?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j252"},{"title":"SE Engagement & Marketing Ambassador","company":"University of Richmond","location":"UR Main Campus, United States of America","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5a5359856af468ab007de4?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j253"},{"title":"Growth Analyst (Remote)","company":"HOIST","location":"United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5a4258c8e3a473cb8aab92?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j254"},{"title":"Growth Analyst","company":"AppLovin","location":"Palo Alto, CA, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a4d78c44c6c9f7a619f7e75?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j255"},{"title":"Marketing Coordinator - Go-To-Market","company":"Plante Moran","location":"Southfield, United States of America","type":"Product Ops","jobType":"fulltime","posted":"2026-07-17","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a51d24802522b5b722ec178?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j256"},{"title":"Internship - Product Management","company":"Infineon Technologies","location":"El Segundo, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a1e16bf9111f771d1a1d2ed?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j257"},{"title":"Process Innovation - Product Management Intern","company":"Altasciences","location":"Overland Park, KS, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a4cff65d27b2c4dda9b5b28?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j258"},{"title":"Product Manager Vertical Search Ads Mandarin Speaking Project intern (Content and Service Ads) - 2026 Start (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a3dca16882f121f56a38dec?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j259"},{"title":"Summer 2027 Intern - Associate Product Manager (APM)","company":"Salesforce","location":"California - San Francisco, United States of America","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a58fadd3ac7627fe9ffc8b5?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j260"},{"title":"Product Management Intern (Early Careers)","company":"Mobility Global","location":"Michigan, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a164d7ca429fd279da975b9?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j261"},{"title":"Product Management Intern (Early Careers)","company":"Mobility Global","location":"Southfield, MI, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-17","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a50134d9469c066203500f0?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j262"},{"title":"Associate Product Manager, Integrations","company":"Agave","location":"San Francisco, CA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a595b5d856af468ab0035cf?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j263"},{"title":"Associate Product Manager","company":"Air Techniques","location":"Melville, NY, US","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a2bfe1fc260bb1b8ae1405d?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j264"},{"title":"Product Management Analyst","company":"Fiserv","location":"Berkeley Heights, NJ, United States of America","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a57ef1a9f1f56462cf67782?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j265"},{"title":"Associate Product Manager, New Grad (2027 Start)","company":"Databricks","location":"Bellevue, WA, United States","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a5908d5c8e3a473cb8a4916?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j266"},{"title":"Senior Associate, Product Manager - Business Cards & Payments","company":"Capital One","location":"New York, NY","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68c326145001f8077bf61a62?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j267"},{"title":"Senior Associate, Product Manager - Business Cards & Payments","company":"Capital One","location":"McLean, VA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68c325ab5adaee6c9bda7ad7?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j268"},{"title":"Senior Associate, Product Manager - Business Cards & Payments","company":"Capital One","location":"Richmond, VA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68c3251663829b0a8a500339?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j269"},{"title":"Associate Product Manager","company":"Courted","location":"NYC Metro Area","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/6a59098a856af468ab001651?utm_campaign=Product%20Management&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j270"},{"title":"Senior Associate, Product Management - Pay Over Time (Business Cards & Payments)","company":"Capital One","location":"McLean, VA","type":"Product Manager","jobType":"fulltime","posted":"2026-07-16","source":"jobright-PM","url":"https://jobright.ai/jobs/info/68ee9e2be0db9242258087ec?utm_campaign=Product%20Management&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j271"},{"title":"Associate Product Designer","company":"Ruffwear","location":"Bend, OR","type":"Product Designer","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a58f2664da96a42cfd8e2fb?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j272"},{"title":"Associate Product Designer","company":"Ruffwear","location":"Bend, OR, United States","type":"Product Designer","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Design","url":"https://jobright.ai/jobs/info/6a58efb5c8e3a473cb8a402f?utm_campaign=Creatives%20and%20Design&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j273"},{"title":"PCB Final Quality Control (NVD)","company":"Foxconn Industrial Internet","location":"San Jose, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59c7c63ac7627fe9000a61?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j274"},{"title":"Entry Level Electrical Design Engineer (University of Michigan 2026)","company":"DMC Engineering","location":"Chicago (Headquarters)","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a458f7848d2f00f2a86df62?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j275"},{"title":"Marine Electrical Engineer Entry Level - Seattle, WA","company":"Glosten","location":"Seattle,WA,US","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ed903f3674a0545d2b1bb?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j276"},{"title":"Entry Level Electrical Design Engineer (Missouri S&T 2026)","company":"DMC Engineering","location":"Chicago, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a458f703dbab558e29a1a2a?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j277"},{"title":"Electrical Engineer","company":"MacKay","location":"Fort Collins, CO","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a51d99c02522b5b722ec7aa?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j278"},{"title":"Marine Electrical Engineer Entry Level - Bellingham, WA","company":"Glosten","location":"Bellingham, WA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5ebcda27bf767ea68f87a3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j279"},{"title":"Early Career Electrical Engineer","company":"WSP","location":"Foxborough, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a596973c8e3a473cb8a6f60?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j280"},{"title":"Associate Electrical Engineer, Capital Equipment, R&D - MedTech","company":"Johnson & Johnson MedTech","location":"Cincinnati, OH, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59502b686b4755d1e0fc4c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j281"},{"title":"I&C Hardware Engineer","company":"Westinghouse Electric Company","location":"Windsor, CT, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59446b856af468ab002e68?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j282"},{"title":"I&C Hardware Engineer","company":"Westinghouse Electric Company","location":"New Stanton, PA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55fc6c21f64463ad351562?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j283"},{"title":"Electrical Design Engineer – Level l or ll","company":"Industrial Electric Mfg. (IEM)","location":"Jacksonville, Florida, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5943c063a8f619507c15eb?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j284"},{"title":"Associate Electrical Engineer, Capital Equipment, R&D - MedTech","company":"Johnson & Johnson","location":"Cincinnati, OH, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5942c23ac7627fe9ffe52c?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j285"},{"title":"Electrical Engineer Level I/II-Boston","company":"Specter Aerospace","location":"Peabody, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5941c94da96a42cfd901dc?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j286"},{"title":"Electrical Design Engineer","company":"Carrier","location":"Kennesaw, GA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a55361fae07d60a8d00fc43?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j287"},{"title":"Electrical Engineer Level I/II","company":"Specter Aerospace","location":"Boston, MA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a59f5bc63a8f619507c47d3?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j288"},{"title":"Graduate Electrical Engineer","company":"PM Group","location":"Pleasanton,California,United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5901bb4da96a42cfd8e709?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j289"},{"title":"Electrical Engineer, Supply","company":"Constellation","location":"Cordova, IL, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a590a43686b4755d1e0e029?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j290"},{"title":"Electrical Engineer - Local candidates only","company":"Seafloor Systems, Inc.","location":"Sacramento, CA, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a592dcac8e3a473cb8a582b?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j291"},{"title":"Electrical Engineering Co-Op Student","company":"Vale","location":"Sudbury, ON, Canada","type":"Hardware","jobType":"intern","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a58eea363a8f619507bf421?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j292"},{"title":"Electrical Engineering Co-Op Spring 2027","company":"Specter Aerospace","location":"Boston, MA, United States","type":"Hardware","jobType":"intern","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a57b7ab10c4d945d86507b4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j293"},{"title":"Junior Electrical Engineer","company":"CACI International Inc","location":"Aberdeen Proving Ground, MD, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a5e13d2f3674a0545d26eec?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j294"},{"title":"RF Hardware Engineer","company":"K2 Space Corporation","location":"Los Angeles, CA","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a03d53ff3d6cc51d637a044?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j295"},{"title":"Electrical Engineer","company":"General Fusion","location":"Richmond, BC, Canada","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a595a844da96a42cfd90ac4?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j296"},{"title":"Entry Level Electrical Design Engineer (UIUC 2026)","company":"DMC Engineering","location":"Chicago (Headquarters)","type":"Hardware","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a458f820dd56c76cc2f3c99?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j297"},{"title":"Digital Engagement & Strategy Coordinator, Women's Basketball","company":"Duke University","location":"Durham, NC, US, 27710","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a590d3bc8e3a473cb8a4be2?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j298"},{"title":"Graduate growth manager","company":"Bending Spoons","location":"London, England, United Kingdom","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a597fa13ac7627fe9fffaba?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j299"},{"title":"Outbound Growth CRM Specialist","company":"SPAR Group","location":"Charlotte, NC, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a593e8b63a8f619507c1269?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j300"},{"title":"Growth Associate","company":"talentpluto","location":"New York, NY, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a5304a68576ec69c014e5be?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j301"},{"title":"Product Marketing Associate","company":"Claroty","location":"New York, United States","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a467a6d0dd56c76cc2f98ed?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j302"},{"title":"Marketing Specialist, CRM Campaigns","company":"Bright Horizons","location":"Newton Massachusetts 02459, United States of America","type":"Product Ops","jobType":"fulltime","posted":"2026-07-16","source":"jobright-Marketing","url":"https://jobright.ai/jobs/info/6a58e68dc8e3a473cb8a3a41?utm_campaign=Marketing&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j303"},{"title":"Copyright Solution Product Manager Project Intern (TikTok-Music) - 2026 Start (BS/MS)","company":"TikTok","location":"San Jose, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-16","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a47032d3dbab558e29a97f4?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j304"},{"title":"Product Operations Intern","company":"Retell","location":"Redwood City, CA, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-16","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a597efb3ac7627fe9fff9a7?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j305"},{"title":"Product Management Intern - Fall 2026","company":"Signify","location":"Menlo Park, CA, United States","type":"Product Manager","jobType":"intern","posted":"2026-07-16","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a591374856af468ab001ad7?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j306"},{"title":"Product Operations Manager Intern (TikTok Shop, Merchandise Growth) - 2026 Summer (BS/MS)","company":"TikTok","location":"Seattle, WA, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-16","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a592451c8e3a473cb8a53bb?utm_campaign=1047&utm_source=git","h1b":"likely","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j307"},{"title":"Product Operations Intern","company":"Instawork","location":"Chicago, Illinois, United States","type":"Product Ops","jobType":"intern","posted":"2026-07-16","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a07044e1f7fa33581c9ac2c?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j308"},{"title":"Electrical Engineer","company":"Eichleay, Inc.","location":"Billings, Montana, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-15","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/69dd9f22e34484770f19d920?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Hybrid"],"id":"j309"},{"title":"Entry Level Electrical Engineer (Commercial & Industrial)","company":"NEI Electric Power Engineering, Inc.","location":"Lakewood, CO 80215, United States","type":"Hardware","jobType":"fulltime","posted":"2026-07-15","source":"jobright-Engineering","url":"https://jobright.ai/jobs/info/6a4269cc6faf756060966b9d?utm_campaign=Engineering%20and%20Development&utm_source=1103","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["Remote"],"id":"j310"},{"title":"Product Management Intern","company":"BSI Financial Services","location":"Irving, TX 75063, USA","type":"Product Manager","jobType":"intern","posted":"2026-07-15","source":"jobright-PM-Intern","url":"https://jobright.ai/jobs/info/6a55d0782ce8bf79a13a1649?utm_campaign=1047&utm_source=git","h1b":"unknown","stage":"saved","notes":"","referralContact":"","tags":["On Site"],"id":"j311"}];
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
    if(filter.type!=="all"&&j.type!==filter.type)return false;
    if(filter.jobType!=="all"&&(j.jobType||"fulltime")!==filter.jobType)return false;
    if(filter.h1bOnly&&j.h1b!=="likely")return false;
    const age=Math.floor((new Date()-new Date(j.posted))/864e5);
    if(j.stage==="saved" && age>WINDOW_DAYS[filter.window])return false;
    if(filter.search){const s=filter.search.toLowerCase();if(!(j.title.toLowerCase().includes(s)||j.company.toLowerCase().includes(s)||j.location.toLowerCase().includes(s)))return false;}
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
    }catch{setRefreshMsg(t.fetchBlocked);}
    setRefreshing(false);
  };

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
        {view === "dashboard" && <Dashboard stats={stats} jobs={jobs} t={t} />}
        {view === "jobs" && <JobBoard jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} requestDelete={setConfirmDel} setEditJob={setEditJob} t={t} />}
        {view === "pipeline" && <PipelineView jobs={filtered} filter={filter} setFilter={setFilter} moveJob={moveJob} setEditJob={setEditJob} t={t} />}
        {view === "lab" && <ResumeLab t={t} lang={lang} />}
        {view === "channels" && <Channels t={t} lang={lang} />}
      </div>

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

// ===== Dashboard =====
function Dashboard({ stats, jobs, t }) {
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
