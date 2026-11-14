/* ==================================================================
 * 语言元数据：动态生成的 projects 文件用——语言 → 扩展名候选池
 * （洗牌袋均衡发放，17 种语言）、扩展名 → 语法家族 / 状态栏语言名
 * ================================================================== */

/* 语言 → 后缀候选池（洗牌袋均衡发放，17 种语言） */
export const LANG_EXT = {
  Python: ["py", "pyi", "pyw", "pyx"],
  "C/C++": ["cpp", "cc", "cxx", "c", "h", "hpp", "hh", "hxx", "ino", "tcc"],
  Java: ["java"],
  "C#": ["cs", "csx"],
  JavaScript: ["js", "mjs", "cjs", "jsx"],
  TypeScript: ["ts", "tsx", "mts", "cts"],
  R: ["r", "rmd"],
  "Visual Basic": ["vb", "vbs"],
  Go: ["go"],
  Rust: ["rs"],
  PHP: ["php", "phtml"],
  Fortran: ["f90", "f95", "f03", "for", "f"],
  Scratch: ["sb3", "scratch"],
  MATLAB: ["m", "mlx", "matlab"],
  Swift: ["swift"],
  Pascal: ["pas", "pp", "lpr", "dpr"],
  Assembly: ["asm", "s", "nasm"],
};
const LANG_BAG = Object.keys(LANG_EXT);
let extBag = [];
export function nextLanguage() {
  if (!extBag.length) {
    extBag = [...LANG_BAG];
    for (let i = extBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [extBag[i], extBag[j]] = [extBag[j], extBag[i]];
    }
  }
  return extBag.pop();
}

/* 扩展名 → 语法家族 / 状态栏语言 / 图标（GitHub Linguist 配色） */
const EXT_FAMILY = {
  py: "py", pyi: "py", pyw: "py", pyx: "py",
  java: "java",
  cs: "cs", csx: "cs",
  cpp: "cpp", cc: "cpp", cxx: "cpp", hpp: "cpp", hh: "cpp", hxx: "cpp",
  ino: "cpp", tcc: "cpp", cu: "cpp", cuh: "cpp",
  c: "c", h: "c",
  r: "r", rmd: "r",
  vb: "vb", vbs: "vb",
  f90: "f90", f95: "f90", f03: "f90", for: "f90", f: "f90",
  sb3: "sb3", scratch: "sb3",
  m: "matlab", mlx: "matlab", matlab: "matlab",
  asm: "asm", s: "asm", nasm: "asm",
  pas: "pas", pp: "pas", lpr: "pas", dpr: "pas",
  js: "ts", mjs: "ts", cjs: "ts", jsx: "ts",
  ts: "ts", tsx: "ts", mts: "ts", cts: "ts",
  json: "json", md: "md",
};
const EXT_META = {
  py: ["PY", "#3572a5"], pyi: ["PY", "#3572a5"], pyw: ["PY", "#3572a5"], pyx: ["PY", "#3572a5"],
  cpp: ["C++", "#f34b7d"], cc: ["C++", "#f34b7d"], cxx: ["C++", "#f34b7d"],
  hpp: ["H", "#f34b7d"], hh: ["H", "#f34b7d"], hxx: ["H", "#f34b7d"], tcc: ["C++", "#f34b7d"],
  cu: ["CU", "#76b900"], cuh: ["CU", "#76b900"], c: ["C", "#a8b9cc"], h: ["H", "#a8b9cc"],
  ino: ["INO", "#00979d"],
  java: ["JV", "#b07219"], cs: ["C#", "#178600"], csx: ["CS", "#178600"],
  js: ["JS", "#f1e05a"], mjs: ["JS", "#f1e05a"], cjs: ["JS", "#f1e05a"], jsx: ["JSX", "#f1e05a"],
  ts: ["TS", "#3178c6"], tsx: ["TSX", "#3178c6"], mts: ["TS", "#3178c6"], cts: ["TS", "#3178c6"],
  r: ["R", "#198ce7"], rmd: ["RMD", "#198ce7"],
  vb: ["VB", "#945db7"], vbs: ["VBS", "#945db7"],
  go: ["GO", "#00add8"], rs: ["RS", "#dea584"], php: ["PHP", "#4f5d95"], phtml: ["PHP", "#4f5d95"],
  f90: ["F", "#4d41b1"], f95: ["F", "#4d41b1"], f03: ["F", "#4d41b1"], for: ["F", "#4d41b1"], f: ["F", "#4d41b1"],
  sb3: ["S3", "#4d97b0"], scratch: ["S3", "#4d97b0"],
  m: ["M", "#e16737"], mlx: ["MLX", "#e16737"], matlab: ["M", "#e16737"],
  asm: ["ASM", "#6e4c13"], s: ["S", "#6e4c13"], nasm: ["NASM", "#6e4c13"],
  pas: ["PAS", "#e3f171"], pp: ["PAS", "#e3f171"], lpr: ["PAS", "#e3f171"], dpr: ["PAS", "#e3f171"],
  json: ["{}", "#cbcb41"], md: ["MD", "#519aba"], txt: ["TX", "#8b949e"],
};

export function famOfExt(ext) {
  return EXT_FAMILY[ext] || "ts";
}

export function langLabelOf(fam) {
  return { py: "Python", java: "Java", cs: "C#", cpp: "C++", c: "C", r: "R",
    vb: "Visual Basic", f90: "Fortran", sb3: "Scratch", matlab: "MATLAB",
    asm: "Assembly", pas: "Pascal", ts: "TypeScript", json: "JSON", md: "Markdown" }[fam] || fam;
}

export function pickExt(language) {
  const arr = LANG_EXT[language] || ["txt"];
  return arr[Math.floor(Math.random() * arr.length)];
}

export function langOfExt(ext) {
  return famOfExt(ext);
}

/* 仓库名 → 类名 / 蛇形名（用于生成类定义风格的文件内容） */
export function classNameOf(name) {
  const parts = name.match(/[a-zA-Z0-9]+/g) || ["Repo"];
  return parts.map((s) => s[0].toUpperCase() + s.slice(1)).join("") || "Repo";
}

export function snakeOf(name) {
  return name.replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase().replace(/^_+|_+$/g, "") || "repo";
}
