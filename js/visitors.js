/* ==================================================================
 * 访问人次：静态页用免费计数服务 Abacus，写入 about.ts 问候语里
 * ================================================================== */

import { state } from "./state.js";
import { COUNTER_NS } from "./content.js";

export function visitorsText() {
  return state.visitorCount == null ? "…" : String(state.visitorCount);
}

export function visitorsHtml() {
  return `<span class="tk-visitors" data-visitors>${visitorsText()}</span>`;
}

export function updateVisitorsInDom() {
  document.querySelectorAll("[data-visitors]").forEach((el) => {
    el.textContent = visitorsText();
  });
}

export async function loadVisitors() {
  // 先展示上次缓存的数量，避免闪"…"
  const cached = parseInt(localStorage.getItem("hp-visitors") || "", 10);
  if (Number.isFinite(cached) && cached > 0) {
    state.visitorCount = cached;
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
    state.visitorCount = n;
    localStorage.setItem("hp-visitors", String(n));
  } catch {
    // 计数服务不可达（离线 / 广告拦截）且没有缓存：退化为本地浏览器计数
    if (state.visitorCount == null) {
      const n = (parseInt(localStorage.getItem("hp-local-visits") || "0", 10) || 0) + 1;
      localStorage.setItem("hp-local-visits", String(n));
      state.visitorCount = n;
    }
  }
  updateVisitorsInDom();
}
