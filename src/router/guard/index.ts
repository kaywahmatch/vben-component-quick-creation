import type { Router, RouteLocationNormalized } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';

import { unref } from 'vue';

import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';

import { createParamMenuGuard } from './paramMenuGuard';

// import { getToken } from '/@/utils/auth';

/**
 * 用于处理页面状态的钩子
 *
 * @param {Router} router 路由实例
 */
function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async (to) => {
    // 页面已经加载，再次打开会更快，不需要进行加载和其他处理
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // 通知路由变化

    return true;
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}

/**
 * 路由开关回到顶部
 *
 * @param {Router} router
 */
function createScrollGuard(router: Router) {
  const isHash = (href: string) => {
    return /^#/.test(href);
  };

  const body = document.body;

  router.afterEach(async (to) => {
    // 滚动到顶部
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);
  });
}

/**
 * 执行路由守卫
 * !注意调用顺序
 *
 * @export
 * @param {Router} router 路由实例
 */
export function setupRouterGuard(router: Router) {
  console.log('🚀 ~ file: index.ts ~ line 61 ~ setupRouterGuard ~ router', router);
  // 用于处理页面状态的钩子
  // createPageGuard(router);
  // 用于处理页面加载状态
  // createPageLoadingGuard(router);
  // 当路由切换时，用来关闭当前页以完成请求的接口
  // createHttpGuard(router);
  // 路由开关回到顶部
  // createScrollGuard(router);
  // 用于在路由切换时关闭消息实例
  // createMessageGuard(router);
  // 页面加载进度条
  // createProgressGuard(router);
  // createPermissionGuard(router);
  createParamMenuGuard(router); // 必须在createPermissionGuard之后(菜单已经构建。)
  // createStateGuard(router);
}
