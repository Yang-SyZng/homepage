/* ==================================================================
 * 命令面板（Ctrl/Cmd + K）：命令列表构建、搜索过滤、键盘导航
 * ================================================================== */

import { T } from "./i18n.js";
import { $ } from "./util.js";
import { PROFILE } from "./content.js";
import { PROJECT_FILES } from "./projects.js";
import { openFile } from "./editor.js";
import { toggleTerminal } from "./terminal.js";
import { toggleSidebar, showToast } from "./ui.js";

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
    { icon: "📦", label: m.cmdProjects, run: () => openFile(Object.keys(PROJECT_FILES).find((k) => k.startsWith("projects/")) || "about.ts") },
    { icon: "📮", label: m.cmdContact, run: () => openFile("contact.md") },
    { icon: "📘", label: m.cmdReadme, run: () => openFile("README.md") },
    { icon: "🖥️", label: m.cmdTerm, hint: "Ctrl + `", run: toggleTerminal },
    { icon: "🗂️", label: m.cmdSidebar, run: toggleSidebar },
    { icon: "🐙", label: m.cmdGithub, hint: PROFILE.github, run: () => window.open(PROFILE.github, "_blank") },
    { icon: "💡", label: m.cmdTips, run: () => showToast(T().tipsText) },
  ];
}

let COMMANDS = buildCommands();

/* 语言切换后重建命令列表（main.js 的 applyLang 调用） */
export function refreshCommands() {
  COMMANDS = buildCommands();
  if (!paletteEl.classList.contains("hidden")) renderPalette();
}

export function openPalette() {
  paletteEl.classList.remove("hidden");
  paletteInput.value = "";
  updatePalette("");
  paletteInput.focus();
}

export function closePalette() {
  paletteEl.classList.add("hidden");
}

export function togglePalette() {
  paletteEl.classList.contains("hidden") ? openPalette() : closePalette();
}

function updatePalette(q) {
  const query = q.trim().toLowerCase();
  paletteItems = COMMANDS.filter(
    (c) => !query || (c.label + (c.hint || "")).toLowerCase().includes(query),
  );
  paletteSel = 0;
  renderPalette();
}

export function renderPalette() {
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
