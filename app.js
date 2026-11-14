"use strict";

/* ==================================================================
 * yang-syzng · homepage —— 伪装成 VS Code 的个人主页
 *
 * 想改内容？只需要动下面第 1 部分的 FILES 对象，全部是纯文本。
 * ================================================================== */

/* ============ 1. 内容配置（改这里就能换内容） ============ */

const PROFILE = {
  user: "yang-syzng",
  github: "https://github.com/yang-syzng",
};

/* 访问人次计数（Abacus 免费计数服务）：
   换一个全局唯一的 namespace 即可独立从零计数 */
const COUNTER_NS = "yang-syzng-homepage";

const FILES = {
  "README.md": {
    lang: "md",
    content: `# yang-syzng · homepage

A personal homepage disguised as VS Code (Modern UI rounded style),
hosted on GitHub Pages.

## Tips

- Click files in the explorer or the tabs above to switch content
- Press Ctrl/Cmd + K for the command palette
- Press Ctrl + \` to open the terminal, type help for surprises
- The visitor count in about.ts is real (powered by Abacus)
- The bottom button in the activity bar toggles light / dark theme

## Customize

All content lives in the FILES object at the top of app.js — plain text
only, no frontend knowledge needed. Push and it redeploys automatically.`,
  },

  "about.ts": {
    lang: "ts",
    content: `// yang-syzng · Developer
// The page you are looking at is a website disguised as VS Code.

const me = {
  name: "yang-syzng",
  role: "Developer",
  location: "China",
  interests: ["coding", "open source", "tinkering"],
  motto: "Talk is cheap. Show me the code.",
};

function greeting(visitor: string): string {
  return \`Hi \${visitor}, you are visitor No.__VISITORS__, welcome to my homepage!\`;
}

console.log(greeting("friend"));

// TODO: replace the placeholders above with your own info
export default me;`,
  },

  "skills.json": {
    lang: "json",
    content: `{
  "languages": ["TypeScript", "Python", "Go", "Rust"],
  "frontend": ["React", "Vue", "Astro", "TailwindCSS"],
  "backend": ["Node.js", "FastAPI", "PostgreSQL"],
  "tools": ["Git", "Docker", "Linux", "Vite"],
  "learning": ["Rust", "AI Engineering"],
  "funFacts": [
    "This homepage is a web page disguised as VS Code",
    "Press Ctrl/Cmd + K to open the command palette",
    "Type help in the terminal for hidden commands"
  ]
}`,
  },

  "projects/vscode-homepage.ts": {
    lang: "ts",
    content: `export const project = {
  name: "vscode-homepage",
  desc: "The page you are browsing — a static site disguised as VS Code",
  stack: ["HTML", "CSS", "JavaScript"],
  link: "https://github.com/yang-syzng/homepage",
  highlight: "Press Ctrl/Cmd + K for the command palette",
};`,
  },

  "projects/todo-your-project.ts": {
    lang: "ts",
    content: `// TODO: replace this file with your own project
export const project = {
  name: "your-awesome-project",
  desc: "One sentence: what it does and what problem it solves",
  stack: ["TypeScript", "React", "Node.js"],
  link: "https://github.com/yang-syzng",
  status: "stars appreciated ✨",
};`,
  },

  "projects/side-quest.py": {
    lang: "py",
    content: `# TODO: replace this file with your own side project
project = {
    "name": "side-quest",
    "desc": "A little toy built for fun — a script or an experiment",
    "stack": ["Python"],
    "link": "https://github.com/yang-syzng",
}`,
  },

  "contact.md": {
    lang: "md",
    content: `# Contact

- GitHub: [@yang-syzng](https://github.com/yang-syzng)
- Email: [me@example.com](mailto:me@example.com) <!-- TODO: replace with yours -->
- Blog: coming soon…

> If you find this homepage fun, a star on GitHub is appreciated ✨`,
  },
};

