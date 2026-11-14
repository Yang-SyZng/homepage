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

/* ============ 1.5 界面文案中英双语 ============ */

let lang = localStorage.getItem("hp-lang") || "en";
const T = () => I18N[lang];

const I18N = {
  en: {
    explorer: "Explorer",
    outline: "Outline",
    paletteBtn: "Palette",
    palettePlaceholder: "Type a command or search…",
    noMatch: "No matching commands",
    navigate: "navigate",
    run: "run",
    close: "close",
    termPlaceholder: "Type help for available commands…",
    cmdAbout: "Open: about.ts (About me)",
    cmdSkills: "Open: skills.json (Skills)",
    cmdProjects: "Open: projects/ (Projects)",
    cmdContact: "Open: contact.md (Contact)",
    cmdReadme: "Open: README.md (Guide)",
    cmdTerm: "Toggle terminal",
    cmdSidebar: "Toggle sidebar",
    cmdGithub: "Open GitHub profile ↗",
    cmdTips: "Show usage tips",
    tipsText: "Click files in the explorer to switch content. ⌘K / Ctrl+K opens the command palette, Ctrl + ` opens the terminal.",
    toastWelcome: "👋 Welcome to my homepage!<br>Press <b>⌘K / Ctrl+K</b> for the command palette, or <b>Ctrl + `</b> for the terminal.",
    toastTabClose: "Nice try — this tab can't be closed. It's a permanent resident 😜",
    toastBranch: "Branch main is protected: this is a homepage, not a PR 🛡️",
    toastLang: "🌐 Language switched to English",
    actFiles: "Explorer",
    actSearch: "Search / Command Palette",
    actTerminal: "Terminal",
    actSettings: "Settings",
    openPalette: "Open command palette",
    toggleTheme: "Toggle theme",
    branch: "Branch",
    remote: "Remote",
    noProblems: "0 problems",
    notifications: "Notifications",
    closeTerminal: "Close Terminal",
    tabClose: "Close",
    themeItem: "Toggle Light / Dark Theme",
    termBanner: "yang-syzng@homepage — bash (cosplay edition)",
    termBannerHint: "Type <b>help</b> for available commands. Try <b>neofetch</b> for a surprise.",
    helpText: [
      "Available commands:",
      "  help        show this help",
      "  whoami      who am I",
      "  ls          list all files",
      "  cat <file>  print a file (e.g. cat about.ts)",
      "  neofetch    system info (pretend)",
      "  github      open the GitHub profile",
      "  theme       toggle light / dark theme",
      "  echo / date / clear / sudo also work",
    ],
    whoami: "visitor — a friendly passerby of this homepage. Welcome 👋",
    catUsage: "usage: cat <file> (run ls first)",
    catMissing: (f) => `cat: ${esc(f)}: No such file`,
    shellValue: "cosplay bash 5.0",
    mood: "tinkering 🔧",
    themeNow: (v) => `VS Code (currently ${v})`,
    githubOpening: "Opening the GitHub profile…",
    themeSwitched: "Theme switched ✅",
    sudo: "visitor is not in the sudoers file. This incident will be reported. 😏",
    cmdNotFound: (c) => `bash: ${esc(c)}: command not found (try <b>help</b>)`,
    previewTitle: "Preview",
    openPreview: "Open Preview to the Side",
    closePreview: "Close Preview",
    qoPlaceholder: "Search files by name (append : to go to line, append @ to go to symbol)",
    qoGoFile: "Go to File",
    qoRunCommands: "Show and Run Commands",
    qoSearchText: "Search Text",
    qoChat: "Open Quick Chat",
    qoSymbol: "Go to Symbol in Editor",
    qoDebug: "Start Debugging",
    qoTask: "Run Task",
    qoMore: "More",
    qoRecent: "Recently opened",
    qoToastSearch: "🔍 Text search is decorative here — try Ctrl/Cmd + K",
    qoToastChat: "💬 No chat included — this homepage runs on good vibes",
    qoToastSymbol: "🔎 The symbols are shy today",
    qoToastDebug: "🐛 Nothing to debug — it just works",
    qoToastTask: "📋 All tasks done. Go take a break",
    qoToastMore: "🚪 You found the secret door",
  },
  zh: {
    explorer: "资源管理器",
    outline: "大纲",
    paletteBtn: "命令面板",
    palettePlaceholder: "输入命令或搜索…",
    noMatch: "没有匹配的命令",
    navigate: "选择",
    run: "执行",
    close: "关闭",
    termPlaceholder: "输入 help 查看可用命令…",
    cmdAbout: "打开：about.ts（关于我）",
    cmdSkills: "打开：skills.json（技能点）",
    cmdProjects: "打开：projects/（项目）",
    cmdContact: "打开：contact.md（联系方式）",
    cmdReadme: "打开：README.md（使用说明）",
    cmdTerm: "打开 / 关闭终端",
    cmdSidebar: "显示 / 隐藏侧边栏",
    cmdGithub: "打开 GitHub 主页 ↗",
    cmdTips: "查看使用提示",
    tipsText: "点击左侧文件树切换内容；⌘K / Ctrl+K 打开命令面板；Ctrl + ` 打开终端。",
    toastWelcome: "👋 欢迎来到我的主页！<br>按 <b>⌘K / Ctrl+K</b> 唤起命令面板，或按 <b>Ctrl + `</b> 打开终端。",
    toastTabClose: "这个页面关不掉哦，它已经是本页面的精神股东了 😜",
    toastBranch: "分支 main 受到保护：这是主页，不是 PR 🛡️",
    toastLang: "🌐 语言已切换为中文",
    actFiles: "资源管理器",
    actSearch: "搜索 / 命令面板",
    actTerminal: "终端",
    actSettings: "设置",
    openPalette: "打开命令面板",
    toggleTheme: "切换主题",
    branch: "分支",
    remote: "远程",
    noProblems: "0 个问题",
    notifications: "通知",
    closeTerminal: "关闭终端",
    tabClose: "关闭",
    themeItem: "切换亮色 / 暗色主题",
    termBanner: "yang-syzng@homepage — bash（伪装版）",
    termBannerHint: "输入 <b>help</b> 查看可用命令，输入 <b>neofetch</b> 惊喜一下",
    helpText: [
      "可用命令：",
      "  help        显示本帮助",
      "  whoami      我是谁",
      "  ls          列出所有文件",
      "  cat <file>  查看某个文件（如 cat about.ts）",
      "  neofetch    系统信息（假装的）",
      "  github      打开 GitHub 主页",
      "  theme       切换亮色 / 暗色主题",
      "  echo/date/clear/sudo 都能用",
    ],
    whoami: "visitor —— 一位恰好路过 homepage 的朋友。欢迎 👋",
    catUsage: "用法：cat <file>（先 ls 看看有什么）",
    catMissing: (f) => `cat: ${esc(f)}: 没有那个文件`,
    shellValue: "伪装版 bash 5.0",
    mood: "折腾中 🔧",
    themeNow: (v) => `VS Code（目前是${v}）`,
    githubOpening: "正在打开 GitHub 主页…",
    themeSwitched: "主题已切换 ✅",
    sudo: "visitor 不在 sudoers 文件中。此事件将被报告。😏",
    cmdNotFound: (c) => `bash: ${esc(c)}: command not found（试试 <b>help</b>）`,
    previewTitle: "预览",
    openPreview: "打开侧边预览",
    closePreview: "关闭预览",
    qoPlaceholder: "按名称搜索文件（追加：转到行，追加 @ 转到符号）",
    qoGoFile: "转到文件",
    qoRunCommands: "显示并运行命令",
    qoSearchText: "搜索文本",
    qoChat: "打开快速聊天",
    qoSymbol: "转到编辑器中的符号",
    qoDebug: "开始调试",
    qoTask: "运行任务",
    qoMore: "更多",
    qoRecent: "最近打开",
    qoToastSearch: "🔍 文本搜索是装饰性的，试试 Ctrl/Cmd + K",
    qoToastChat: "💬 没有接入聊天，本主页靠意念运行",
    qoToastSymbol: "🔎 符号们今天都很害羞",
    qoToastDebug: "🐛 无 bug 可调，请放心食用",
    qoToastTask: "📋 任务清单已清空，去晒晒太阳吧",
    qoToastMore: "🚪 你发现了秘密之门",
  },
};

