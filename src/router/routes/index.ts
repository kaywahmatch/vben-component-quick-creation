import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';

const modules = import.meta.globEager('./modules/**/*.ts');

export const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

import { PageEnum } from '/@/enums/pageEnum';

export const asyncRoutes = [...routeModuleList];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const basicRoutes = [RootRoute, ...routeModuleList];