/* 侧边栏文件树的展示顺序（文件夹里放子文件） */
const TREE = [
  { file: "README.md" },
  { file: "about.ts" },
  { file: "skills.json" },
  {
    folder: "projects",
    children: [
      "projects/vscode-homepage.ts",
      "projects/todo-your-project.ts",
      "projects/side-quest.py",
    ],
  },
  { file: "contact.md" },
];

const LANG_LABEL = { ts: "TypeScript", json: "JSON", py: "Python", md: "Markdown" };

/* ============ 2. 极简语法高亮 ============ */

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* 通用：按正则给一行上色，cls 是"第几个捕获组 => class"的映射 */
function annotate(line, re, cls) {
  let out = "";
  let last = 0;
  let m;
  re.lastIndex = 0;
  while ((m = re.exec(line))) {
    out += esc(line.slice(last, m.index));
    const gi = m.slice(1).findIndex((g) => g !== undefined);
    const c = (cls[gi] || "plain");
    out += `<span class="tk-${c}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex += 1;
  }
  return out + esc(line.slice(last));
}

/* ts / py 共用：字符串、注释、关键字、数字、类型、函数调用 */
const RE_CODE = new RegExp(
  [
    "(\\/\\/.*$|#.*$)", // 注释
    '("(?:\\\\.|[^"\\\\])*")(?=\\s*:)', // JSON / dict 的 key
    "((?:\"|'|`)(?:\\\\.|[^\"'`\\\\])*(?:\"|'|`))", // 字符串
    "\\b(const|let|var|function|return|export|default|import|from|type|interface|async|await|new|class|def|self)\\b",
    "\\b(true|false|null|undefined|None|True|False)\\b",
    "\\b\\d[\\d_.]*\\b",
    "\\b[A-Z][A-Za-z0-9_]*\\b",
    "[a-zA-Z_$][\\w$]*(?=\\s*\\()",
  ].join("|"),
  "g",
);
const CLS_CODE = ["cmt", "key", "str", "kw", "lit", "num", "type", "fn"];

function hlCode(line) {
  return annotate(line, RE_CODE, CLS_CODE);
}

function hlJson(line) {
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d[\d.eE+]*)/g;
  return annotate(line, re, ["key", "plain", "lit", "num"]);
}

