const LINKS = {
  home: "/",
  oss: "/open-source",
  talks: "/talks",
  projects: "/projects",
  github: "https://github.com/saintmalik",
  x: "https://x.com/saintmalik_",
  linkedin: "https://linkedin.com/in/saintmalik",
  email: "mailto:abdulmalik@saintmalik.me",
  blog: "https://blog.saintmalik.me/",
};

function googleDocUrls(id) {
  if (!id) return { open: "", file: "" };
  return {
    open: `https://docs.google.com/document/d/${id}/preview`,
    file: `https://docs.google.com/document/d/${id}/export?format=pdf`,
  };
}

// TODO: paste Google Doc id for runtime + supply chain — never reuse another role's id
const RESUME_RUNTIME_ID = "";
const RESUME_DEVSECOPS_ID = "1-oSs6dQSUp9KPIBVLQUNMll4dT6czgIqKHI6dGyCycU";
const RESUME_CLOUD_ID = "1Wu7I3GTcf0iAjvTOaQZsUYU6sTKNH2S7wDtL788_7bE";

const RESUME_RUNTIME = googleDocUrls(RESUME_RUNTIME_ID);
const RESUME_DEVSECOPS = googleDocUrls(RESUME_DEVSECOPS_ID);
const RESUME_CLOUD = googleDocUrls(RESUME_CLOUD_ID);

const RESUMES = [
  {
    id: "runtime",
    title: "runtime + supply chain",
    blurb: "ebpf on ci (cicd-sensor), sboms, k8sradar, audit evidence",
    file: RESUME_RUNTIME.file,
    open: RESUME_RUNTIME.open,
    download: "abdulmalik-salawu-runtime.pdf",
  },
  {
    id: "devsecops",
    title: "appsec / devsecops",
    blurb: "reviews, pipelines, shift-left, supabase-audit, disclosures to openclassroom, andela, kuda",
    file: RESUME_DEVSECOPS.file,
    open: RESUME_DEVSECOPS.open,
    download: "abdulmalik-salawu-devsecops.pdf",
  },
  {
    id: "cloud",
    title: "cloud / platform security",
    blurb: "iam, guardduty, landing zones, zero-trust, container security on aws",
    file: RESUME_CLOUD.file,
    open: RESUME_CLOUD.open,
    download: "abdulmalik-salawu-cloud-security.pdf",
  },
];

function currentPath() {
  const p = location.pathname.replace(/index\.html$/, "").replace(/\.html$/, "");
  if (p === "" || p === "/") return "/";
  return p.endsWith("/") ? p.slice(0, -1) : p;
}

function applyTheme(theme) {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (_) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", next === "light" ? "#f8f4ea" : "#050505");
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.textContent = next === "light" ? "black" : "white";
    btn.setAttribute("aria-pressed", next === "light" ? "true" : "false");
    btn.setAttribute("aria-label", next === "light" ? "switch to black mode" : "switch to white mode");
  });
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
  applyTheme(next);
}

function bindThemeToggle() {
  let last = 0;
  const onToggle = (event) => {
    const node = event.target && event.target.nodeType === 3 ? event.target.parentElement : event.target;
    const btn = node && node.closest && node.closest("[data-theme-toggle]");
    if (!btn) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const now = performance.now();
    if (now - last < 400) return;
    last = now;
    toggleTheme();
  };
  document.addEventListener("pointerup", onToggle);
  document.addEventListener("click", onToggle);
}

