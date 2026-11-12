# dsh-quad-layout

Four-column layout for DeepSeek Harness: split the left sidebar into a 56px icon rail plus a full-height workspace column.

把 DSH 左侧栏拆成「图标轨 + 工作区列」两段，形成四栏布局：

```
┌────┬─────────────┬──────────────────┬──────────┐
│icon│  workspace  │   main chat      │  right   │
│rail│  /sessions  │                  │  panel   │
└────┴─────────────┴──────────────────┴──────────┘
```

## What it solves / 解决什么问题

The built-in sidebar stacks the panel icons and the workspace session list vertically inside one 264–420px column, so session titles get squeezed down to a few characters. This plugin turns that column sideways: 56px of icons on the left, the whole column height left for the session list.

On Windows desktop the built-in sidebar also sets `display: none` on the icon list when collapsed, leaving only two small buttons in the title bar — the panels become unreachable. This plugin keeps the 56px icon rail in the collapsed state and keeps the expand button at the top of the rail.

原生侧栏把「面板图标」和「工作区会话列表」上下堆在同一个 264–420px 的列里，会话标题被挤到只剩几个字。本插件把这个列横过来：左边 56px 只放图标，右边整列高度都给会话列表。另外，原生在 Windows 桌面端折叠侧栏时会把图标列表整个 `display:none`，只剩两个贴在标题栏的小按钮，没法再从图标进入面板；本插件让折叠态保留 56px 图标轨，并在轨道顶部保留展开按钮。

## Install / 安装

```powershell
dsh plugin --profile <profile> add dsh-quad-layout@https://github.com/lmmcsb/dsh-quad-layout/releases/latest/download/dsh-quad-layout.tgz
```

Or straight from the repository source (no build step, no `allowBuilds` approval needed):

```powershell
dsh plugin --profile <profile> add github:lmmcsb/dsh-quad-layout
```

Replace `<profile>` with your profile name (`desktop` for the desktop app). Restart the DSH desktop app once after installing: the host snapshots its boot injection list at process start, so a freshly installed client plugin only reaches the page after a restart. (After the restart `<script src="dsh-app://app/plugins/dsh-quad-layout/client.js?rev=...">` shows up and the CSS is injected automatically.)

装完**需要重启一次 DSH 桌面 App** 才会生效：桌面端在 host 进程启动那一刻把注入清单（boot injections）快照下来，之后页面刷新拿到的都是这份快照，所以新装的客户端插件必须重启才进页面。

## How it works / 实现方式

One injected stylesheet. No host code changes, no slot registration, no React tree takeover:

- Targets the built-in class prefixes: sidebar `.wtg9ga_*`, frame `.mP3x-q_*`.
- `.wtg9ga_root` goes from `flex-direction: column` to a two-column grid: 56px on the left (logo / new session / panel list / footer), `minmax(0,1fr)` on the right for the workspace at full column height.
- Panel items keep only a 38×38 icon in the 56px column; the name floats out on hover via `::after { content: attr(aria-label) }` (the built-in UI renders text and icon into the DOM and then hides the text, so reading `aria-label` is the cheapest path).
- Collapsed state (`[data-sidebar-collapsed]`) widens the frame's first grid column from 0 back to 56px and undoes the three built-in `display: none` rules.
- Every colour comes from `--dsw-*` theme tokens, so light and dark themes both follow. All failures are fail-open: if injection fails the UI falls back to the native layout.

## Layout / 目录

```
dsh-quad-layout/
├── cordis.patch.yml      # inserts this package into the profile's loader list
├── package.json          # dsh.bundle.patch + dsh.client (platform: web)
├── lib/
│   ├── index.js          # host half: empty placeholder so the patch resolves
│   └── client.js         # client half: injects the CSS
└── README.md
```

## Known limits / 已知边界

- Sidebar width is still controlled by the built-in drag handle (264–420px). The workspace column is that width minus 56px.
- The CSS depends on the built-in class prefixes `wtg9ga_` / `mP3x-q_`. If a DSH upgrade renames them the plugin silently stops applying and the native layout returns — it never breaks functionality.
- Sidebar width is not persisted (the built-in behaviour does not persist it either; a reload returns to the default 280).

## License

MIT