function hlMd(line) {
  const re = /^(#{1,6} .*$)|(`[^`]*`)|(\[[^\]]*\]\([^)]*\))|(> .*$)|(\*[^*]+\*)|^(\s*[-*] )/g;
  return annotate(line, re, ["head", "str", "link", "cmt", "bold", "dim"]);
}

function highlightLine(line, lang) {
  if (lang === "json") return hlJson(line);
  if (lang === "md") return hlMd(line);
  return hlCode(line); // ts / py
}

/* ============ 3. 渲染：文件树 / 标签页 / 编辑器 / 小地图 ============ */

const $ = (id) => document.getElementById(id);
const treeEl = $("file-tree");
const tabsEl = $("tabs");
const editorEl = $("editor");
const minimapEl = $("minimap");
const breadcrumbEl = $("breadcrumb");

let openTabs = ["README.md", "about.ts"];
let activeFile = "about.ts";
let folderOpen = true;

function basename(p) {
  return p.split("/").pop();
}

/* git 状态角标：M = 已修改，U = 未跟踪（纯装饰，颜色同 VS Code） */
const GIT_STATUS = { "README.md": "M", "about.ts": "M" };
const GIT_COLOR = { M: "#e2c08d", U: "#73c991", A: "#73c991" };

function gitBadge(path) {
  const s = GIT_STATUS[path] || "U";
  return `<span class="git-status" style="color:${GIT_COLOR[s]}">${s}</span>`;
}

/* Seti 风格文件图标 */
function fileIcon(path) {
  if (path.endsWith(".ts"))
    return '<svg class="fico" viewBox="0 0 16 16"><text x="8" y="11.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="monospace" fill="#519aba">TS</text></svg>';
  if (path.endsWith(".json"))
    return '<svg class="fico" viewBox="0 0 16 16"><text x="8" y="11.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="monospace" fill="#cbcb41">{}</text></svg>';
  if (path.endsWith(".py"))
    return '<svg class="fico" viewBox="0 0 16 16"><text x="8" y="11.5" text-anchor="middle" font-size="8.5" font-weight="700" font-family="monospace" fill="#3572a5">PY</text></svg>';
  // README.md：蓝色 info 圆形图标（ⓘ，同 vscode-icons 主题对 README 的处理）
  if (/^readme\.md$/i.test(basename(path)))
    return '<svg class="fico" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#519aba"/><circle cx="8" cy="4.7" r="1.1" fill="#fff"/><rect x="7" y="6.6" width="2" height="5.1" rx="1" fill="#fff"/></svg>';
  // 其他 markdown：蓝圆 + M↓
  return '<svg class="fico" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" fill="#519aba"/><path d="M4 10.5V6.2l2.1 2.5L8.2 6.2v4.3" fill="none" stroke="#fff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.9 6.8v3.2M10.9 10l-1.3-1.35M10.9 10l1.3-1.35" fill="none" stroke="#fff" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function renderTree() {
  let html = '<div class="tree-root"><span class="arrow">▾</span> HOMEPAGE</div>';
  for (const node of TREE) {
    if (node.file) {
      html += treeItemHtml(node.file, false);
    } else {
      const arrow = folderOpen ? "▾" : "▸";
      html += `<div class="tree-item folder" data-folder="${node.folder}">
        <span class="caret">${arrow}</span><span class="ficon ficon-folder">▸</span> ${node.folder}</div>`;
      if (folderOpen) {
        for (const child of node.children) html += treeItemHtml(child, true);
      }
    }
  }
  treeEl.innerHTML = html;

  treeEl.querySelectorAll(".tree-item[data-file]").forEach((el) => {
    el.addEventListener("click", () => openFile(el.dataset.file));
  });
  treeEl.querySelectorAll(".tree-item.folder").forEach((el) => {
    el.addEventListener("click", () => {
      folderOpen = !folderOpen;
      renderTree();
    });
  });
}

function treeItemHtml(path, indent) {
  const active = path === activeFile ? " active" : "";
  return `<div class="tree-item${indent ? " indent" : ""}${active}" data-file="${path}">
    ${fileIcon(path)} ${basename(path)}</div>`;
}

function renderTabs() {
  tabsEl.innerHTML = openTabs
    .map((p) => {
      const active = p === activeFile ? " active" : "";
      return `<div class="tab${active}" data-file="${p}">
        ${fileIcon(p)} ${basename(p)} ${gitBadge(p)}
        <span class="tab-close" data-close="${p}" title="Close">✕</span></div>`;
    })
    .join("");

  tabsEl.querySelectorAll(".tab").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.dataset.close) return; // 关闭按钮单独处理
      openFile(el.dataset.file);
    });
  });
  tabsEl.querySelectorAll(".tab-close").forEach((el) => {
    el.addEventListener("click", () => {
      showToast("Nice try — this tab can't be closed. It's a permanent resident 😜");
    });
  });
}

function renderEditor() {
  const file = FILES[activeFile];
  if (!file) return;
  const lines = file.content.split("\n");

  // 最后一行非空代码作为"当前行"，放一个闪烁光标
  let cursorLine = lines.length - 1;
  while (cursorLine > 0 && lines[cursorLine].trim() === "") cursorLine -= 1;

  editorEl.innerHTML = lines
    .map((line, i) => {
      const isActive = i === cursorLine;
      const code =
        highlightLine(line, file.lang).replace("__VISITORS__", visitorsHtml()) +
        (isActive ? '<span class="cursor"></span>' : "");
      return `<div class="code-line${isActive ? " active-line" : ""}" style="--d:${Math.min(i * 16, 500)}ms">
        <span class="ln">${i + 1}</span><span class="lc">${code}</span></div>`;
    })
    .join("");

  renderMinimap(lines);
  breadcrumbEl.innerHTML =
    `<span>homepage</span><span>›</span>` +
    activeFile
      .split("/")
      .map((seg, i, arr) =>
        i === arr.length - 1
          ? `<span class="bc-file">${seg}</span>`
          : `<span>${seg}</span><span>›</span>`,
      )
      .join("");

  $("status-lang").textContent = LANG_LABEL[file.lang] || file.lang;
  $("titlebar-file").textContent = basename(activeFile);
}