function markActiveNav() {
  const page = currentPath();
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const match = link.getAttribute("data-nav");
    const active = page === match;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function defaultResumeId() {
  return RESUMES.find((item) => item.file)?.id || RESUMES[0].id;
}

function selectedResume() {
  const id = document.querySelector(".resume-role[aria-pressed='true']")?.dataset.role || defaultResumeId();
  return RESUMES.find((item) => item.id === id) || RESUMES[0];
}

function setResumeAction(el, href, opts = {}) {
  if (!el) return;
  if (!href) {
    el.hidden = true;
    el.removeAttribute("href");
    el.removeAttribute("download");
    el.setAttribute("aria-disabled", "true");
    return;
  }
  el.hidden = false;
  el.removeAttribute("aria-disabled");
  el.href = href;
  if (opts.download) el.setAttribute("download", opts.download);
  else el.removeAttribute("download");
  if (opts.blank) {
    el.target = "_blank";
    el.rel = "noreferrer";
  } else {
    el.removeAttribute("target");
    el.removeAttribute("rel");
  }
}

function syncResumeLinks() {
  const resume = selectedResume();
  setResumeAction(document.getElementById("resume-open"), resume.open || resume.file, { blank: true });
  setResumeAction(document.getElementById("resume-download"), resume.file, { download: resume.download });
}

function openResumeModal() {
  const modal = document.getElementById("resume-modal");
  if (!modal) return;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  syncResumeLinks();
  modal.querySelector(".resume-close")?.focus();
}

function closeResumeModal() {
  const modal = document.getElementById("resume-modal");
  if (!modal) return;
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

function resumeRolesHtml() {
  const selected = defaultResumeId();
  return RESUMES.map((item) => {
    const on = item.id === selected;
    return `
        <li>
          <button class="resume-role" type="button" data-role="${escapeHtml(item.id)}" aria-pressed="${on ? "true" : "false"}">
            <span class="resume-role-inner">
              <span class="role-dot" aria-hidden="true">${on ? "●" : "○"}</span>
              <span>
                <span class="role-title">${escapeHtml(item.title)}</span>
                <span class="role-blurb">${escapeHtml(item.blurb)}</span>
              </span>
            </span>
          </button>
        </li>`;
  }).join("");
}

function renderResumeRoles() {
  const root = document.querySelector(".resume-roles");
  if (!root) return;
  root.innerHTML = resumeRolesHtml();
}

function bindResumeModal() {
  renderResumeRoles();
  document.querySelectorAll("[data-resume-open]").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const modal = document.getElementById("resume-modal");
      if (!modal) return;
      event.preventDefault();
      openResumeModal();
    });
  });
  document.querySelectorAll("[data-resume-close]").forEach((el) => {
    el.addEventListener("click", closeResumeModal);
  });
  document.querySelectorAll(".resume-role").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".resume-role").forEach((other) => {
        const on = other === btn;
        other.setAttribute("aria-pressed", on ? "true" : "false");
        other.querySelector(".role-dot").textContent = on ? "●" : "○";
      });
      syncResumeLinks();
    });
  });
  syncResumeLinks();
}

function tickClock() {
  const el = document.getElementById("clock");
  if (!el) return;
  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  el.textContent = time;
}

