export const PARENT_LAYOUT_NAME = 'ParentLayout';

/**
 * 默认布局
 */
export const LAYOUT = () => import('/@/layouts/default/index.vue');

/**
 * 获取父容器布局
 */
export const getParentLayout = (_name?: string) => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: PARENT_LAYOUT_NAME,
      });
    });
};