function renderMinimap(lines) {
  minimapEl.innerHTML = lines
    .slice(0, 120)
    .map((line) => {
      const t = line.trim();
      if (!t) return '<div class="minimap-line" style="opacity:.12"></div>';
      let cls = "";
      if (/^(\/\/|#|<!--|>)/.test(t)) cls = "cmt";
      else if (/^["'`]/.test(t)) cls = "str";
      else if (/^(const|let|export|function|def|import)/.test(t)) cls = "kw";
      const w = Math.min(4 + t.length * 0.62, 52);
      return `<div class="minimap-line ${cls} ${t.length > 30 ? "long" : ""}" style="width:${w}px"></div>`;
    })
    .join("");
}

function openFile(path) {
  if (!FILES[path]) return;
  if (!openTabs.includes(path)) openTabs.push(path);
  activeFile = path;
  renderTree();
  renderTabs();
  renderEditor();
}

/* ============ 4. 命令面板 ============ */

const paletteEl = $("palette");
const paletteInput = $("palette-input");
const paletteList = $("palette-list");
let paletteSel = 0;
let paletteItems = [];

const COMMANDS = [
  { icon: "👤", label: "Open: about.ts (About me)", run: () => openFile("about.ts") },
  { icon: "🧰", label: "Open: skills.json (Skills)", run: () => openFile("skills.json") },
  { icon: "📦", label: "Open: projects/ (Projects)", run: () => openFile("projects/vscode-homepage.ts") },
  { icon: "📮", label: "Open: contact.md (Contact)", run: () => openFile("contact.md") },
  { icon: "📘", label: "Open: README.md (Guide)", run: () => openFile("README.md") },
  { icon: "🌗", label: "Toggle light / dark theme", hint: "theme", run: toggleTheme },
  { icon: "🖥️", label: "Toggle terminal", hint: "Ctrl + `", run: toggleTerminal },
  { icon: "🗂️", label: "Toggle sidebar", run: toggleSidebar },
  { icon: "🐙", label: "Open GitHub profile ↗", hint: PROFILE.github, run: () => window.open(PROFILE.github, "_blank") },
  { icon: "💡", label: "Show usage tips", run: () => showToast("Click files in the explorer to switch content. ⌘K / Ctrl+K opens the command palette, Ctrl + ` opens the terminal.") },
];

function openPalette() {
  paletteEl.classList.remove("hidden");
  paletteInput.value = "";
  updatePalette("");
  paletteInput.focus();
}

function closePalette() {
  paletteEl.classList.add("hidden");
}

function updatePalette(q) {
  const query = q.trim().toLowerCase();
  paletteItems = COMMANDS.filter(
    (c) => !query || (c.label + (c.hint || "")).toLowerCase().includes(query),
  );
  paletteSel = 0;
  renderPalette();
}

function renderPalette() {
  if (!paletteItems.length) {
    paletteList.innerHTML = '<li class="none">No matching commands</li>';
    return;
  }
  paletteList.innerHTML = paletteItems
    .map(
      (c, i) => `<li class="${i === paletteSel ? "selected" : ""}" data-i="${i}">
        <span class="p-icon">${c.icon}</span><span>${c.label}</span>
        ${c.hint ? `<span class="p-hint">${c.hint}</span>` : ""}</li>`,
    )
    .join("");
  paletteList.querySelectorAll("li[data-i]").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      paletteSel = Number(el.dataset.i);
      renderPalette();
    });
    el.addEventListener("click", () => {
      closePalette();
      paletteItems[Number(el.dataset.i)].run();
    });
  });
}

