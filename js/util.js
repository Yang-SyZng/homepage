/* ==================================================================
 * 通用小工具：DOM 查找 / HTML 转义 / 文件名 / 带超时 fetch / 平台判断
 * 不依赖任何其他模块，被所有模块引用
 * ================================================================== */

export const $ = (id) => document.getElementById(id);

export function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function basename(p) {
  return p.split("/").pop();
}

/* 带超时的 fetch（防止第三方服务挂起阻塞渲染） */
export function fetchT(url, ms = 8000) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  return fetch(url, { signal: ctl.signal }).finally(() => clearTimeout(timer));
}

export function isMac() {
  return /Mac|iPhone|iPad/.test(navigator.platform);
}