const FILES_EN = {
  "README.md": {
    lang: "md",
    content: `# yang-syzng · homepage

A personal homepage

## Tips

- Click files in the explorer or the tabs above to switch content
- Press Ctrl/Cmd + K for the command palette
- Press Ctrl + \` to open the terminal, type help for surprises
- The visitor count in about.ts is real
- The bottom button in the activity bar toggles light / dark theme`,
  },

  "about.ts": {
    lang: "ts",
    content: `// yang-syzng · Developer

const me = {
  name: "yang-syzng",
  role: "Developer",
  location: "Hong Kong",
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

/* 中文版内容：切换语言时使用。编辑内容请两个版本一起改 */
const FILES_ZH = {
  "README.md": {
    lang: "md",
    content: `# yang-syzng · 主页

一个个人主页

## 玩法

- 点击左侧文件树或顶部标签页切换内容
- 按 Ctrl/Cmd + K 唤起命令面板
- 按 Ctrl + \` 打开终端，输入 help 有惊喜
- about.ts 里的访客计数是真实的
- 活动栏最下面的按钮可以切换亮色 / 暗色主题`,
  },

  "about.ts": {
    lang: "ts",
    content: `// yang-syzng · 开发者

const me = {
  name: "yang-syzng",
  role: "开发者",
  location: "Hong Kong",
  interests: ["编程", "开源", "折腾"],
  motto: "Talk is cheap. Show me the code.",
};

function greeting(visitor: string): string {
  return \`Hi \${visitor}, 你是第 __VISITORS__ 位访客, 欢迎来到我的主页!\`;
}

console.log(greeting("朋友"));

// TODO: 把上面的占位信息换成你自己的
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
    "这个主页是一只伪装成 VS Code 的网页",
    "按 Ctrl/Cmd + K 可以唤起命令面板",
    "在终端里输入 help 能看到隐藏命令"
  ]
}`,
  },

  "projects/vscode-homepage.ts": {
    lang: "ts",
    content: `export const project = {
  name: "vscode-homepage",
  desc: "你正在看的这个主页 —— 一个伪装成 VS Code 的纯静态网页",
  stack: ["HTML", "CSS", "JavaScript"],
  link: "https://github.com/yang-syzng/homepage",
  highlight: "按 Ctrl/Cmd + K 试试命令面板",
};`,
  },

  "projects/todo-your-project.ts": {
    lang: "ts",
    content: `// TODO: 把这个文件换成你自己的项目
export const project = {
  name: "your-awesome-project",
  desc: "一句话说清这个项目做了什么、解决了什么问题",
  stack: ["TypeScript", "React", "Node.js"],
  link: "https://github.com/yang-syzng",
  status: "求 star ✨",
};`,
  },

  "projects/side-quest.py": {
    lang: "py",
    content: `# TODO: 把这个文件换成你自己的小项目
project = {
    "name": "side-quest",
    "desc": "工作之外写的小玩具，可以是一个脚本或实验",
    "stack": ["Python"],
    "link": "https://github.com/yang-syzng",
}`,
  },

  "contact.md": {
    lang: "md",
    content: `# 联系方式

- GitHub: [@yang-syzng](https://github.com/yang-syzng)
- Email: [me@example.com](mailto:me@example.com) <!-- TODO: 换成你的邮箱 -->
- Blog: 敬请期待…

> 觉得这个主页有趣的话，欢迎去 GitHub 点个 star ✨`,
  },
};