function bindKeys() {
  const map = {
    h: LINKS.home,
    o: LINKS.oss,
    t: LINKS.talks,
    p: LINKS.projects,
  };

  document.addEventListener("keydown", (event) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const tag = event.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
    const key = event.key.toLowerCase();
    if (key === "escape") {
      closeResumeModal();
      return;
    }
    if (key === "r") {
      event.preventDefault();
      const modal = document.getElementById("resume-modal");
      if (modal && !modal.hidden) closeResumeModal();
      else openResumeModal();
      return;
    }
    const href = map[key];
    if (!href) return;
    event.preventDefault();
    location.href = href;
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function isListedOssItem(item) {
  if (item.kind === "pr" && item.state !== "open" && !item.merged) return false;
  return true;
}

function statusOf(item) {
  if (item.kind === "issue") {
    if (item.state === "open") return "open";
    return "merged";
  }
  if (item.state === "open") return "open";
  if (item.merged) return "merged";
  return "closed";
}

function mark(status) {
  if (status === "merged") return '<span class="mark merged" title="merged/resolved">✓</span>';
  if (status === "open") return '<span class="mark open" title="open">○</span>';
  return '<span class="mark closed" title="closed">✗</span>';
}

function renderOss(items, stars, typeFilter, statusFilter) {
  const filtered = items.filter((item) => {
    if (typeFilter === "pr" && item.kind !== "pr") return false;
    if (typeFilter === "issue" && item.kind !== "issue") return false;
    const status = statusOf(item);
    if (statusFilter !== "all" && status !== statusFilter) return false;
    return true;
  });

  const groups = new Map();
  for (const item of filtered) {
    if (!groups.has(item.repo)) groups.set(item.repo, []);
    groups.get(item.repo).push(item);
  }

  const root = document.getElementById("oss-list");
  if (!root) return;
  if (!filtered.length) {
    root.innerHTML = `<p class="status">nothing matched that filter.</p>`;
    return;
  }

  root.innerHTML = [...groups.entries()]
    .map(([repo, group]) => {
      const star = stars[repo];
      const starLabel = typeof star === "number" ? `${star.toLocaleString()}★` : "";
      return `
        <section class="repo-group">
          <div class="repo-head">
            <a href="https://github.com/${escapeHtml(repo)}" target="_blank" rel="noreferrer">${escapeHtml(repo)}</a>
            <span class="repo-stars">${starLabel}</span>
          </div>
          ${group
            .map((item) => {
              const status = statusOf(item);
              const kind = item.kind === "issue" ? "issue" : "pr";
              const summary = item.body
                ? `<div class="pr-meta">${escapeHtml(item.body)}</div>`
                : `<div class="pr-meta">${kind}#${item.number} · ${formatDate(item.created)}</div>`;
              return `
                <a class="pr-row" href="${item.html}" target="_blank" rel="noreferrer">
                  ${mark(status)}
                  <div class="pr-main">
                    <div class="pr-title">${escapeHtml(item.title)}</div>
                    ${summary}
                  </div>
                  <span class="pr-badge">${kind} ${item.number}</span>
                </a>`;
            })
            .join("")}
        </section>`;
    })
    .join("");
}

function setCounts(items) {
  const set = (id, n) => {
    const el = document.getElementById(id);
    if (el) el.textContent = n;
  };
  set("count-pr", items.filter((i) => i.kind === "pr").length);
  set("count-issue", items.filter((i) => i.kind === "issue").length);
  set("count-merged", items.filter((i) => statusOf(i) === "merged").length);
  set("count-open", items.filter((i) => statusOf(i) === "open").length);
  set("count-closed", items.filter((i) => statusOf(i) === "closed").length);
}

function bindOssFilters(items, stars) {
  let typeFilter = "all";
  let statusFilter = "all";
  const draw = () => renderOss(items, stars, typeFilter, statusFilter);
  draw();
  document.querySelectorAll("[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      typeFilter = btn.dataset.type;
      document.querySelectorAll("[data-type]").forEach((el) => el.classList.toggle("active", el === btn));
      draw();
    });
  });
  document.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", () => {
      statusFilter = btn.dataset.status;
      document.querySelectorAll("[data-status]").forEach((el) => el.classList.toggle("active", el === btn));
      draw();
    });
  });
}

async function initOpenSource() {
  const root = document.getElementById("oss-list");
  if (!root) return;

  try {
    const res = await fetch("/assets/oss.json");
    if (!res.ok) throw new Error("oss.json");
    const data = await res.json();
    const items = (data.items || []).filter(isListedOssItem);
    setCounts(items);
    bindOssFilters(items, data.stars || {});
  } catch {
    root.innerHTML = `<p class="status">could not load the contribution snapshot.</p>`;
  }
}

const WRITING_FEED = "https://blog.saintmalik.me/rss.xml";
const WRITING_LIMIT = 2;

function formatWritingDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function parseWritingFeed(xmlText) {
  const doc = new DOMParser().parseFromString(xmlText, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("feed xml");
  return [...doc.querySelectorAll("channel > item")]
    .map((item) => {
      const title = (item.querySelector("title")?.textContent || "").trim();
      const href = (item.querySelector("link")?.textContent || item.querySelector("guid")?.textContent || "").trim();
      const pub = (item.querySelector("pubDate")?.textContent || "").trim();
      const ms = Date.parse(pub);
      return {
        title,
        href,
        date: formatWritingDate(pub),
        ms: Number.isNaN(ms) ? 0 : ms,
      };
    })
    .filter((item) => item.title && item.href)
    .sort((a, b) => b.ms - a.ms)
    .slice(0, WRITING_LIMIT);
}

function writingHtml(items) {
  return items
    .map(
      (item) => `
          <li>
            <a class="write-row" href="${escapeHtml(item.href)}" target="_blank" rel="noreferrer">
              <span>${escapeHtml(item.title)}</span>
              <span class="write-date">${escapeHtml(item.date)}</span>
            </a>
          </li>`
    )
    .join("");
}

async function initWriting() {
  const root = document.getElementById("writing-list");
  if (!root) return;
  try {
    const res = await fetch(WRITING_FEED, { cache: "no-store" });
    if (!res.ok) throw new Error("feed");
    const items = parseWritingFeed(await res.text());
    if (!items.length) throw new Error("empty");
    root.innerHTML = writingHtml(items);
  } catch {
    // keep the two Sep 12 posts already in the HTML
  }
}

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function formatTalkDate(value) {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})$/);
  if (!m) return String(value);
  const month = MONTHS[Number(m[2]) - 1];
  return month ? `${month} ${m[1]}` : String(value);
}

function talkYearLabel(date) {
  if (!date) return "earlier";
  const year = String(date).slice(0, 4);
  return /^\d{4}$/.test(year) ? year : "earlier";
}

function talkEntryHtml(talk) {
  const dateLabel = formatTalkDate(talk.date);
  const top = talk.date
    ? `<div class="talk-top">
                <h3 class="talk-title">${escapeHtml(talk.title)}</h3>
                <time class="talk-date" datetime="${escapeHtml(talk.date)}">${escapeHtml(dateLabel)}</time>
              </div>`
    : `<h3 class="talk-title">${escapeHtml(talk.title)}</h3>`;
  const host = talk.host ? `<p class="talk-host">${escapeHtml(talk.host)}</p>` : "";
  const brief = talk.brief ? `<p class="talk-brief">${escapeHtml(talk.brief)}</p>` : "";
  const links = [];
  if (talk.video) links.push(`<a href="${escapeHtml(talk.video)}" target="_blank" rel="noreferrer">video</a>`);
  if (talk.slides) links.push(`<a href="${escapeHtml(talk.slides)}" target="_blank" rel="noreferrer">slides</a>`);
  const actions = links.length ? `<div class="talk-actions">${links.join("")}</div>` : "";
  return `
          <li>
            <article class="talk-entry">
              ${top}
              ${host}
              ${brief}
              ${actions}
            </article>
          </li>`;
}

function talksHtml(talks) {
  const groups = [];
  const index = new Map();
  for (const talk of talks) {
    const label = talkYearLabel(talk.date);
    if (!index.has(label)) {
      index.set(label, []);
      groups.push([label, index.get(label)]);
    }
    index.get(label).push(talk);
  }
  return groups
    .map(
      ([year, items]) => `
        <h2 class="talk-year">${escapeHtml(year)}</h2>
        <ul class="talks-list">
          ${items.map(talkEntryHtml).join("")}
        </ul>`
    )
    .join("");
}

async function initTalks() {
  const root = document.getElementById("talks-list");
  if (!root) return;
  try {
    const res = await fetch("/assets/talks.json");
    if (!res.ok) throw new Error("talks.json");
    const talks = await res.json();
    if (!Array.isArray(talks) || !talks.length) throw new Error("empty");
    root.innerHTML = talksHtml(talks);
  } catch {
    root.innerHTML = `<p class="status">could not load talks.</p>`;
  }
}

function formatTags(tags) {
  return (tags || []).join(" · ");
}

function projectItemHtml(project, { featured = false } = {}) {
  const tags = featured && project.homeTags ? project.homeTags : project.tags;
  const blurb =
    featured && project.homeDescription ? project.homeDescription : project.description;
  const slash =
    featured && project.line
      ? `<span class="slash"> // ${escapeHtml(project.line)}</span>`
      : "";
  return `
          <li>
            <a class="block" href="${escapeHtml(project.url)}" target="_blank" rel="noreferrer">
              <div class="item-title-row">
                <h3>${escapeHtml(project.title)}${slash}</h3>
                <span class="tags">${escapeHtml(formatTags(tags))}</span>
              </div>
              <p>${escapeHtml(blurb || "")}</p>
            </a>
          </li>`;
}

async function fetchProjects() {
  const res = await fetch("/assets/projects.json");
  if (!res.ok) throw new Error("projects.json");
  const projects = await res.json();
  if (!Array.isArray(projects)) throw new Error("shape");
  return projects;
}

async function initProjects() {
  const root = document.getElementById("projects-list");
  if (!root) return;
  try {
    const projects = await fetchProjects();
    if (!projects.length) throw new Error("empty");
    root.innerHTML = projects.map((p) => projectItemHtml(p)).join("");
  } catch {
    root.innerHTML = `<li><p class="status">could not load projects.</p></li>`;
  }
}

async function initHomeProjects() {
  const root = document.getElementById("home-projects");
  if (!root) return;
  try {
    const projects = await fetchProjects();
    const featured = projects.filter((p) => p.featured || p.home);
    if (!featured.length) throw new Error("empty");
    root.innerHTML = featured.map((p) => projectItemHtml(p, { featured: true })).join("");
  } catch {
    root.innerHTML = `<li><p class="status">could not load projects.</p></li>`;
  }
}

const MODAL_HTML = `
  <div class="resume-modal" id="resume-modal" hidden>
    <div class="resume-modal-backdrop" data-resume-close></div>
    <div class="resume-sheet" role="dialog" aria-modal="true" aria-labelledby="resume-title">
      <div class="resume-sheet-head">
        <div>
          <h2 id="resume-title">resume</h2>
          <p>same record, different things leading. pick whichever role you are hiring for.</p>
        </div>
        <button class="resume-close" type="button" data-resume-close aria-label="close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="resume-roles-wrap">
        <ul class="resume-roles"></ul>
      </div>
      <div class="resume-actions-row">
        <a class="btn-gold" id="resume-open" target="_blank" rel="noreferrer">open pdf</a>
        <a class="btn" id="resume-download">download</a>
        <a class="mail" href="mailto:abdulmalik@saintmalik.me">or just email me →</a>
      </div>
    </div>
  </div>`;

const LG_FILTER = `<svg class="lg-filter" aria-hidden="true" focusable="false"><filter id="lg" x="-15%" y="-15%" width="130%" height="130%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.0028 0.0055" numOctaves="1" seed="92" result="noise"/><feGaussianBlur in="noise" stdDeviation="4.5" result="soft"/><feDisplacementMap in="SourceGraphic" in2="soft" scale="230" xChannelSelector="R" yChannelSelector="G" result="dispR"/><feColorMatrix in="dispR" type="matrix" result="chanR" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feDisplacementMap in="SourceGraphic" in2="soft" scale="185" xChannelSelector="R" yChannelSelector="G" result="dispG"/><feColorMatrix in="dispG" type="matrix" result="chanG" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/><feDisplacementMap in="SourceGraphic" in2="soft" scale="140" xChannelSelector="R" yChannelSelector="G" result="dispB"/><feColorMatrix in="dispB" type="matrix" result="chanB" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/><feBlend in="chanR" in2="chanG" mode="screen" result="rg"/><feBlend in="rg" in2="chanB" mode="screen"/></filter></svg>`;

function injectClarity() {
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "rb5lzwkxst");
}

function boot() {
  if (!document.getElementById("lg")) {
    document.body.insertAdjacentHTML("afterbegin", LG_FILTER);
  }
  if (!document.getElementById("resume-modal")) {
    document.body.insertAdjacentHTML("beforeend", MODAL_HTML);
  }
  markActiveNav();
  let saved = "dark";
  try {
    saved = localStorage.getItem("theme") || document.documentElement.getAttribute("data-theme") || "dark";
  } catch (_) {}
  applyTheme(saved);
  bindThemeToggle();
  bindResumeModal();
  tickClock();
  setInterval(tickClock, 30000);
  bindKeys();
  if (document.body.dataset.page === "oss") initOpenSource();
  if (document.body.dataset.page === "talks") initTalks();
  if (document.body.dataset.page === "projects") initProjects();
  if (document.body.dataset.page === "home") {
    initWriting();
    initHomeProjects();
  }
  if (document.body.dataset.page === "resume") openResumeModal();
}

injectClarity();
document.addEventListener("DOMContentLoaded", boot);
