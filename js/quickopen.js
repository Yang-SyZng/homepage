/* ==================================================================
 * Command Center / 快速打开（Ctrl/Cmd + P）：顶栏搜索框下拉，
 * 模式列表（转到文件 / 运行命令 / …）+ 按名称过滤的文件列表
 * ================================================================== */

import { state } from "./state.js";
import { T } from "./i18n.js";
import { $, basename, isMac } from "./util.js";
import { fileIcon } from "./icons.js";
import { openFile } from "./editor.js";
import { openPalette } from "./palette.js";
import { showToast } from "./ui.js";

const qoEl = $("quick-open");
const qoInput = $("qo-input");
const qoList = $("qo-list");
let qoSel = 0;
let qoFiles = [];

export function openQuickOpen() {
  qoEl.classList.remove("hidden");
  $("command-center").classList.add("open");
  qoInput.value = "";
  qoSel = 0;
  renderQo();
  qoInput.focus();
}

export function closeQuickOpen() {
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
  const mod = isMac() ? "⌘" : "Ctrl";
  qoFiles = Object.keys(state.files).filter((p) => !q || basename(p).toLowerCase().includes(q));

  const modes = [
    { label: m.qoGoFile, keys: [mod, "P"], act: "focus" },
    { label: m.qoRunCommands, keys: ["⇧", mod, "P"], act: "commands" },
    { label: m.qoSearchText, hint: "%", act: "search" },
    { label: m.qoChat, keys: ["⇧", isMac() ? "⌥" : "Alt", mod, "L"], act: "chat" },
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