paletteInput.addEventListener("input", () => updatePalette(paletteInput.value));
paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    paletteSel = Math.min(paletteSel + 1, paletteItems.length - 1);
    renderPalette();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    paletteSel = Math.max(paletteSel - 1, 0);
    renderPalette();
  } else if (e.key === "Enter") {
    if (paletteItems[paletteSel]) {
      closePalette();
      paletteItems[paletteSel].run();
    }
  }
});
paletteEl.addEventListener("click", (e) => {
  if (e.target === paletteEl) closePalette();
});

/* ============ 5. 假终端 ============ */

const terminalEl = $("terminal");
const termBody = $("terminal-body");
const termInput = $("terminal-input");
const termHistory = [];

function toggleTerminal() {
  terminalEl.classList.toggle("hidden");
  if (!terminalEl.classList.contains("hidden")) {
    if (!termBody.dataset.welcomed) {
      termBody.dataset.welcomed = "1";
      termPrint("yang-syzng@homepage — bash (cosplay edition)", "t-banner");
      termPrint("Type <b>help</b> for available commands. Try <b>neofetch</b> for a surprise.", "t-dim");
      termPrint("");
    }
    termInput.focus();
    termBody.scrollTop = termBody.scrollHeight;
  }
}

function termPrint(html, cls) {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.innerHTML = html;
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
}

function runCommand(raw) {
  const cmdline = raw.trim();
  termPrint(
    `<span class="t-prompt">visitor@yang-syzng:~$</span> <span class="t-cmd">${esc(cmdline)}</span>`,
  );
  if (!cmdline) return;

  const [cmd, ...args] = cmdline.split(/\s+/);
  switch (cmd) {
    case "help":
      termPrint(
        [
          "Available commands:",
          "  help        show this help",
          "  whoami      who am I",
          "  ls          list all files",
          "  cat <file>  print a file (e.g. cat about.ts)",
          "  neofetch    system info (pretend)",
          "  github      open the GitHub profile",
          "  theme       toggle light / dark theme",
          "  echo / date / clear / sudo also work",
        ].join("\n"),
      );
      break;
    case "whoami":
      termPrint("visitor — a friendly passerby of this homepage. Welcome 👋");
      break;
    case "ls":
      termPrint(esc(Object.keys(FILES).join("  ")));
      break;
    case "cat": {
      const f = args[0];
      if (!f) termPrint("usage: cat <file> (run ls first)", "t-dim");
      else if (FILES[f])
        termPrint(esc(FILES[f].content).replaceAll("__VISITORS__", visitorsText()));
      else termPrint(`cat: ${esc(f)}: No such file`, "t-err");
      break;
    }
    case "neofetch":
      termPrint(
        [
          "    ██╗   ██╗     <span class='t-ok'>visitor</span>@<span class='t-ok'>yang-syzng</span>",
          "    ╚██╗ ██╔╝     -----------------",
          "     ╚████╔╝      <span class='t-dim'>OS:</span>      GitHub Pages",
          "      ╚██╔╝       <span class='t-dim'>Host:</span>    homepage",
          "       ██║        <span class='t-dim'>Shell:</span>   cosplay bash 5.0",
          "       ╚═╝        <span class='t-dim'>Theme:</span>   VS Code (currently " + document.documentElement.dataset.theme + ")",
          "                  <span class='t-dim'>Mood:</span>    tinkering 🔧",
        ].join("\n"),
      );
      break;
    case "github":
      termPrint("Opening the GitHub profile…", "t-ok");
      window.open(PROFILE.github, "_blank");
      break;
    case "theme":
      toggleTheme();
      termPrint("Theme switched ✅", "t-ok");
      break;
    case "echo":
      termPrint(esc(args.join(" ")));
      break;
    case "date":
      termPrint(esc(new Date().toString()));
      break;
    case "sudo":
      termPrint("visitor is not in the sudoers file. This incident will be reported. 😏", "t-err");
      break;
    case "clear":
      termBody.innerHTML = "";
      break;
    default:
      termPrint(`bash: ${esc(cmd)}: command not found (try <b>help</b>)`, "t-err");
  }
}

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = termInput.value;
    if (raw.trim()) termHistory.push(raw.trim());
    termInput.value = "";
    runCommand(raw);
  } else if (e.key === "ArrowUp" && termHistory.length) {
    termInput.value = termHistory[termHistory.length - 1];
    e.preventDefault();
  }
});

