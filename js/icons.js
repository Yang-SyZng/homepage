/* ==================================================================
 * 文件图标与 git 角标：VS Code 原版 Seti 字体图标（字体来自本仓库
 * seti.woff，配色同原版主题），以及标签页上的 git 状态角标
 * ================================================================== */

import { basename } from "./util.js";

/* git 状态角标：M = 已修改，U = 未跟踪（纯装饰，颜色同 VS Code） */
export const GIT_STATUS = { "README.md": "M", "about.ts": "M" };
export const GIT_COLOR = { M: "#e2c08d", U: "#73c991", A: "#73c991" };

export function gitBadge(path) {
  const s = GIT_STATUS[path] || "U";
  return `<span class="git-status" style="color:${GIT_COLOR[s]}">${s}</span>`;
}

export const SETI_ICONS = {
  "_markdown": { c: "\uE060", color: "#519aba" },
  "_info": { c: "\uE04D", color: "#519aba" },
  "_typescript": { c: "\uE099", color: "#519aba" },
  "_javascript": { c: "\uE051", color: "#cbcb41" },
  "_json": { c: "\uE055", color: "#cbcb41" },
  "_python": { c: "\uE07B", color: "#519aba" },
  "_c-sharp": { c: "\uE00B", color: "#519aba" },
  "_c": { c: "\uE00C", color: "#519aba" },
  "_cpp": { c: "\uE01A", color: "#519aba" },
  "_go": { c: "\uE039", color: "#519aba" },
  "_rust": { c: "\uE082", color: "#6d8086" },
  "_php": { c: "\uE070", color: "#a074c4" },
  "_swift": { c: "\uE092", color: "#e37933" },
  "_kotlin": { c: "\uE058", color: "#e37933" },
  "_default": { c: "\uE023", color: "#d4d7d6" },
  "_cu": { c: "\uE01F", color: "#8dc149" },
  "_coffee": { c: "\uE016", color: "#cbcb41" },
  "_R": { c: "\uE001", color: "#519aba" },
  "_config": { c: "\uE019", color: "#6d8086" },
  "_license": { c: "\uE05A", color: "#cbcb41" },
};

export const EXT_SETI = {
  "md": "_markdown",
  "tsx": "_typescript",
  "mts": "_typescript",
  "cts": "_typescript",
  "ts": "_typescript",
  "js": "_javascript",
  "mjs": "_javascript",
  "cjs": "_javascript",
  "jsx": "_javascript",
  "json": "_json",
  "py": "_python",
  "pyi": "_python",
  "pyw": "_python",
  "pyx": "_python",
  "java": "_coffee",
  "cs": "_c-sharp",
  "csx": "_c-sharp",
  "cpp": "_cpp",
  "cc": "_cpp",
  "cxx": "_cpp",
  "hpp": "_cpp",
  "hh": "_cpp",
  "hxx": "_cpp",
  "ino": "_cpp",
  "tcc": "_cpp",
  "cu": "_cu",
  "cuh": "_cu",
  "c": "_c",
  "h": "_c",
  "go": "_go",
  "rust": "_rust",
  "php": "_php",
  "phtml": "_php",
  "swift": "_swift",
  "kotlin": "_kotlin",
  "r": "_R",
  "rmd": "_R",
  "txt": "_default",
  "vb": "_default",
  "vbs": "_default",
  "f90": "_default",
  "f95": "_default",
  "f03": "_default",
  "for": "_default",
  "f": "_default",
  "scratch": "_default",
  "sb3": "_default",
  "matlab": "_default",
  "mlx": "_default",
  "pascal": "_default",
  "pas": "_default",
  "pp": "_default",
  "lpr": "_default",
  "dpr": "_default",
  "asm": "_default",
  "s": "_default",
  "nasm": "_default",
};

export function fileIcon(path) {
  const ext = path.includes(".") ? path.split(".").pop().toLowerCase() : "";
  if (ext === "md" && /^readme\.md$/i.test(basename(path)))
    return setiSpan("_info");
  const key = EXT_SETI[ext] || "_default";
  return setiSpan(key);
}

export function setiSpan(key) {
  const ic = SETI_ICONS[key];
  if (!ic) return `<span class="ficon ficon-tx">TX</span>`;
  return `<span class="fico fico-seti" style="color:${ic.color}">${ic.c}</span>`;
}
