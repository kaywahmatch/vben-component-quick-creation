import type { AppRouteRecordRaw } from '/@/router/types';
// import {
//   PAGE_NOT_FOUND_ROUTE,
//   REDIRECT_ROUTE,
//   WX_AUTH_ROUTE,
//   CLIENT_ROUTE,
// } from '/@/router/routes/basic';
import { PageEnum } from '/@/enums/pageEnum';

// const modules = import.meta.globEager('./modules/**/*.ts');

// export const routeModuleList: AppRouteModule[] = [];

// Object.keys(modules).forEach((key) => {
//   const mod = modules[key].default || {};
//   const modList = Array.isArray(mod) ? [...mod] : [mod];
//   routeModuleList.push(...modList);
// });

export const asyncRoutes = [PageEnum.BASE_HOME];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  // redirect: '/home/index/2',
  component: () => import('/@/views/Home/index.vue'),
  meta: {
    title: 'Root',
  },
};

// Basic routing without permission
export const basicRoutes = [RootRoute];
