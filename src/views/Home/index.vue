<template>
  <Table :dataSource="clipboardList" :columns="columns">
    <template #bodyCell="{ record, index, column }">
      <template v-if="column.key === 'action'">
        <Button size="small" @click="handleDeleteData(record._id, index)">X</Button>
      </template>
    </template>
  </Table>
</template>

<script lang="ts" setup>
  import { Button, Table } from 'ant-design-vue';
  import IndexDB from '/@/libs/indexDB';
  import { onMounted, ref, defineComponent } from 'vue';

  defineComponent({
    name: 'HomeIndex',
  });

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Action',
      key: 'action',
    },
  ];

  const indexDB = new IndexDB();

  const clipboardList = ref<any[]>([]);

  async function handleDeleteData(id: string | number, index: number) {
    await indexDB.deleteData(id);
    clipboardList.value.splice(index, 1);
  }

  onMounted(() => {
    indexDB.init();
    // indexDB.getData();
    console.log('🚀 ~ file: App.vue ~ line 19 ~ onMounted ~ indexDB', indexDB);

    setInterval(async () => {
      const data = await indexDB.getData();
      clipboardList.value = data as any[];
    }, 1000);
  });
</script>

<style lang="less" scoped></style>