let FILES = FILES_EN;

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
const tabsScrollEl = $("tabs-scroll");
const tabsActionsEl = $("tabs-actions");
const editorEl = $("editor");
const minimapEl = $("minimap");
const breadcrumbEl = $("breadcrumb");

let openTabs = ["README.md", "about.ts"];
let activeFile = "about.ts";
let folderOpen = true;
let treeRootOpen = true;
let mdPreviewOpen = false;
const OPEN_PREVIEW_ICON = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 1H4.5C3.122 1 2 2.122 2 3.5V6.276C2.319 6.162 2.653 6.089 3 6.05V3.499C3 2.672 3.673 1.999 4.5 1.999H8.5V13.385L9.557 14.442C9.714 14.591 9.831 14.786 9.907 14.999H13.5C14.878 14.999 16 13.877 16 12.499V3.5C16 2.122 14.878 1 13.5 1ZM15 12.5C15 13.327 14.327 14 13.5 14H9.5V2H13.5C14.327 2 15 2.673 15 3.5V12.5ZM6.29 12.59C6.74 12.01 7 11.28 7 10.5C7 8.57 5.43 7 3.5 7C1.57 7 0 8.57 0 10.5C0 12.43 1.57 14 3.5 14C4.28 14 5.01 13.74 5.59 13.29L8.15 15.85C8.24 15.95 8.37 16 8.5 16C8.63 16 8.76 15.95 8.85 15.85C9.05 15.66 9.05 15.34 8.85 15.15L6.29 12.59ZM5.5 12C5.36 12.19 5.19 12.36 5 12.5C4.59 12.81 4.06 13 3.5 13C2.12 13 1 11.88 1 10.5C1 9.12 2.12 8 3.5 8C4.88 8 6 9.12 6 10.5C6 11.06 5.81 11.59 5.5 12Z"/></svg>`;

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
  const rootArrow = treeRootOpen ? "▾" : "▸";
  let html = `<div class="tree-root"><span class="arrow">${rootArrow}</span> HOMEPAGE</div>`;
  html += `<div class="tree-children ${treeRootOpen ? "" : "closed"}"><div class="tree-children-inner">`;
  for (const node of TREE) {
    if (node.file) {
      html += treeItemHtml(node.file, false);
    } else {
      const arrow = folderOpen ? "▾" : "▸";
      html += `<div class="tree-item folder" data-folder="${node.folder}">
        <span class="caret">${arrow}</span> ${node.folder}</div>`;
      html += `<div class="tree-children subtree ${folderOpen ? "" : "closed"}"><div class="tree-children-inner">`;
      for (const child of node.children) html += treeItemHtml(child, true);
      html += `</div></div>`;
    }
  }
  html += `</div></div>`;
  treeEl.innerHTML = html;

  // 折叠/展开只切换 class（保留 DOM 才有过渡动画）
  treeEl.querySelector(".tree-root").addEventListener("click", () => {
    treeRootOpen = !treeRootOpen;
    treeEl.querySelector(".tree-children").classList.toggle("closed", !treeRootOpen);
    treeEl.querySelector(".tree-root .arrow").textContent = treeRootOpen ? "▾" : "▸";
  });
  treeEl.querySelectorAll(".tree-item[data-file]").forEach((el) => {
    el.addEventListener("click", () => openFile(el.dataset.file));
  });
  treeEl.querySelectorAll(".tree-item.folder").forEach((el) => {
    el.addEventListener("click", () => {
      folderOpen = !folderOpen;
      treeEl.querySelector(".tree-children.subtree").classList.toggle("closed", !folderOpen);
      el.querySelector(".caret").textContent = folderOpen ? "▾" : "▸";
    });
  });
}

