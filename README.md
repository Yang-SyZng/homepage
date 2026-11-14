# yang-syzng · homepage

A personal homepage disguised as VS Code, built in the rounded **Modern UI** style (like VS Code 1.133): rounded surfaces, connected tabs, command palette, and a working fake terminal. Hosted on GitHub Pages: **https://yang-syzng.github.io/homepage/**

Plain HTML / CSS / JavaScript — zero dependencies, zero build step. Push to deploy.

## Tips

- Click files in the explorer or the tabs above to switch content
- Press `Ctrl/Cmd + K` for the command palette
- Press ``Ctrl + ` `` to open the terminal, type `help` — try `neofetch`
- The visitor count in `about.ts` is **real**, powered by the free [Abacus](https://github.com/jasoncameron/Abacus) counter
- The bottom button in the activity bar toggles light / dark theme (preference is remembered)

## Customize

All page content lives in the `FILES` object at the top of [app.js](app.js) —
plain text only, no frontend knowledge needed:

- `about.ts` — about me
- `skills.json` — skills
- `projects/*` — projects
- `contact.md` — contact info

Search for `TODO` to find every placeholder to replace. Push and GitHub Pages
redeploys automatically.

> The visitor counter uses the `COUNTER_NS` namespace in `app.js`. After forking,
> change it to something unique so your count starts from zero.
