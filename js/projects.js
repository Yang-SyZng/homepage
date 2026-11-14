/* ==================================================================
 * projects/ 文件夹：动态抓取 GitHub 公开仓库，把每个仓库生成一个
 * 随机语言（洗牌袋均衡发放）的类定义风格代码文件；含 pinned 合并与
 * localStorage 缓存（stale-while-revalidate）
 * ================================================================== */

import { state } from "./state.js";
import { PROFILE, TREE } from "./content.js";
import { fetchT } from "./util.js";
import { nextLanguage, pickExt, langOfExt, famOfExt, classNameOf, snakeOf } from "./langs.js";
import { renderTree, renderTabs, renderEditor, updateNavArrows } from "./editor.js";

export const PROJECT_FILES = {};

/* 按语言家族生成类定义风格的文件内容 */
function fmtPushed(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return String(iso || "unknown");
  const p = (x) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
function projectCode(repo, ext, pinned) {
  const fam = famOfExt(ext);
  const cls = classNameOf(repo.name);
  const name = repo.name;
  const stars = repo.stargazers_count ?? 0;
  const desc = (repo.description || "No description").replace(/"/g, "'").replace(/\r?\n/g, " ");
  const langs = [...new Set([repo.language, ...(repo.topics || [])].filter(Boolean))].slice(0, 3);
  const stack = langs.length ? langs : ["Code"];
  const link = repo.html_url;
  const updated = fmtPushed(repo.pushed_at);
  const st = stack.map((s) => `"${s}"`).join(", ");
  const pin = pinned ? "Pinned on profile" : "";
  const pinC = pinned ? `\u{1F4CC} ${pin}` : "";

  if (fam === "py") {
    return `${pinned ? `# \u{1F4CC} ${pin}\n` : ""}class ${cls}:
    name: str = "${name}"
    stars: int = ${stars}
    desc: str = "${desc}"
    stack: List[str] = [${st}]
    last_updated: str = "${updated}"
    link: str = "${link}"`;
  }
  if (fam === "java") {
    return `${pinned ? `// \u{1F4CC} ${pin}\n` : ""}public class ${cls} {
    public String name = "${name}";
    public int stars = ${stars};
    public String desc = "${desc}";
    public String[] stack = {${st}};
    public String lastUpdated = "${updated}";
    public String link = "${link}";
}`;
  }
  if (fam === "cs") {
    return `${pinned ? `// \u{1F4CC} ${pin}\n` : ""}public class ${cls}
{
    public string Name = "${name}";
    public int Stars = ${stars};
    public string Desc = "${desc}";
    public string[] Stack = {${st}};
    public string LastUpdated = "${updated}";
    public string Link = "${link}";
}`;
  }
  if (fam === "cpp") {
    return `${pinned ? `// \u{1F4CC} ${pin}\n` : ""}class ${cls} {
public:
    std::string name = "${name}";
    int stars = ${stars};
    std::string desc = "${desc}";
    std::vector<std::string> stack = {${st}};
    std::string last_updated = "${updated}";
    std::string link = "${link}";
};`;
  }
  if (fam === "c") {
    const snake = snakeOf(name);
    return `${pinned ? `/* \u{1F4CC} ${pin} */\n` : ""}struct ${snake} {
    const char *name;
    int stars;
    const char *desc;
    const char *stack[${stack.length}];
    const char *last_updated;
    const char *link;
};

struct ${snake} s = {
    "${name}", ${stars}, "${desc}", {${st}}, "${updated}", "${link}"
};`;
  }
  if (fam === "r") {
    return `${pinned ? `# \u{1F4CC} ${pin}\n` : ""}${snakeOf(name)} <- list(
  name = "${name}",
  stars = ${stars}L,
  desc = "${desc}",
  stack = c(${st}),
  last_updated = "${updated}",
  link = "${link}"
)`;
  }
  if (fam === "vb") {
    return `${pinned ? `' \u{1F4CC} ${pin}\n` : ""}Public Class ${cls}
    Public Name As String = "${name}"
    Public Stars As Integer = ${stars}
    Public Desc As String = "${desc}"
    Public Stack() As String = {${st}}
    Public LastUpdated As String = "${updated}"
    Public Link As String = "${link}"
End Class`;
  }
  if (fam === "f90") {
    return `${pinned ? `! \u{1F4CC} ${pin}\n` : ""}module ${snakeOf(name)}
    implicit none
    character(len=*), parameter :: name = "${name}"
    integer, parameter :: stars = ${stars}
    character(len=*), parameter :: desc = "${desc}"
    character(len=*), parameter :: stack = "${stack.join(", ")}"
    character(len=*), parameter :: last_updated = "${updated}"
    character(len=*), parameter :: link = "${link}"
end module ${snakeOf(name)}`;
  }
  if (fam === "sb3") {
    return JSON.stringify(
      { project: name, stars: stars, desc: desc, stack: stack, last_updated: updated, link: link, targets: [{ name: cls, isStage: false, blocks: {} }] },
      null,
      2,
    );
  }
  if (fam === "matlab") {
    return `${pinned ? `% \u{1F4CC} ${pin}\n` : ""}classdef ${cls}
    properties
        name = "${name}";
        stars = ${stars};
        desc = "${desc}";
        stack = {${st}};
        last_updated = "${updated}";
        link = "${link}";
    end
end`;
  }
  if (fam === "asm") {
    return `${pinned ? `; \u{1F4CC} ${pin}\n` : ""}section .data
    name_bin  db "${name}", 0
    stars     dq ${stars}
    desc_bin  db "${desc}", 0
    stack_bin db "${stack.join(", ")}", 0
    last_updated_bin db "${updated}", 0
    link_bin  db "${link}", 0`;
  }
  if (fam === "pas") {
    return `${pinned ? `{ \u{1F4CC} ${pin} }\n` : ""}program ${snakeOf(name)};
type
    T${cls} = record
        Name: string;
        Stars: Integer;
        Desc: string;
        Stack: array of string;
        LastUpdated: string;
        Link: string;
    end;
begin
    writeln('${cls}: ${stars} stars');
end.`;
  }
  return `${pinned ? `// \u{1F4CC} ${pin}\n` : ""}export class ${cls} {
  name: string = "${name}";
  stars: number = ${stars};
  desc: string = "${desc}";
  stack: string[] = [${st}];
  last_updated: string = "${updated}";
  link: string = "${link}";
}`;
}

/* 把仓库列表写进 projects/ 文件夹并刷新树 */
function useProjects(list) {
  if (Array.isArray(list)) state.projectsRendered = true;
  const folder = TREE.find((n) => n.folder === "projects");
  for (const k of Object.keys(PROJECT_FILES)) delete PROJECT_FILES[k];
  state.pinnedPaths = new Set();
  const children = [];

  if (list === null) {
    const p = "projects/rate-limited.py";
    children.push(p);
    PROJECT_FILES[p] = {
      lang: "py",
      content: `# GitHub API rate limit reached (60 requests / hour per IP).\n# Try again after the window resets.`,
    };
  } else if (!list.length) {
    const p = "projects/empty.py";
    children.push(p);
    PROJECT_FILES[p] = { lang: "py", content: `# No public repositories yet.` };
  } else {
    for (const { repo, pinned } of list) {
      const language = nextLanguage(); // 洗牌袋均衡发放
      const ext = pickExt(language);
      const path = `projects/${repo.name}.${ext}`;
      children.push(path);
      if (pinned) state.pinnedPaths.add(path);
      PROJECT_FILES[path] = {
        lang: langOfExt(ext),
        content: projectCode(repo, ext, pinned),
      };
    }
  }
  folder.children = children;

  Object.assign(state.files, PROJECT_FILES);
  state.openTabs = state.openTabs.filter((p) => state.files[p]);
  // 导航历史里的旧路径可能已失效（重新抓取后扩展名重排），同步修剪
  state.navStack = state.navStack.filter((p) => state.files[p]);
  state.navIndex = Math.min(state.navIndex, state.navStack.length - 1);
  if (!state.files[state.activeFile]) state.activeFile = state.openTabs.find((f) => state.files[f]) || "README.md";
  renderTree();
  renderTabs();
  renderEditor();
  updateNavArrows();
}

export async function fetchProjects() {
  // 有缓存就先即时渲染，随后仍然拉取最新数据覆盖（实时更新）
  try {
    const cached = JSON.parse(localStorage.getItem("hp-projects-cache") || "null");
    if (cached && Array.isArray(cached.list)) {
      useProjects(cached.list);
    }
  } catch {}
  try {
    let repos = await fetchT(
      `https://api.github.com/users/${PROFILE.user}/repos?per_page=100&sort=updated`
    ).then((r) => {
      if (!r.ok) throw new Error("repos " + r.status);
      return r.json();
    });
    if (!Array.isArray(repos)) throw new Error("bad payload");

    // 排除个人资料仓库（与用户名同名）和 homepage 本体
    const excluded = new Set(["homepage", "yang-syzng.github.io", PROFILE.user.toLowerCase()]);
    repos = repos.filter((r) => !excluded.has(r.name.toLowerCase()));

    // fork 仓库：沿用上游仓库的 Star 数
    const forks = repos.filter((r) => r.fork);
    await Promise.all(forks.map((f) =>
      fetchT(`https://api.github.com/repos/${f.full_name}`, 8000)
        .then((r) => r.json())
        .then((j) => { if (j && j.parent) f.stargazers_count = j.parent.stargazers_count; })
        .catch(() => {})
    ));

    // 先渲染公开仓库（按 star 排序），不让 pinned 服务阻塞
    const byName = {};
    repos.forEach((r) => { byName[r.full_name] = r; });
    let list = Object.values(byName)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .map((r) => ({ repo: r, pinned: false }));
    useProjects(list);
    try { localStorage.setItem("hp-projects-cache", JSON.stringify({ t: Date.now(), list })); } catch {}

    // 再尽力合并 Pinned（第三方服务可能不可用，5 秒超时）
    let pinnedNames = [];
    try {
      const txt = await fetchT(`https://gh-pinned-repos.egoist.sh/?username=${PROFILE.user}`, 5000).then((r) => r.text());
      pinnedNames = txt.split("\n").map((s) => s.trim()).filter((s) => s.includes("/"));
    } catch { pinnedNames = []; }
    for (const full of pinnedNames) {
      if (!list.some((it) => it.repo.full_name === full)) {
        try {
          const r = await fetchT(`https://api.github.com/repos/${full}`, 8000).then((x) => x.json());
          if (r && r.full_name) list.push({ repo: r, pinned: true });
        } catch {}
      }
    }
    if (pinnedNames.length) {
      const merged = [
        ...pinnedNames.map((full) => list.find((it) => it.repo.full_name === full)).filter(Boolean),
        ...list.filter((it) => !pinnedNames.includes(it.repo.full_name)),
      ];
      list = merged;
      useProjects(list);
      try { localStorage.setItem("hp-projects-cache", JSON.stringify({ t: Date.now(), list })); } catch {}
    }
  } catch {
    // 限流 / 离线：只在还没有渲染过真实数据时才显示错误占位
    if (!state.projectsRendered) useProjects(null);
  }
}

/* 加载占位：抓取完成前 projects/ 里的临时文件 */
PROJECT_FILES["projects/loading.py"] = {
  lang: "py",
  content: `# fetching public repos from the GitHub API…
# this placeholder will be replaced by your real projects`,
};