function treeItemHtml(path, indent) {
  const active = path === activeFile ? " active" : "";
  return `<div class="tree-item${indent ? " indent" : ""}${active}" data-file="${path}">
    ${fileIcon(path)} ${basename(path)}</div>`;
}

function renderTabs() {
  tabsScrollEl.innerHTML = openTabs
    .map((p) => {
      const active = p === activeFile ? " active" : "";
      return `<div class="tab${active}" data-file="${p}">
        ${fileIcon(p)} ${basename(p)} ${gitBadge(p)}
        <span class="tab-close" data-close="${p}" title="${T().tabClose}">✕</span></div>`;
    })
    .join("");

  tabsScrollEl.querySelectorAll(".tab").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target.dataset.close) return; // 关闭按钮单独处理
      openFile(el.dataset.file);
    });
  });
  tabsScrollEl.querySelectorAll(".tab-close").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      closeTab(el.dataset.close);
    });
  });

  // 预览开关按钮（仅 md 文件时显示）
  tabsActionsEl.innerHTML = activeFile.endsWith(".md")
    ? `<button class="tab-action ${mdPreviewOpen ? "active" : ""}" id="md-preview-btn" title="${T().openPreview}">${OPEN_PREVIEW_ICON}</button>`
    : "";
  const previewBtn = tabsActionsEl.querySelector("#md-preview-btn");
  if (previewBtn) previewBtn.addEventListener("click", toggleMdPreview);
}

/* 关闭标签页（同 VS Code：关闭激活标签后激活相邻标签） */
function closeTab(path) {
  const idx = openTabs.indexOf(path);
  if (idx === -1) return;
  openTabs.splice(idx, 1);
  if (!openTabs.length) openTabs = ["README.md"];
  if (activeFile === path || !openTabs.includes(activeFile)) {
    activeFile = openTabs[Math.min(idx, openTabs.length - 1)];
  }
  renderTree();
  renderTabs();
  renderEditor();
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
  $("cc-file").textContent = basename(activeFile);
  updatePreviewPane();
}

