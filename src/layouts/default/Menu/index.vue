<template>
  <div>
    <Menu
      v-model:selectedKeys="selectedKeys"
      style="width: 100%"
      mode="inline"
      :open-keys="openKeys"
      @openChange="onOpenChange"
    >
      <SubMenu key="sub1">
        <template #icon>
          <MailOutlined />
        </template>
        <template #title>Navigation One</template>
        <MenuItem key="1">Option 1</MenuItem>
        <MenuItem key="2">Option 2</MenuItem>
        <MenuItem key="3">Option 3</MenuItem>
        <MenuItem key="4">Option 4</MenuItem>
      </SubMenu>
      <SubMenu key="sub2">
        <template #icon></template>
        <template #title>
          <AppstoreOutlined />
          Navigation Two
        </template>
        <MenuItem key="5">Option 5</MenuItem>
        <MenuItem key="6">Option 6</MenuItem>
        <SubMenu key="sub3" title="Submenu">
          <MenuItem key="7">Option 7</MenuItem>
          <MenuItem key="8">Option 8</MenuItem>
        </SubMenu>
      </SubMenu>
      <SubMenu key="sub4">
        <template #icon>
          <SettingOutlined />
        </template>
        <template #title>Navigation Three</template>
        <MenuItem key="9">Option 9</MenuItem>
        <MenuItem key="10">Option 10</MenuItem>
        <MenuItem key="11">Option 11</MenuItem>
        <MenuItem key="12">Option 12</MenuItem>
      </SubMenu>
    </Menu>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, toRefs } from 'vue';
  import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue';
  import { Menu, MenuItem, SubMenu } from 'ant-design-vue';

  export default defineComponent({
    name: 'LayoutsMenu',
    components: {
      MailOutlined,
      AppstoreOutlined,
      SettingOutlined,
      Menu,
      MenuItem,
      SubMenu,
    },
    setup() {
      const state = reactive({
        rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
        openKeys: ['sub1'],
        selectedKeys: [],
      });
      const onOpenChange = (openKeys: string[]) => {
        const latestOpenKey = openKeys.find((key) => state.openKeys.indexOf(key) === -1);
        if (state.rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
          state.openKeys = openKeys;
        } else {
          state.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
      };
      return {
        ...toRefs(state),
        onOpenChange,
      };
    },
  });
</script>