/* ============ 6. 主题 / 侧栏 / 通知 ============ */

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hp-theme", theme);
  $("status-theme").textContent = theme === "dark" ? "🌚" : "🌝";
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

function toggleSidebar() {
  $("sidebar").classList.toggle("closed");
}

let toastTimer = null;
function showToast(html) {
  $("toast-text").innerHTML = html;
  $("toast").classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 6000);
}

$("act-theme").addEventListener("click", toggleTheme);
$("status-theme").addEventListener("click", toggleTheme);
$("act-files").addEventListener("click", toggleSidebar);
$("act-search").addEventListener("click", openPalette);
$("btn-palette-hint").addEventListener("click", openPalette);
$("act-terminal").addEventListener("click", toggleTerminal);
$("terminal-hide").addEventListener("click", toggleTerminal);
$("status-branch").addEventListener("click", () =>
  showToast("Branch main is protected: this is a homepage, not a PR 🛡️"),
);
$("toast-close").addEventListener("click", () => $("toast").classList.add("hidden"));

/* ============ 6.5 访问人次（静态页用免费计数服务 Abacus） ============ */

let visitorCount = null;

function visitorsText() {
  return visitorCount == null ? "…" : String(visitorCount);
}

function visitorsHtml() {
  return `<span class="tk-visitors" data-visitors>${visitorsText()}</span>`;
}

function updateVisitorsInDom() {
  document.querySelectorAll("[data-visitors]").forEach((el) => {
    el.textContent = visitorsText();
  });
}

async function loadVisitors() {
  // 先展示上次缓存的数量，避免闪"…"
  const cached = parseInt(localStorage.getItem("hp-visitors") || "", 10);
  if (Number.isFinite(cached) && cached > 0) {
    visitorCount = cached;
    updateVisitorsInDom();
  }
  try {
    const res = await fetch(
      "https://abacus.jasoncameron.dev/hit/" + COUNTER_NS + "/visitors",
      { cache: "no-store" },
    );
    const text = (await res.text()).trim();
    // Abacus 返回 {"value":N}，兼容纯文本数字
    let n = NaN;
    try {
      n = parseInt(JSON.parse(text).value, 10);
    } catch {
      n = parseInt(text, 10);
    }
    if (!Number.isFinite(n) || n <= 0) throw new Error("bad count");
    visitorCount = n;
    localStorage.setItem("hp-visitors", String(n));
  } catch {
    // 计数服务不可达（离线 / 广告拦截）且没有缓存：退化为本地浏览器计数
    if (visitorCount == null) {
      const n = (parseInt(localStorage.getItem("hp-local-visits") || "0", 10) || 0) + 1;
      localStorage.setItem("hp-local-visits", String(n));
      visitorCount = n;
    }
  }
  updateVisitorsInDom();
}

/* ============ 7. 快捷键 & 初始化 ============ */

document.addEventListener("keydown", (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === "k") {
    e.preventDefault();
    paletteEl.classList.contains("hidden") ? openPalette() : closePalette();
  } else if (e.ctrlKey && e.code === "Backquote") {
    e.preventDefault();
    toggleTerminal();
  } else if (e.key === "Escape") {
    closePalette();
  }
});

(function init() {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (!isMac) $("kbd-hint").textContent = "Ctrl+K";

  applyTheme(localStorage.getItem("hp-theme") || "dark");
  renderTree();
  renderTabs();
  renderEditor();
  loadVisitors();

  // 手机上默认收起侧栏
  if (window.innerWidth <= 860) $("sidebar").classList.add("closed");

  setTimeout(() => {
    showToast(
      "👋 Welcome to my homepage!<br>Press <b>⌘K / Ctrl+K</b> for the command palette, or <b>Ctrl + `</b> for the terminal.",
    );
  }, 700);
})();