/* ---- 小地图：真实微缩代码渲染（同 VS Code minimap），随编辑器滚动联动 ---- */

const editorAreaEl = editorEl.parentElement;

function updateMinimapSlider() {
  const slider = document.getElementById("mm-slider");
  const content = minimapEl.querySelector(".mm-content");
  if (!slider || !content) return;
  const viewRatio = Math.min(
    1,
    editorAreaEl.clientHeight / Math.max(editorAreaEl.scrollHeight, 1),
  );
  const sliderH = Math.max(viewRatio * content.offsetHeight, 24);
  const scrollRatio =
    editorAreaEl.scrollTop / Math.max(editorAreaEl.scrollHeight - editorAreaEl.clientHeight, 1);
  slider.style.height = sliderH + "px";
  slider.style.top = scrollRatio * Math.max(content.offsetHeight - sliderH, 0) + "px";
}

function renderMinimap(lines) {
  const file = FILES[activeFile];
  const body = lines
    .map((line) => `<div class="mm-line">${highlightLine(line, file.lang) || "&nbsp;"}</div>`)
    .join("");
  minimapEl.innerHTML =
    `<div class="mm-content">${body}</div><div class="mm-slider" id="mm-slider"></div>`;
  updateMinimapSlider();
}

editorAreaEl.addEventListener("scroll", updateMinimapSlider);
window.addEventListener("resize", updateMinimapSlider);

/* 点击跳转 + 拖动滑块（同 VS Code：点空白滑块居中，按住可拖） */
let mmDrag = null;
minimapEl.addEventListener("pointerdown", (e) => {
  const slider = document.getElementById("mm-slider");
  const content = minimapEl.querySelector(".mm-content");
  if (!slider || !content) return;
  const rect = minimapEl.getBoundingClientRect();
  const range = Math.max(content.offsetHeight - slider.offsetHeight, 0);
  const scrollable = Math.max(editorAreaEl.scrollHeight - editorAreaEl.clientHeight, 0);
  if (range <= 0 || scrollable <= 0) return;

  let top = Math.min(Math.max(parseFloat(slider.style.top) || 0, 0), range);
  if (!e.target.closest("#mm-slider")) {
    // 点在滑块外：滑块中心对准点击位置
    top = Math.min(Math.max(e.clientY - rect.top - slider.offsetHeight / 2, 0), range);
    editorAreaEl.scrollTop = (top / range) * scrollable;
  }
  mmDrag = { startY: e.clientY, startTop: top, range, scrollable };
  minimapEl.classList.add("dragging");
  minimapEl.setPointerCapture(e.pointerId);
  e.preventDefault();
});
minimapEl.addEventListener("pointermove", (e) => {
  if (!mmDrag) return;
  const top = Math.min(Math.max(mmDrag.startTop + (e.clientY - mmDrag.startY), 0), mmDrag.range);
  editorAreaEl.scrollTop = (top / mmDrag.range) * mmDrag.scrollable;
});
minimapEl.addEventListener("pointerup", () => {
  mmDrag = null;
  minimapEl.classList.remove("dragging");
});
minimapEl.addEventListener("pointercancel", () => {
  mmDrag = null;
  minimapEl.classList.remove("dragging");
});

/* ---- Markdown 渲染 + 侧边分屏预览 ---- */

