import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';

const home: AppRouteModule = {
  path: '/',
  name: 'Home',
  component: LAYOUT,
  // redirect: '/home/index',
  meta: {
    icon: 'ant-design:home-outlined',
    title: '首页',
    orderNo: 1,
    hideChildrenInMenu: true,
  },
  children: [
    {
      path: 'index',
      name: 'Index',
      component: () => import('/@/views/Home/index.vue'),
      meta: {
        icon: 'ion:grid-outline',
        title: '首页',
      },
    },
    {
      path: 'category',
      name: 'Category',
      component: () => import('/@/views/Category/index.vue'),
      meta: {
        icon: 'ion:grid-outline',
        title: '分类',
      },
    },
    {
      path: 'record',
      name: 'Record',
      component: () => import('/@/views/Record/index.vue'),
      meta: {
        icon: 'ion:grid-outline',
        title: '记录',
      },
    },
  ],
};

export default home;
