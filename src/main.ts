import { createApp } from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from './router/guard';

async function bootstrap() {
  const app = createApp(App);

  setupRouter(app);

  setupRouterGuard(router);

  await router.isReady();

  app.mount('#app', true);
}

void bootstrap();
