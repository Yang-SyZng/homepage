/* ==================================================================
 * 极简语法高亮：按正则给每一行代码上色（够用就好，不引入第三方库）
 * ================================================================== */

import { esc } from "./util.js";

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
    "\\b(const|let|var|function|return|export|default|import|from|type|interface|async|await|new|class|def|self|public|private|protected|static|struct|final|int|str|string|void)\\b",
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

export function highlightLine(line, lang) {
  const t = line.trimStart();
  // 各语言的全行注释（vb / fortran / matlab / asm）
  if (lang === "vb" && t.startsWith("'")) return `<span class="tk-cmt">${esc(line)}</span>`;
  if ((lang === "f90" || lang === "matlab") && /^[!%]/.test(t)) return `<span class="tk-cmt">${esc(line)}</span>`;
  if (lang === "asm" && t.startsWith(";")) return `<span class="tk-cmt">${esc(line)}</span>`;
  if (lang === "json") return hlJson(line);
  if (lang === "md") return hlMd(line);
  return hlCode(line); // ts / py / 其余 C-like
}