function renderMarkdown(md) {
  md = md.replace(/<!--[\s\S]*?-->/g, "");
  const inline = (s) =>
    esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  let html = "";
  let inList = false;
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    const li = line.match(/^-\s+(.*)$/);
    if (h) {
      if (inList) { html += "</ul>"; inList = false; }
      const lvl = Math.min(h[1].length, 3);
      html += `<h${lvl}>${inline(h[2])}</h${lvl}>`;
    } else if (li) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${inline(li[1])}</li>`;
    } else {
      if (inList) { html += "</ul>"; inList = false; }
      if (!line.trim()) continue;
      if (line.startsWith(">")) html += `<blockquote>${inline(line.replace(/^>\s?/, ""))}</blockquote>`;
      else html += `<p>${inline(line)}</p>`;
    }
  }
  if (inList) html += "</ul>";
  return html;
}

function toggleMdPreview() {
  mdPreviewOpen = !mdPreviewOpen;
  renderTabs();
  updatePreviewPane();
}

function updatePreviewPane() {
  const group = $("group-preview");
  const show = mdPreviewOpen && activeFile.endsWith(".md");
  group.classList.toggle("hidden", !show);
  if (!show) return;
  $("preview-tab-label").textContent = `${T().previewTitle} ${basename(activeFile)}`;
  $("preview-body").innerHTML = renderMarkdown(FILES[activeFile].content);
  $("preview-body").scrollTop = 0;
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

function buildCommands() {
  const m = T();
  return [
    { icon: "👤", label: m.cmdAbout, run: () => openFile("about.ts") },
    { icon: "🧰", label: m.cmdSkills, run: () => openFile("skills.json") },
    { icon: "📦", label: m.cmdProjects, run: () => openFile("projects/vscode-homepage.ts") },
    { icon: "📮", label: m.cmdContact, run: () => openFile("contact.md") },
    { icon: "📘", label: m.cmdReadme, run: () => openFile("README.md") },
    { icon: "🖥️", label: m.cmdTerm, hint: "Ctrl + `", run: toggleTerminal },
    { icon: "🗂️", label: m.cmdSidebar, run: toggleSidebar },
    { icon: "🐙", label: m.cmdGithub, hint: PROFILE.github, run: () => window.open(PROFILE.github, "_blank") },
    { icon: "💡", label: m.cmdTips, run: () => showToast(T().tipsText) },
  ];
}

let COMMANDS = buildCommands();

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
    paletteList.innerHTML = `<li class="none">${T().noMatch}</li>`;
    return;
  }
  paletteList.innerHTML = paletteItems
    .map(
      (c, i) => `<li class="${i === paletteSel ? "selected" : ""}" data-i="${i}">
        <span class="p-icon">${c.icon}</span><span>${c.label}</span>
        ${c.hint ? `<span class="p-hint">${c.hint}</span>` : ""}</li>`,
    )
    .join("");
}

/* 事件委托：悬停只切换高亮（不重建 DOM，否则会吃掉点击）；点击执行 */
paletteList.addEventListener("mouseover", (e) => {
  const li = e.target.closest("li[data-i]");
  if (!li || Number(li.dataset.i) === paletteSel) return;
  paletteSel = Number(li.dataset.i);
  paletteList.querySelectorAll("li.selected").forEach((x) => x.classList.remove("selected"));
  li.classList.add("selected");
});
paletteList.addEventListener("click", (e) => {
  const li = e.target.closest("li[data-i]");
  if (!li || li.classList.contains("none")) return;
  closePalette();
  const item = paletteItems[Number(li.dataset.i)];
  if (item) item.run();
});

/* ============ 4.5 Command Center（顶部搜索栏 + 快速打开） ============ */

const qoEl = $("quick-open");
const qoInput = $("qo-input");
const qoList = $("qo-list");
let qoSel = 0;
let qoFiles = [];

function isMacEnv() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}

function openQuickOpen() {
  qoEl.classList.remove("hidden");
  $("command-center").classList.add("open");
  qoInput.value = "";
  qoSel = 0;
  renderQo();
  qoInput.focus();
}

function closeQuickOpen() {
  qoEl.classList.add("hidden");
  $("command-center").classList.remove("open");
}

function qoAct(act) {
  const m = T();
  if (act === "commands") {
    closeQuickOpen();
    openPalette();
    return;
  }
  const toasts = {
    search: m.qoToastSearch,
    chat: m.qoToastChat,
    symbol: m.qoToastSymbol,
    debug: m.qoToastDebug,
    task: m.qoToastTask,
    more: m.qoToastMore,
  };
  if (toasts[act]) showToast(toasts[act]);
}

