/* ==================================================================
 * 界面外壳：主题切换 / 侧栏开关 / 通知气泡
 * ================================================================== */

import { $ } from "./util.js";

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("hp-theme", theme);
  $("status-theme").textContent = theme === "dark" ? "🌚" : "🌝";
  $("menu-theme-icon").textContent = theme === "dark" ? "🌚" : "🌝";
  $("menu-theme-state").textContent = theme === "dark" ? "Dark" : "Light";
}

export function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

export function toggleSidebar() {
  $("sidebar").classList.toggle("closed");
}

let toastTimer = null;
export function showToast(html) {
  $("toast-text").innerHTML = html;
  $("toast").classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("toast").classList.add("hidden"), 6000);
}
