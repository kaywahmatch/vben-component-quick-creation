import type { Router } from 'vue-router';

import { PageEnum } from '/@/enums/pageEnum';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    if (!to.meta.hideMenu && to.path !== PageEnum.BASE_HOME) {
    }
  });
}
