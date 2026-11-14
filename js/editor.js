/* ==================================================================
 * 编辑器核心：文件树 / 标签页 / 代码区 / 真实微缩 minimap /
 * Markdown 渲染 + 侧边分屏预览
 * ================================================================== */

import { state } from "./state.js";
import { TREE } from "./content.js";
import { T } from "./i18n.js";
import { $, basename, esc } from "./util.js";
import { fileIcon, gitBadge } from "./icons.js";
import { highlightLine } from "./highlight.js";
import { langLabelOf } from "./langs.js";
import { visitorsHtml } from "./visitors.js";

const treeEl = $("file-tree");
const tabsScrollEl = $("tabs-scroll");
const tabsActionsEl = $("tabs-actions");
const editorEl = $("editor");
const minimapEl = $("minimap");
const breadcrumbEl = $("breadcrumb");

const OPEN_PREVIEW_ICON = `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 1H4.5C3.122 1 2 2.122 2 3.5V6.276C2.319 6.162 2.653 6.089 3 6.05V3.499C3 2.672 3.673 1.999 4.5 1.999H8.5V13.385L9.557 14.442C9.714 14.591 9.831 14.786 9.907 14.999H13.5C14.878 14.999 16 13.877 16 12.499V3.5C16 2.122 14.878 1 13.5 1ZM15 12.5C15 13.327 14.327 14 13.5 14H9.5V2H13.5C14.327 2 15 2.673 15 3.5V12.5ZM6.29 12.59C6.74 12.01 7 11.28 7 10.5C7 8.57 5.43 7 3.5 7C1.57 7 0 8.57 0 10.5C0 12.43 1.57 14 3.5 14C4.28 14 5.01 13.74 5.59 13.29L8.15 15.85C8.24 15.95 8.37 16 8.5 16C8.63 16 8.76 15.95 8.85 15.85C9.05 15.66 9.05 15.34 8.85 15.15L6.29 12.59ZM5.5 12C5.36 12.19 5.19 12.36 5 12.5C4.59 12.81 4.06 13 3.5 13C2.12 13 1 11.88 1 10.5C1 9.12 2.12 8 3.5 8C4.88 8 6 9.12 6 10.5C6 11.06 5.81 11.59 5.5 12Z"/></svg>`;

export function renderTree() {
  const rootArrow = state.treeRootOpen ? "▾" : "▸";
  let html = `<div class="tree-root"><span class="arrow">${rootArrow}</span> HOMEPAGE</div>`;
  html += `<div class="tree-children ${state.treeRootOpen ? "" : "closed"}"><div class="tree-children-inner">`;
  for (const node of TREE) {
    if (node.file) {
      html += treeItemHtml(node.file, false);
    } else {
      const arrow = state.folderOpen ? "▾" : "▸";
      html += `<div class="tree-item folder" data-folder="${node.folder}">
        <span class="caret">${arrow}</span> ${node.folder}</div>`;
      html += `<div class="tree-children subtree ${state.folderOpen ? "" : "closed"}"><div class="tree-children-inner">`;
      for (const child of node.children) html += treeItemHtml(child, true);
      html += `</div></div>`;
    }
  }
  html += `</div></div>`;
  treeEl.innerHTML = html;

  // 折叠/展开只切换 class（保留 DOM 才有过渡动画）
  treeEl.querySelector(".tree-root").addEventListener("click", () => {
    state.treeRootOpen = !state.treeRootOpen;
    treeEl.querySelector(".tree-children").classList.toggle("closed", !state.treeRootOpen);
    treeEl.querySelector(".tree-root .arrow").textContent = state.treeRootOpen ? "▾" : "▸";
  });
  treeEl.querySelectorAll(".tree-item[data-file]").forEach((el) => {
    el.addEventListener("click", () => openFile(el.dataset.file));
  });
  treeEl.querySelectorAll(".tree-item.folder").forEach((el) => {
    el.addEventListener("click", () => {
      state.folderOpen = !state.folderOpen;
      treeEl.querySelector(".tree-children.subtree").classList.toggle("closed", !state.folderOpen);
      el.querySelector(".caret").textContent = state.folderOpen ? "▾" : "▸";
    });
  });
}

function treeItemHtml(path, indent) {
  const active = path === state.activeFile ? " active" : "";
  const pin = state.pinnedPaths.has(path) ? "📌 " : "";
  return `<div class="tree-item${indent ? " indent" : ""}${active}" data-file="${path}">
    ${fileIcon(path)} ${pin}${basename(path)}</div>`;
}

