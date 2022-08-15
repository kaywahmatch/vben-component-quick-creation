import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes } from './routes';
import { AppRouteRecordRaw } from './types';
import { PageEnum } from '../enums/pageEnum';

/**
 * 声明路由
 */
export const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  routes: basicRoutes as unknown as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * 配置路由
 */
export function setupRouter(app: App<Element>) {
  console.log(router);

  app.use(router);
}
