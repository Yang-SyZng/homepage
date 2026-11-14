/* ==================================================================
 * 假终端：bash 伪装版，支持 help / ls / cat / neofetch / theme 等
 * ================================================================== */

import { state } from "./state.js";
import { T } from "./i18n.js";
import { PROFILE } from "./content.js";
import { $, esc } from "./util.js";
import { visitorsText } from "./visitors.js";
import { toggleTheme } from "./ui.js";

const terminalEl = $("terminal");
const termBody = $("terminal-body");
const termInput = $("terminal-input");
const termHistory = [];

export function toggleTerminal() {
  terminalEl.classList.toggle("hidden");
  if (!terminalEl.classList.contains("hidden")) {
    if (!termBody.dataset.welcomed) {
      termBody.dataset.welcomed = "1";
      termPrint(T().termBanner, "t-banner");
      termPrint(T().termBannerHint, "t-dim");
      termPrint("");
    }
    termInput.focus();
    termBody.scrollTop = termBody.scrollHeight;
  }
}

function termPrint(html, cls) {
  const div = document.createElement("div");
  if (cls) div.className = cls;
  div.innerHTML = html;
  termBody.appendChild(div);
  termBody.scrollTop = termBody.scrollHeight;
}

function runCommand(raw) {
  const cmdline = raw.trim();
  termPrint(
    `<span class="t-prompt">visitor@yang-syzng:~$</span> <span class="t-cmd">${esc(cmdline)}</span>`,
  );
  if (!cmdline) return;

  const m = T();
  const [cmd, ...args] = cmdline.split(/\s+/);
  switch (cmd) {
    case "help":
      termPrint(m.helpText.join("\n"));
      break;
    case "whoami":
      termPrint(m.whoami);
      break;
    case "ls":
      termPrint(esc(Object.keys(state.files).join("  ")));
      break;
    case "cat": {
      const f = args[0];
      if (!f) termPrint(m.catUsage, "t-dim");
      else if (state.files[f])
        termPrint(esc(state.files[f].content).replaceAll("__VISITORS__", visitorsText()));
      else termPrint(m.catMissing(f), "t-err");
      break;
    }
    case "neofetch":
      termPrint(
        [
          "    ██╗   ██╗     <span class='t-ok'>visitor</span>@<span class='t-ok'>yang-syzng</span>",
          "    ╚██╗ ██╔╝     -----------------",
          "     ╚████╔╝      <span class='t-dim'>OS:</span>      GitHub Pages",
          "      ╚██╔╝       <span class='t-dim'>Host:</span>    homepage",
          "       ██║        <span class='t-dim'>Shell:</span>   " + m.shellValue,
          "       ╚═╝        <span class='t-dim'>Theme:</span>   " + m.themeNow(document.documentElement.dataset.theme),
          "                  <span class='t-dim'>Mood:</span>    " + m.mood,
        ].join("\n"),
      );
      break;
    case "github":
      termPrint(m.githubOpening, "t-ok");
      window.open(PROFILE.github, "_blank");
      break;
    case "theme":
      toggleTheme();
      termPrint(m.themeSwitched, "t-ok");
      break;
    case "echo":
      termPrint(esc(args.join(" ")));
      break;
    case "date":
      termPrint(esc(new Date().toString()));
      break;
    case "sudo":
      termPrint(m.sudo, "t-err");
      break;
    case "clear":
      termBody.innerHTML = "";
      break;
    default:
      termPrint(m.cmdNotFound(cmd), "t-err");
  }
}

termInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const raw = termInput.value;
    if (raw.trim()) termHistory.push(raw.trim());
    termInput.value = "";
    runCommand(raw);
  } else if (e.key === "ArrowUp" && termHistory.length) {
    termInput.value = termHistory[termHistory.length - 1];
    e.preventDefault();
  }
});
