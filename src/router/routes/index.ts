import type { AppRouteRecordRaw } from '/@/router/types';

import { PageEnum } from '/@/enums/pageEnum';

export const asyncRoutes = [PageEnum.BASE_HOME];

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  // redirect: '/home/index',
  component: () => import('/@/views/Home/index.vue'),
  meta: {
    title: 'Root',
  },
};

export const basicRoutes = [RootRoute];
