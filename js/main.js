/* ==================================================================
 * 入口模块：语言切换应用 / 设置菜单 / 全局快捷键 / 初始化
 *（index.html 以 <script type="module"> 加载本文件）
 * ================================================================== */

import { state } from "./state.js";
import { T } from "./i18n.js";
import { FILES_EN, FILES_ZH } from "./content.js";
import { $, isMac } from "./util.js";
import { applyTheme, toggleTheme, toggleSidebar, showToast } from "./ui.js";
import { renderTree, renderTabs, renderEditor, toggleMdPreview } from "./editor.js";
import { PROJECT_FILES, fetchProjects } from "./projects.js";
import { refreshCommands, openPalette, closePalette, togglePalette } from "./palette.js";
import { openQuickOpen, closeQuickOpen } from "./quickopen.js";
import { toggleTerminal } from "./terminal.js";
import { loadVisitors } from "./visitors.js";

/* ---- 语言切换（设置菜单里）：换文案、换文件内容并整体重渲染 ---- */
function applyLang(l, silent) {
  state.lang = l;
  localStorage.setItem("hp-lang", l);
  state.files = l === "zh" ? FILES_ZH : FILES_EN;
  Object.assign(state.files, PROJECT_FILES); // 动态抓取的 projects 文件跨语言保留
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
  refreshCommands();
  renderTree();
  renderTabs();
  renderEditor();
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
  applyLang(state.lang === "zh" ? "en" : "zh");
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

/* 活动栏 / 状态栏 / 其他按钮 */
$("act-files").addEventListener("click", toggleSidebar);
$("status-theme").addEventListener("click", toggleTheme);
$("act-search").addEventListener("click", openPalette);
$("btn-palette-hint").addEventListener("click", openPalette);
$("act-terminal").addEventListener("click", toggleTerminal);
$("terminal-hide").addEventListener("click", toggleTerminal);
$("status-branch").addEventListener("click", () => showToast(T().toastBranch));
$("toast-close").addEventListener("click", () => $("toast").classList.add("hidden"));
$("preview-close").addEventListener("click", toggleMdPreview);

/* 快捷键：⌘/Ctrl+K 命令面板，⌘/Ctrl+P 快速打开，Ctrl+` 终端，Esc 关闭 */
document.addEventListener("keydown", (e) => {
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === "k") {
    e.preventDefault();
    togglePalette();
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
  if (!isMac()) $("kbd-hint").textContent = "Ctrl+K";

  applyTheme(localStorage.getItem("hp-theme") || "dark");
  applyLang(localStorage.getItem("hp-lang") || "en", true);
  loadVisitors();
  fetchProjects();

  // 手机上默认收起侧栏
  if (window.innerWidth <= 860) $("sidebar").classList.add("closed");

  setTimeout(() => showToast(T().toastWelcome), 700);
})();
