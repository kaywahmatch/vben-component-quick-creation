import type { Router } from 'vue-router';

/**
 * 配置菜单信息
 *
 * @export
 * @param {Router} router
 */
export function createParamMenuGuard(router: Router) {
  router.beforeEach(async (to, _, next) => {
    // 过滤无名称路由

    next();
  });
}
