import type { Router, RouteRecordRaw } from 'vue-router';

import { usePermissionStore } from '/@/store/modules/permission';

import { PageEnum } from '/@/enums/pageEnum';
import { useUserStore } from '/@/store/modules/user';

import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isEmpty } from '/@/utils/is';
import { getLinksToken } from '/@/logics/token';

import { usePageCacheStoreWithOut } from '/@/store/modules/pageCache';

const LOGIN_PATH = PageEnum.BASE_LOGIN;
const PREVIEW_H5 = PageEnum.PREVIEW_H5;

// 白名单
const whitePathList: PageEnum[] = [LOGIN_PATH, PREVIEW_H5];

/**
 * 权限控制
 *
 * @export
 * @param {Router} router
 */
export function createPermissionGuard(router: Router) {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  const pageCacheStore = usePageCacheStoreWithOut();

  router.beforeEach(async (to, from, next) => {
    //  在处理登录后跳转到404页面
    if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
      next(PageEnum.BASE_HOME);
      return true;
    }

    // 可以直接输入白名单
    const hasPath = whitePathList.find((item) => to.path.indexOf(item) != -1) as PageEnum;
    if (whitePathList.includes(to.path as PageEnum) || whitePathList.includes(hasPath)) {
      next();
      return true;
    }

    // 处理缓存页面
    if (to.meta.parent && to.meta.parent === from.name) {
      pageCacheStore.addCachePage(from.name);
    } else if (from.meta.parent && from.meta.parent === to.name) {
      pageCacheStore.addCachePage(to.name);
    } else {
      pageCacheStore.resetCachePage();
    }

    const token = getLinksToken();

    // token不存在
    if (!token) {
      // 路由meta设置了ignoreAuth: true则可放行
      if (to.meta.ignoreAuth) {
        next();
        return true;
      }

      // 重定向到登录页面
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      };
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        };
      }
      next(redirectData);
      return true;
    } else {
      if (!userStore.getUserInfo || isEmpty(userStore.getUserInfo)) {
        try {
          await userStore.getUserInfoAction();
        } catch (err) {
          console.log('err', err);

          const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
            path: LOGIN_PATH,
            replace: true,
          };
          next(redirectData);
          return;
        }
      }
    }

    // 判断是否已经动态添加路由
    if (permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    // 获取当前登录有用户有权限的路由
    const routes = await permissionStore.buildRoutesAction();

    routes.forEach((route) => {
      // 动态添加路由
      router.addRoute(route as RouteRecordRaw);
    });

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    // 设置已经动态添加路由
    permissionStore.setDynamicAddedRoute(true);
    next(nextData);
  });
}
