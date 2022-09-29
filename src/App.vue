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

<style lang="less">
  body {
    background-color: rgb(153, 28, 87) !important;
    color: #fff;

    .ant-layout {
      min-height: 100vh;
      .actions {
        .ant-btn {
          margin: 0 5px;
        }
      }
    }

    & .ant-layout-header {
      color: #fff;
    }

    .ant-btn {
      font-size: 12px;
    }

    .custom-table-header {
      display: flex;
      justify-content: space-between;
    }
  }

  body,
  #app,
  .ant-layout {
    min-height: 100vh;
    color: #fff;
    font-size: 12px;
  }

  .wrapper-container {
    padding: 16px;
  }
</style>