export function renderTabs() {
  tabsScrollEl.innerHTML = state.openTabs
    .map((p) => {
      const active = p === state.activeFile ? " active" : "";
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
  tabsActionsEl.innerHTML = state.activeFile.endsWith(".md")
    ? `<button class="tab-action ${state.mdPreviewOpen ? "active" : ""}" id="md-preview-btn" title="${T().openPreview}">${OPEN_PREVIEW_ICON}</button>`
    : "";
  const previewBtn = tabsActionsEl.querySelector("#md-preview-btn");
  if (previewBtn) previewBtn.addEventListener("click", toggleMdPreview);
}

/* 关闭标签页（同 VS Code：关闭激活标签后激活相邻标签） */
function closeTab(path) {
  const idx = state.openTabs.indexOf(path);
  if (idx === -1) return;
  state.openTabs.splice(idx, 1);
  if (!state.openTabs.length) state.openTabs = ["README.md"];
  if (state.activeFile === path || !state.openTabs.includes(state.activeFile)) {
    state.activeFile = state.openTabs[Math.min(idx, state.openTabs.length - 1)];
  }
  renderTree();
  renderTabs();
  renderEditor();
}

export function renderEditor() {
  const file = state.files[state.activeFile];
  if (!file) return;
  const lines = file.content.split("\n");

  // 最后一行非空代码作为"当前行"，放一个闪烁光标
  let cursorLine = lines.length - 1;
  while (cursorLine > 0 && lines[cursorLine].trim() === "") cursorLine -= 1;

  editorEl.innerHTML = lines
    .map((line, i) => {
      const isActive = i === cursorLine;
      const code =
        highlightLine(line, file.lang)
          .replace("__VISITORS__", visitorsHtml())
          .replace(/(https?:\/\/[^\s<&"]+)/g, '<a class="code-link" href="$1" target="_blank" rel="noopener">$1</a>') +
        (isActive ? '<span class="cursor"></span>' : "");
      return `<div class="code-line${isActive ? " active-line" : ""}" style="--d:${Math.min(i * 16, 500)}ms">
        <span class="ln">${i + 1}</span><span class="lc">${code}</span></div>`;
    })
    .join("");

  renderMinimap(lines);
  breadcrumbEl.innerHTML =
    `<span>homepage</span><span>›</span>` +
    state.activeFile
      .split("/")
      .map((seg, i, arr) =>
        i === arr.length - 1
          ? `<span class="bc-file">${seg}</span>`
          : `<span>${seg}</span><span>›</span>`,
      )
      .join("");

  $("status-lang").textContent = langLabelOf(file.lang);
  $("cc-file").textContent = basename(state.activeFile);
  updatePreviewPane();
}

/* 激活文件；push=true 时把切换记录进导航历史（标题栏前进 / 后退用） */
function activate(path, { push = true } = {}) {
  if (!state.files[path]) return;
  if (!state.openTabs.includes(path)) state.openTabs.push(path);
  state.activeFile = path;
  if (push && state.navStack[state.navIndex] !== path) {
    state.navStack = state.navStack.slice(0, state.navIndex + 1); // 走过历史后重新分支，丢弃"前进"残段
    state.navStack.push(path);
    state.navIndex = state.navStack.length - 1;
  }
  renderTree();
  renderTabs();
  renderEditor();
  updateNavArrows();
}

export function openFile(path) {
  activate(path);
}

/* 后退 / 前进：沿导航历史移动指针，不重复入栈（同 VS Code go back/forward） */
function navigate(direction) {
  const next = state.navIndex + direction;
  const path = state.navStack[next];
  if (path === undefined || !state.files[path]) return;
  state.navIndex = next;
  activate(path, { push: false });
}
export const navigateBack = () => navigate(-1);
export const navigateForward = () => navigate(1);

export function updateNavArrows() {
  const back = $("nav-back");
  const forward = $("nav-forward");
  if (!back || !forward) return;
  back.disabled = state.navIndex <= 0;
  forward.disabled = state.navIndex >= state.navStack.length - 1;
}

$("nav-back").addEventListener("click", navigateBack);
$("nav-forward").addEventListener("click", navigateForward);

/* ---- 小地图：真实微缩代码渲染（同 VS Code minimap），随编辑器滚动联动 ---- */

const editorAreaEl = editorEl.parentElement;

export function updateMinimapSlider() {
  const slider = document.getElementById("mm-slider");
  const content = minimapEl.querySelector(".mm-content");
  if (!slider || !content) return;
  syncMinimapWrap();
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
  const file = state.files[state.activeFile];
  const body = lines
    .map((line) => `<div class="mm-line">${highlightLine(line, file.lang) || "&nbsp;"}</div>`)
    .join("");
  minimapEl.innerHTML =
    `<div class="mm-content">${body}</div><div class="mm-slider" id="mm-slider"></div>`;
  updateMinimapSlider();
}

/* 小地图镜像编辑器的折行状态（vscode minimap 渲染的就是折行后的可视行）：
   编辑器里哪一行折了，对应 .mm-line 才允许折行；折行宽度 = .lc 可用宽度 ×
   字号比例。不按字符比例硬算——CJK 回退字体在 3.2px 下的步进与编辑器不一致 */
function syncMinimapWrap() {
  const content = minimapEl.querySelector(".mm-content");
  if (!content) return;
  const rows = editorEl.querySelectorAll(".code-line");
  const mmLines = content.querySelectorAll(".mm-line");
  let avail = 0;
  rows.forEach((row, i) => {
    const wrapped = row.getBoundingClientRect().height > 28; // 单行 ≈ 13.5 × 1.7 ≈ 23px
    const mm = mmLines[i];
    if (mm) mm.classList.toggle("wrapped", wrapped);
    const lc = row.querySelector(".lc");
    if (lc) avail = Math.max(avail, lc.getBoundingClientRect().width);
  });
  if (avail > 0) content.style.width = (avail * 3.2) / 13.5 + "px";
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

export function toggleMdPreview() {
  state.mdPreviewOpen = !state.mdPreviewOpen;
  renderTabs();
  updatePreviewPane();
}

function updatePreviewPane() {
  const group = $("group-preview");
  const show = state.mdPreviewOpen && state.activeFile.endsWith(".md");
  group.classList.toggle("hidden", !show);
  if (!show) return;
  $("preview-tab-label").textContent = `${T().previewTitle} ${basename(state.activeFile)}`;
  $("preview-body").innerHTML = renderMarkdown(state.files[state.activeFile].content);
  $("preview-body").scrollTop = 0;
}
