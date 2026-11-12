/**
 * dsh-quad-layout — 客户端半部。
 *
 * 只做一件事：往 <head> 注入一段 CSS，把内置侧栏（`.wtg9ga_root`）从
 * 「一条纵向长列表」改成「两列网格」：
 *
 *   ① 图标轨 56px —— 品牌 / 新会话 / 面板项（插件、插件市场、军械库……）/ 设置
 *   ② 工作区列   —— sidebar.workspaces 槽位，独占整列高度
 *
 * 展开时：图标轨 + 工作区列并列，工作区不再被面板行压到只剩几百像素高。
 * 折叠时：原生把侧栏列压成 0px；这里用 !important 把它撑回 56px，
 *        变成一个纯图标条，顶部那个面板图标按钮点一下就展开回来。
 *
 * 只覆盖布局，不覆盖颜色：所有色值都用宿主主题 token（--dsw-*）。
 * 不注册任何槽位，避免和内置 sidebar / 第三方插件抢 single 槽。
 * 任何异常都 fail-open：样式注入失败时界面退回原生布局，不白屏。
 */

;(function () {
  if (window.__DSH_QUAD_LAYOUT__ === true) return
  window.__DSH_QUAD_LAYOUT__ = true

  window.__ModuleLoader__.load({
    // 必须是包名：客户端模块表以包名作为行 id 查找工厂
    id: 'dsh-quad-layout',
    factory: (require) => {
      var module = { exports: {} }
      var exports = module.exports
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })

      const TAG_ID = 'dsh-quad-layout/quad.css'

      const CSS = `
/* ════════════════════════════════════════════════════════════════
   dsh-quad-layout · 四栏骨架
   ① 图标轨 56px   ② 工作区列   ③ 主对话   ④ 右侧扩展
   ════════════════════════════════════════════════════════════════ */

/* ── 折叠态：原生把侧栏网格列压成 0px，这里撑回 56px 当图标条 ──
   第三列必须显式给 0，否则 minmax(0,70vw) 会把空白吃到 70vw */
.mP3x-q_frame[data-sidebar-collapsed][data-rightbar-collapsed]:not([data-sidebar-drawer]) {
  grid-template-columns: 56px minmax(0px, 1fr) 0px !important;
}
.mP3x-q_frame[data-sidebar-collapsed]:not([data-rightbar-collapsed]):not([data-sidebar-drawer]) {
  grid-template-columns: 56px minmax(400px, 1fr) minmax(0px, 70vw) !important;
}

/* 图标条的悬停浮层要能溢出侧栏列，不能被裁掉；列宽动画期间再收回 */
.mP3x-q_frame .mP3x-q_sidebarCol {
  overflow: visible !important;
}
.mP3x-q_frame[data-animating] .mP3x-q_sidebarCol {
  overflow: hidden !important;
}

/* ── 侧栏本体：两列网格 ─────────────────────────────────────── */
.wtg9ga_root {
  display: grid !important;
  grid-template-columns: 56px minmax(0px, 1fr) !important;
  grid-template-rows: auto auto minmax(0px, 1fr) auto !important;
  padding: 0 !important;
  gap: 0 !important;
  position: relative;
  overflow: visible !important;
}

/* 行 1 品牌 · 行 2 新会话 · 行 3 面板项 · 行 4 底部工具（横跨两列）
   工作区列独占行 1–3 的第 2 列，拿到整列高度 */
.wtg9ga_root > .wtg9ga_logoRow    { grid-area: 1 / 1 / 2 / 2; }
.wtg9ga_root > .wtg9ga_newSession { grid-area: 2 / 1 / 3 / 2; }
.wtg9ga_root > .wtg9ga_panelList  { grid-area: 3 / 1 / 4 / 2; }
.wtg9ga_root > .wtg9ga_footArea   { grid-area: 4 / 1 / 5 / 3; }
.wtg9ga_root > .wtg9ga_regionArea { grid-area: 1 / 2 / 4 / 3; }

/* 其它零散子节点（如复制版本号的 Toast）不许另起一行抢点击 */
.wtg9ga_root > *:not(.wtg9ga_logoRow):not(.wtg9ga_newSession):not(.wtg9ga_panelList):not(.wtg9ga_regionArea):not(.wtg9ga_footArea) {
  grid-area: 1 / 1 / 5 / 3;
  z-index: 60;
  pointer-events: none;
}

/* ── ① 图标轨里的品牌行：只留 logo，居中 ───────────────────── */
.wtg9ga_root > .wtg9ga_logoRow {
  height: 46px !important;
  margin: 0 !important;
  padding: 10px 0 6px !important;
  justify-content: center !important;
  overflow: visible !important;
}
.wtg9ga_root > .wtg9ga_logoRow .wtg9ga_brandName {
  display: none !important;
}
.wtg9ga_root > .wtg9ga_logoRow > .wtg9ga_brand {
  flex: 0 0 auto !important;
  justify-content: center !important;
  overflow: visible !important;
}

/* ── ① 图标轨里的「新会话」：方形图标按钮 ──────────────────── */
.wtg9ga_root > .wtg9ga_newSession {
  width: 38px !important;
  height: 38px !important;
  margin: 2px auto 10px !important;
  padding: 0 !important;
  border-color: transparent !important;
  background: transparent !important;
  justify-self: center;
}
.wtg9ga_root > .wtg9ga_newSession .wtg9ga_newSessionLabel,
.wtg9ga_root > .wtg9ga_newSession .wtg9ga_newSessionShortcut {
  display: none !important;
}

/* ── ① 图标轨里的面板项：38px 方块，只显示图标 ─────────────── */
.wtg9ga_root > .wtg9ga_panelList {
  flex: 1 1 auto !important;
  margin: 0 !important;
  padding: 4px 0 8px !important;
  gap: 2px !important;
  align-items: center !important;
  overflow: visible !important;
}
.wtg9ga_root > .wtg9ga_panelList .wtg9ga_panelRow {
  width: 38px !important;
  height: 38px !important;
  min-height: 38px !important;
  margin: 0 !important;
  padding: 0 !important;
  border-inline: 0 !important;
  justify-content: center !important;
  position: relative;
}
.wtg9ga_root > .wtg9ga_panelList .wtg9ga_panelTitle {
  display: none !important;
}

/* 悬停浮出名字（标签文本只在 wide 时才渲染，这里借用 aria-label） */
.wtg9ga_root > .wtg9ga_panelList .wtg9ga_panelRow::after {
  content: attr(aria-label);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(-3px);
  padding: 5px 10px;
  border-radius: 8px;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-layer-2, var(--dsw-alias-bg-base));
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
  box-shadow: var(--dsw-shadow-lv3, 0 6px 20px rgba(0, 0, 0, .18));
  opacity: 0;
  pointer-events: none;
  transition: opacity .12s ease, transform .12s ease;
  z-index: 80;
}
.wtg9ga_root > .wtg9ga_panelList .wtg9ga_panelRow:hover::after {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}

/* ── ② 工作区列：与图标轨之间一条细分割线 ──────────────────── */
.wtg9ga_root > .wtg9ga_regionArea {
  margin: 0 !important;
  padding: 0 !important;
  min-width: 0 !important;
  border-left: .5px solid var(--dsw-alias-border-l3);
  overflow: hidden !important;
}

/* ── 底部工具条：横跨两列，保留完整宽度（计费、设置等） ─────── */
.wtg9ga_root > .wtg9ga_footArea {
  margin: 0 !important;
  padding: 4px 6px 6px !important;
  border-top: .5px solid var(--dsw-alias-border-l3);
}

/* ════════════════════════════════════════════════════════════════
   折叠态（纯图标条）：原生在 Windows 标题栏模式下把面板项整段隐藏，
   这里恢复成一条 56px 宽的图标列，并在最上方留一个「展开」按钮。
   ════════════════════════════════════════════════════════════════ */
.wtg9ga_root.wtg9ga_collapsed {
  padding: 8px 0 6px !important;
}

/* 折叠态只需要图标轨那一列 */
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_regionArea {
  display: none !important;
}
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_panelList {
  display: flex !important;
  padding-top: 0 !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  scrollbar-width: none !important;
}
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_panelList::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_footArea {
  display: flex !important;
  border-top: 0 !important;
  padding: 4px 0 0 !important;
  align-items: center !important;
}

/* 顶部：折叠/展开按钮钉死在窗口标题栏左上角，不随侧栏状态移动；
   这一行保持与展开态品牌行同样的高度，下方图标不跳动 */
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_logoRow {
  display: flex !important;
  height: 46px !important;
  margin: 0 !important;
  padding: 10px 0 6px !important;
  justify-content: center !important;
  align-items: center !important;
  overflow: visible !important;
}
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_logoRow .wtg9ga_brand {
  display: none !important;
}
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle {
  position: fixed !important;
  left: 12px !important;
  top: calc((var(--dsh-windows-titlebar-height, 34px) - 28px) / 2) !important;
  width: 28px !important;
  height: 28px !important;
  margin: 0 !important;
  padding: 0 !important;
  border: 0 !important;
  background: transparent !important;
  border-radius: var(--dsw-radius-sm) !important;
  color: var(--dsw-alias-label-secondary) !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  z-index: 30 !important;
  -webkit-app-region: no-drag !important;
}
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle:hover {
  color: var(--dsw-alias-label-primary) !important;
}
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle .wtg9ga_panelIcon {
  display: inline-flex !important;
}
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle .wtg9ga_railMark {
  display: none !important;
}

/* 折叠态的「新会话」也拉回图标轨（原生固定在标题栏） */
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_newSession {
  position: static !important;
  left: auto !important;
  top: auto !important;
  width: 38px !important;
  height: 38px !important;
  margin: 0 auto 10px !important;
  border: 0 !important;
  background: transparent !important;
  justify-self: center !important;
}

/* 折叠态关掉插件自己的 ::after 气泡，避免和内置 Tooltip 双气泡 */
.wtg9ga_root.wtg9ga_collapsed > .wtg9ga_panelList .wtg9ga_panelRow::after {
  content: none !important;
}

/* 悬停浮出「展开工作区」 */
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle::after {
  content: "展开工作区";
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  transform: translateY(-3px);
  padding: 5px 10px;
  border-radius: 8px;
  border: .5px solid var(--dsw-alias-border-l3);
  background: var(--dsw-alias-bg-layer-2, var(--dsw-alias-bg-base));
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
  box-shadow: var(--dsw-shadow-lv3, 0 6px 20px rgba(0, 0, 0, .18));
  opacity: 0;
  pointer-events: none;
  transition: opacity .12s ease, transform .12s ease;
  z-index: 80;
}
.wtg9ga_root.wtg9ga_collapsed .wtg9ga_toggle:hover::after {
  opacity: 1;
  transform: translateY(0);
}
`

      function installStyles() {
        try {
          if (typeof document === 'undefined') return
          const selector = 'style[data-plugin-css=' + JSON.stringify(TAG_ID) + ']'
          const existing = document.querySelector(selector)
          if (existing !== null) {
            // 已注入过：内容变了就就地更新，热重载时样式能跟着刷新
            if (existing.textContent !== CSS) existing.textContent = CSS
            return
          }
          const tag = document.createElement('style')
          tag.dataset.plugin = 'dsh-quad-layout'
          tag.dataset.pluginCss = TAG_ID
          tag.textContent = CSS
          document.head.appendChild(tag)
        } catch (err) {
          // fail-open：样式注入失败也要让宿主继续跑
          console.warn('[dsh-quad-layout] style injection failed', err)
        }
      }

      function apply() {
        installStyles()
      }

      module.exports = {
        name: 'dsh-quad-layout',
        inject: [],
        apply,
        __internals: { CSS, TAG_ID }
      }
      return module.exports
    }
  })
})()
