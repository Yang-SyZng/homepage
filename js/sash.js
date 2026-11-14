/* ==================================================================
 * Sash（分隔条）：侧栏与编辑器之间那条缝，悬停出现高亮条并可拖拽
 * 调整两框宽度。逻辑 / 动画逐值对齐 microsoft/vscode 源码：
 *   src/vs/base/browser/ui/sash/sash.ts + sash.css（4px、悬停 300ms、
 *   background-color 0.1s ease-out、min/max 光标切换）
 *   src/vs/workbench/browser/parts/sidebar/sidebarPart.ts（最小宽 170）
 *   editorGroupView.ts（编辑器最小宽 220，拖拽时为其保留空间）
 * ================================================================== */

import { $, isMac } from "./util.js";
import { updateMinimapSlider } from "./editor.js";

const SIDEBAR_MIN = 170; // sidebarPart.ts: minimumWidth = 170
const EDITOR_MIN = 220; // editorGroupView.ts: DEFAULT_EDITOR_MIN_DIMENSIONS.width
const HOVER_DELAY = 300; // sash.ts: globalHoverDelay = 300
const ACTIVITYBAR_WIDTH = 48; // activitybar.css: .activitybar width
const WORKBENCH_GAPS = 16; // 左右内边距 8 + 两组件间隙 8
const WIDTH_KEY = "hp-sidebar-width";

const sidebarEl = $("sidebar");
const workbenchEl = document.querySelector(".workbench");
const sashEl = $("sash-sidebar");

let hoverTimer = null;

if (isMac()) sashEl.classList.add("mac"); // mac 上光标为 col-resize（sash.css: .mac.vertical）

const sidebarWidth = () => sidebarEl.getBoundingClientRect().width;

/* 网格布局会把侧栏最大宽度钳制到"编辑器仍保留最小宽度"（同 vscode 布局引擎） */
function maxSidebarWidth() {
  return Math.max(SIDEBAR_MIN, workbenchEl.clientWidth - ACTIVITYBAR_WIDTH - WORKBENCH_GAPS - EDITOR_MIN);
}

function updateStateClasses() {
  const w = sidebarWidth();
  sashEl.classList.toggle("minimum", w <= SIDEBAR_MIN);
  sashEl.classList.toggle("maximum", w >= maxSidebarWidth());
}

/* 缝的位置跟手：贴住侧栏右缘；侧栏隐藏（toggle / 移动端）时整条隐藏 */
function positionSash() {
  const wbRect = workbenchEl.getBoundingClientRect();
  const sbRect = sidebarEl.getBoundingClientRect();
  sashEl.style.left = sbRect.right - wbRect.left + "px";
  const hidden =
    sidebarEl.classList.contains("closed") || window.innerWidth <= 860;
  sashEl.style.display = hidden ? "none" : "";
  updateStateClasses();
}

function setSidebarWidth(w) {
  const width = Math.round(Math.min(Math.max(w, SIDEBAR_MIN), maxSidebarWidth()));
  sidebarEl.style.width = width + "px";
  positionSash();
  updateMinimapSlider(); // 编辑器宽度变了，小地图滑块联动
  return width;
}

/* 悬停 300ms 后显示（sash.ts: globalHoverDelay = 300）；拖拽中立即显示 */
sashEl.addEventListener("mouseenter", () => {
  if (sashEl.classList.contains("active")) return;
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => sashEl.classList.add("hover"), HOVER_DELAY);
});
sashEl.addEventListener("mouseleave", () => {
  clearTimeout(hoverTimer);
  sashEl.classList.remove("hover");
});

sashEl.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  const startX = e.pageX;
  const startWidth = sidebarWidth();
  sashEl.classList.add("active");
  sashEl.classList.remove("hover");
  clearTimeout(hoverTimer);

  // 拖拽期间强制全局光标（sash.ts：插入 * { cursor: ... !important } 样式表，
  // 且拖到最小 / 最大时切换为 e-resize / w-resize）
  const style = document.createElement("style");
  const updateCursor = () => {
    const w = sidebarWidth();
    const cursor =
      w <= SIDEBAR_MIN
        ? "e-resize"
        : w >= maxSidebarWidth()
          ? "w-resize"
          : isMac()
            ? "col-resize"
            : "ew-resize";
    style.textContent = `* { cursor: ${cursor} !important; }`;
  };
  updateCursor();
  document.head.appendChild(style);

  const onMove = (ev) => {
    setSidebarWidth(startWidth + (ev.pageX - startX));
    updateCursor();
  };
  const onUp = () => {
    sashEl.classList.remove("active");
    style.remove();
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    try { localStorage.setItem(WIDTH_KEY, String(sidebarWidth())); } catch {}
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);
});

/* 恢复上次拖拽的宽度；窗口尺寸 / 侧栏显隐变化时重新定位 */
try {
  const saved = parseInt(localStorage.getItem(WIDTH_KEY) || "", 10);
  if (Number.isFinite(saved) && saved >= SIDEBAR_MIN && saved <= maxSidebarWidth()) {
    setSidebarWidth(saved);
  } else {
    positionSash();
  }
} catch {
  positionSash();
}

window.addEventListener("resize", () => {
  if (window.innerWidth <= 860) {
    sidebarEl.style.width = ""; // 移动端回到 CSS 定宽，防止拖拽残留
  } else {
    let saved = NaN;
    try { saved = parseInt(localStorage.getItem(WIDTH_KEY) || "", 10); } catch {}
    if (Number.isFinite(saved) && saved >= SIDEBAR_MIN) setSidebarWidth(saved);
  }
  positionSash();
});
new MutationObserver(positionSash).observe(sidebarEl, {
  attributes: true,
  attributeFilter: ["class"],
});
