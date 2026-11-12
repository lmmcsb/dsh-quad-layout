/**
 * dsh-quad-layout — 宿主侧半部。
 *
 * 本插件只改前端样式，宿主侧不需要任何服务、路由或配置。
 * 保留这个模块是因为 bundle patch 的 insert 需要该包能被宿主解析到一个
 * 合法的 Cordis 插件入口（具名导出 name / apply）。
 */

export const name = 'dsh-quad-layout'

export const inject = []

export function apply() {
  // 无宿主侧行为。前端部分见 ./client.js。
}