function renderQo() {
  const m = T();
  const q = qoInput.value.trim().toLowerCase();
  const mod = isMacEnv() ? "⌘" : "Ctrl";
  qoFiles = Object.keys(FILES).filter((p) => !q || basename(p).toLowerCase().includes(q));

  const modes = [
    { label: m.qoGoFile, keys: [mod, "P"], act: "focus" },
    { label: m.qoRunCommands, keys: ["⇧", mod, "P"], act: "commands" },
    { label: m.qoSearchText, hint: "%", act: "search" },
    { label: m.qoChat, keys: ["⇧", isMacEnv() ? "⌥" : "Alt", mod, "L"], act: "chat" },
    { label: m.qoSymbol, hint: "@", act: "symbol" },
    { label: m.qoDebug, hint: "debug", act: "debug" },
    { label: m.qoTask, hint: "task", act: "task" },
    { label: m.qoMore, hint: "?", act: "more" },
  ];

  let html = modes
    .map(
      (mo, i) => `<div class="qo-row ${i === 0 && !q ? "selected" : ""}" data-act="${mo.act}">
        <span>${mo.label}</span>
        ${mo.hint ? `<span class="qo-hint">${mo.hint}</span>` : ""}
        ${mo.keys ? `<span class="qo-keys">${mo.keys.map((k) => `<kbd class="qo-kbd">${k}</kbd>`).join("")}</span>` : ""}
      </div>`,
    )
    .join("");
  html += '<div class="qo-sep"></div>';
  html += qoFiles
    .map(
      (p, i) => `<div class="qo-row qo-file-row ${i === qoSel ? "selected" : ""}" data-file="${p}">
        ${fileIcon(p)} <span>${basename(p)}</span>
        ${i === 0 ? `<span class="qo-hint">${m.qoRecent}</span>` : ""}
      </div>`,
    )
    .join("");
  qoList.innerHTML = html;
}

