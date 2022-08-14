import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { loadEnv } from 'vite';
import { resolve } from 'path';

import { wrapperEnv } from './build/utils';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    console.log('vite');
  }
  const root = process.cwd();

  //  loadEnv读取的布尔类型是一个字符串。这个函数可以转换为布尔类型
  const env = loadEnv(mode, root);

  const viteEnv = wrapperEnv(env);

  const { VITE_PORT } = viteEnv;

  return {
    plugins: [vue()],
    base: '', //解决编译后白屏问题， 默认是'/'
    build: {
      outDir: 'dist/src',
    },
    server: {
      port: VITE_PORT,
    },
  };
});
