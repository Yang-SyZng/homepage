# yang-syzng · homepage

A personal homepage disguised as VS Code, built in the rounded **Modern UI** style (like VS Code 1.133): rounded surfaces, connected tabs, command palette, and a working fake terminal. Hosted on GitHub Pages: **https://yang-syzng.github.io/homepage/**

Plain HTML / CSS / JavaScript — zero dependencies, zero build step. Push to deploy.
The scripts are native **ES modules** (`<script type="module">`), so for local
preview serve the folder over HTTP (e.g. `python3 -m http.server`) instead of
opening `index.html` from disk; GitHub Pages works as-is.

## Project structure

```
index.html      markup shell
seti.woff       Seti icon font (from VS Code)
js/
  main.js       entry: init, shortcuts, settings menu, language switching
  state.js      shared mutable runtime state
  content.js    ★ all page content (FILES_EN / FILES_ZH), profile, tree
  i18n.js       UI strings in English & Chinese
  editor.js     file tree, tabs, code editor, minimap, markdown preview
  highlight.js  tiny syntax highlighter
  icons.js      Seti file icons + git badges
  langs.js      language → extension metadata for generated project files
  projects.js   fetches public GitHub repos into projects/
  palette.js    command palette (Ctrl/Cmd + K)
  quickopen.js  command center / quick open (Ctrl/Cmd + P)
  terminal.js   fake terminal
  visitors.js   Abacus visitor counter
  ui.js         theme, sidebar, toasts
  util.js       small shared helpers
style/          one stylesheet per component, mirrors js/
  base.css      variables, dark / light themes, reset, window shell
  titlebar.css  title bar, command center, quick open
  activitybar.css activity bar, avatar, settings menu
  sidebar.css   explorer sidebar, file tree, outline
  editor.css    tabs, code area, minimap, editor groups, preview
  terminal.css  fake terminal
  statusbar.css status bar
  palette.css   command palette
  toast.css     notification toast
  responsive.css small-screen adjustments
```

## Tips

- Click files in the explorer or the tabs above to switch content
- Press `Ctrl/Cmd + K` for the command palette
- Press ``Ctrl + ` `` to open the terminal, type `help` — try `neofetch`
- The visitor count in `about.ts` is **real**, powered by the free [Abacus](https://github.com/jasoncameron/Abacus) counter
- The bottom button in the activity bar toggles light / dark theme (preference is remembered)

## Customize

All page content lives in the `FILES_EN` / `FILES_ZH` objects at the top of
[js/content.js](js/content.js) —
plain text only, no frontend knowledge needed:

- `about.ts` — about me
- `skills.json` — skills
- `projects/*` — projects
- `contact.md` — contact info

Search for `TODO` to find every placeholder to replace. Push and GitHub Pages
redeploys automatically.

> The visitor counter uses the `COUNTER_NS` namespace in [js/content.js](js/content.js).
> After forking, change it to something unique so your count starts from zero.
