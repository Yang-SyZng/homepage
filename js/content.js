/* ==================================================================
 * 内容配置（纯数据，想换内容只改这个文件）
 * FILES_EN / FILES_ZH 是编辑器里展示的文件，中英两份、切换语言时使用，
 * 编辑内容请两个版本一起改。
 * ================================================================== */

export const PROFILE = {
  user: "yang-syzng",
  github: "https://github.com/yang-syzng",
};

/* 访问人次计数（Abacus 免费计数服务）：
   换一个全局唯一的 namespace 即可独立从零计数 */
export const COUNTER_NS = "yang-syzng-homepage";

export const FILES_EN = {
  "README.md": {
    lang: "md",
    content: `# yang-syzng · homepage

A personal homepage

## Tips

- Click files in the explorer or the tabs above to switch content
- Press Ctrl/Cmd + K for the command palette
- Press Ctrl + \` to open the terminal, type help for surprises
- The visitor count in about.ts is real
- The bottom button in the activity bar toggles light / dark theme`,
  },

  "about.ts": {
    lang: "ts",
    content: `// yang-syzng · Developer

const me = {
  name: "yang-syzng",
  role: "Developer",
  location: "Hong Kong",
  interests: ["coding", "open source", "tinkering"],
  motto: "Talk is cheap. Show me the code.",
};

function greeting(visitor: string): string {
  return \`Hi \${visitor}, you are visitor No.__VISITORS__, welcome to my homepage!\`;
}

console.log(greeting("friend"));

// TODO: replace the placeholders above with your own info
export default me;`,
  },

  "skills.json": {
    lang: "json",
    content: `{
  "languages": ["TypeScript", "Python", "Go", "Rust"],
  "frontend": ["React", "Vue", "Astro", "TailwindCSS"],
  "backend": ["Node.js", "FastAPI", "PostgreSQL"],
  "tools": ["Git", "Docker", "Linux", "Vite"],
  "learning": ["Rust", "AI Engineering"],
  "funFacts": [
    "This homepage is a web page disguised as VS Code",
    "Press Ctrl/Cmd + K to open the command palette",
    "Type help in the terminal for hidden commands"
  ]
}`,
  },

  "contact.md": {
    lang: "md",
    content: `# Contact

- GitHub: [@yang-syzng](https://github.com/yang-syzng)
- Email: [me@example.com](mailto:me@example.com) <!-- TODO: replace with yours -->
- Blog: coming soon…

> If you find this homepage fun, a star on GitHub is appreciated ✨`,
  },
};

/* 中文版内容：切换语言时使用。编辑内容请两个版本一起改 */
export const FILES_ZH = {
  "README.md": {
    lang: "md",
    content: `# yang-syzng · 主页

一个个人主页

## 玩法

- 点击左侧文件树或顶部标签页切换内容
- 按 Ctrl/Cmd + K 唤起命令面板
- 按 Ctrl + \` 打开终端，输入 help 有惊喜
- about.ts 里的访客计数是真实的
- 活动栏最下面的按钮可以切换亮色 / 暗色主题`,
  },

  "about.ts": {
    lang: "ts",
    content: `// yang-syzng · 开发者

const me = {
  name: "yang-syzng",
  role: "开发者",
  location: "Hong Kong",
  interests: ["编程", "开源", "折腾"],
  motto: "Talk is cheap. Show me the code.",
};

function greeting(visitor: string): string {
  return \`Hi \${visitor}, 你是第 __VISITORS__ 位访客, 欢迎来到我的主页!\`;
}

console.log(greeting("朋友"));

// TODO: 把上面的占位信息换成你自己的
export default me;`,
  },

  "skills.json": {
    lang: "json",
    content: `{
  "languages": ["TypeScript", "Python", "Go", "Rust"],
  "frontend": ["React", "Vue", "Astro", "TailwindCSS"],
  "backend": ["Node.js", "FastAPI", "PostgreSQL"],
  "tools": ["Git", "Docker", "Linux", "Vite"],
  "learning": ["Rust", "AI Engineering"],
  "funFacts": [
    "这个主页是一只伪装成 VS Code 的网页",
    "按 Ctrl/Cmd + K 可以唤起命令面板",
    "在终端里输入 help 能看到隐藏命令"
  ]
}`,
  },

  "contact.md": {
    lang: "md",
    content: `# 联系方式

- GitHub: [@yang-syzng](https://github.com/yang-syzng)
- Email: [me@example.com](mailto:me@example.com) <!-- TODO: 换成你的邮箱 -->
- Blog: 敬请期待…

> 觉得这个主页有趣的话，欢迎去 GitHub 点个 star ✨`,
  },
};

/* 侧边栏文件树的展示顺序（文件夹里放子文件；projects/ 由 js/projects.js 动态填充） */
export const TREE = [
  { file: "README.md" },
  { file: "about.ts" },
  { file: "skills.json" },
  {
    folder: "projects",
    children: ["projects/loading.py"],
  },
  { file: "contact.md" },
];
