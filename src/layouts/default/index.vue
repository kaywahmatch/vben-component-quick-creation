<template>
  <Layout>
    <LayoutHeader> LayoutHeader </LayoutHeader>
    <Layout>
      <LayoutSider> 菜单导航 </LayoutSider>
      <LayoutContent>
        <RouterView />
      </LayoutContent>
    </Layout>
  </Layout>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Layout, LayoutHeader, LayoutContent, LayoutSider } from 'ant-design-vue';

  export default defineComponent({
    name: 'DefaultLayout',

    components: {
      Layout,
      LayoutHeader,
      LayoutContent,
      LayoutSider,
    },

    setup() {
      return {};
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-default-layout';

  .@{prefix-cls} {
    width: 100%;
    min-height: 100%;
    background-color: @content-bg;
    flex-direction: column;

    > .ant-layout {
      min-height: 100%;
    }

    &-main {
      width: 100%;
      margin-left: 1px;
      padding-top: 56px;
    }
  }
</style>
