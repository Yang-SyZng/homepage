/* ==================================================================
 * 全局可变状态：所有模块共享的运行时状态都放在这里，
 * 模块之间不直接互相写变量，统一通过 state 对象读写
 * ================================================================== */

import { FILES_EN } from "./content.js";

export const state = {
  lang: localStorage.getItem("hp-lang") || "en", // 当前界面语言
  files: FILES_EN, // 当前语言的文件内容（含动态抓取的 projects）
  openTabs: ["README.md", "about.ts"], // 打开的标签页
  activeFile: "about.ts", // 当前激活的文件
  navStack: [], // 文件切换历史（标题栏前进 / 后退用）
  navIndex: -1, // 当前在历史中的位置
  folderOpen: true, // projects 文件夹是否展开
  treeRootOpen: true, // HOMEPAGE 根节点是否展开
  mdPreviewOpen: false, // Markdown 侧边预览是否打开
  projectsRendered: false, // 已经渲染过真实项目数据（降级时不再覆盖）
  pinnedPaths: new Set(), // GitHub profile 上 pinned 的仓库路径
  visitorCount: null, // 访问人次（null = 未知，显示 …）
};

/* 初始位置也是历史的一站（同 VS Code）：首次切换文件后即可"后退"回来 */
state.navStack.push(state.activeFile);
state.navIndex = 0;
