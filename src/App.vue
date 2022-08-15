<template>
  <ConfigProvider :locale="locale"> <RouterView /> </ConfigProvider>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { ConfigProvider } from 'ant-design-vue';
  import 'moment/dist/locale/zh-cn';
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';

  export default defineComponent({
    name: 'App',
    components: { ConfigProvider },
    setup() {
      return {
        locale: zhCN,
      };
    },
  });
</script>