qoInput.addEventListener("input", renderQo);
qoInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    qoSel = Math.min(qoSel + 1, Math.max(qoFiles.length - 1, 0));
    renderQo();
    qoInput.focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    qoSel = Math.max(qoSel - 1, 0);
    renderQo();
    qoInput.focus();
  } else if (e.key === "Enter") {
    const f = qoFiles[qoSel];
    if (f) {
      openFile(f);
      closeQuickOpen();
    }
  } else if (e.key === "Escape") {
    closeQuickOpen();
  }
});
qoList.addEventListener("click", (e) => {
  const fileRow = e.target.closest(".qo-file-row");
  if (fileRow) {
    openFile(fileRow.dataset.file);
    closeQuickOpen();
    return;
  }
  const modeRow = e.target.closest(".qo-row[data-act]");
  if (modeRow) qoAct(modeRow.dataset.act);
});
qoList.addEventListener("mouseover", (e) => {
  const fileRow = e.target.closest(".qo-file-row");
  if (!fileRow) return;
  qoSel = qoFiles.indexOf(fileRow.dataset.file);
  qoList.querySelectorAll(".qo-file-row.selected").forEach((x) => x.classList.remove("selected"));
  fileRow.classList.add("selected");
});
$("command-center").addEventListener("click", openQuickOpen);
document.addEventListener("click", (e) => {
  if (qoEl.classList.contains("hidden")) return;
  if (!qoEl.contains(e.target) && !e.target.closest("#command-center")) closeQuickOpen();
});

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
      termPrint(T().termBanner, "t-banner");
      termPrint(T().termBannerHint, "t-dim");
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

  const m = T();
  const [cmd, ...args] = cmdline.split(/\s+/);
  switch (cmd) {
    case "help":
      termPrint(m.helpText.join("\n"));
      break;
    case "whoami":
      termPrint(m.whoami);
      break;
    case "ls":
      termPrint(esc(Object.keys(FILES).join("  ")));
      break;
    case "cat": {
      const f = args[0];
      if (!f) termPrint(m.catUsage, "t-dim");
      else if (FILES[f])
        termPrint(esc(FILES[f].content).replaceAll("__VISITORS__", visitorsText()));
      else termPrint(m.catMissing(f), "t-err");
      break;
    }
    case "neofetch":
      termPrint(
        [
          "    ██╗   ██╗     <span class='t-ok'>visitor</span>@<span class='t-ok'>yang-syzng</span>",
          "    ╚██╗ ██╔╝     -----------------",
          "     ╚████╔╝      <span class='t-dim'>OS:</span>      GitHub Pages",
          "      ╚██╔╝       <span class='t-dim'>Host:</span>    homepage",
          "       ██║        <span class='t-dim'>Shell:</span>   " + m.shellValue,
          "       ╚═╝        <span class='t-dim'>Theme:</span>   " + m.themeNow(document.documentElement.dataset.theme),
          "                  <span class='t-dim'>Mood:</span>    " + m.mood,
        ].join("\n"),
      );
      break;
    case "github":
      termPrint(m.githubOpening, "t-ok");
      window.open(PROFILE.github, "_blank");
      break;
    case "theme":
      toggleTheme();
      termPrint(m.themeSwitched, "t-ok");
      break;
    case "echo":
      termPrint(esc(args.join(" ")));
      break;
    case "date":
      termPrint(esc(new Date().toString()));
      break;
    case "sudo":
      termPrint(m.sudo, "t-err");
      break;
    case "clear":
      termBody.innerHTML = "";
      break;
    default:
      termPrint(m.cmdNotFound(cmd), "t-err");
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
  $("menu-theme-icon").textContent = theme === "dark" ? "🌚" : "🌝";
  $("menu-theme-state").textContent = theme === "dark" ? "Dark" : "Light";
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

/* ---- 语言切换（设置菜单里） ---- */
function applyLang(l, silent) {
  lang = l;
  localStorage.setItem("hp-lang", l);
  FILES = l === "zh" ? FILES_ZH : FILES_EN;
  const m = T();

  // 静态文案
  $("sb-title").textContent = m.explorer;
  $("ol-title").textContent = m.outline;
  $("palette-hint-label").textContent = m.paletteBtn;
  $("palette-input").placeholder = m.palettePlaceholder;
  $("pf-up").innerHTML = '<kbd>↑</kbd><kbd>↓</kbd> ' + m.navigate;
  $("pf-run").innerHTML = '<kbd>↵</kbd> ' + m.run;
  $("pf-esc").innerHTML = '<kbd>Esc</kbd> ' + m.close;
  $("terminal-input").placeholder = m.termPlaceholder;
  $("qo-input").placeholder = m.qoPlaceholder;
  $("menu-theme-label").textContent = m.themeItem;
  $("act-files").title = m.actFiles;
  $("act-search").title = m.actSearch;
  $("act-terminal").title = m.actTerminal;
  $("act-settings").title = m.actSettings;
  $("btn-palette-hint").title = m.openPalette;
  $("status-theme").title = m.toggleTheme;
  $("status-branch").title = m.branch;
  $("status-remote").title = m.remote;
  $("status-problems").title = m.noProblems;
  $("status-bell").title = m.notifications;
  $("terminal-hide").title = m.closeTerminal;
  $("preview-close").title = m.closePreview;
  $("menu-lang-state").textContent = l === "zh" ? "中文" : "English";

  // 动态部分重建
  COMMANDS = buildCommands();
  renderTree();
  renderTabs();
  renderEditor();
  if (!paletteEl.classList.contains("hidden")) renderPalette();
  if (!silent) showToast(m.toastLang);
}

/* 设置菜单（齿轮） */
const settingsMenu = $("settings-menu");
function closeSettingsMenu() {
  settingsMenu.classList.add("hidden");
}
$("act-settings").addEventListener("click", () => {
  settingsMenu.classList.toggle("hidden");
});
$("menu-theme").addEventListener("click", () => {
  toggleTheme();
  closeSettingsMenu();
});
$("menu-lang").addEventListener("click", () => {
  applyLang(lang === "zh" ? "en" : "zh");
  closeSettingsMenu();
});
document.addEventListener("click", (e) => {
  if (
    !settingsMenu.classList.contains("hidden") &&
    !settingsMenu.contains(e.target) &&
    !e.target.closest("#act-settings")
  ) {
    closeSettingsMenu();
  }
});
$("act-files").addEventListener("click", toggleSidebar);
$("status-theme").addEventListener("click", toggleTheme);
$("act-search").addEventListener("click", openPalette);
$("btn-palette-hint").addEventListener("click", openPalette);
$("act-terminal").addEventListener("click", toggleTerminal);
$("terminal-hide").addEventListener("click", toggleTerminal);
$("status-branch").addEventListener("click", () => showToast(T().toastBranch));
  $("toast-close").addEventListener("click", () => $("toast").classList.add("hidden"));
  $("preview-close").addEventListener("click", toggleMdPreview);

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
  } else if (mod && e.key.toLowerCase() === "p") {
    e.preventDefault();
    openQuickOpen();
  } else if (e.ctrlKey && e.code === "Backquote") {
    e.preventDefault();
    toggleTerminal();
  } else if (e.key === "Escape") {
    closePalette();
    closeQuickOpen();
    closeSettingsMenu();
  }
});

(function init() {
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform);
  if (!isMac) $("kbd-hint").textContent = "Ctrl+K";

  applyTheme(localStorage.getItem("hp-theme") || "dark");
  applyLang(localStorage.getItem("hp-lang") || "en", true);
  loadVisitors();

  // 手机上默认收起侧栏
  if (window.innerWidth <= 860) $("sidebar").classList.add("closed");

  setTimeout(() => showToast(T().toastWelcome), 700);
})();
