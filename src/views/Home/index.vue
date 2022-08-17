<template>
  <Table :dataSource="clipboardList" :columns="columns">
    <template #bodyCell="{ record, index, column }">
      <!-- 内容 -->
      <template v-if="column.key === 'content'">
        <template v-if="record.type === 'text'">
          {{ record.content }}
        </template>
        <template v-else-if="record.type === 'image'">
          <!-- <img :src="JSON.parse(record.content)" style="width: 100px" /> -->
          {{ record.content }}
        </template>
      </template>
      <!-- 操作栏 -->
      <template v-else-if="column.key === 'action'">
        <Button size="small" @click="handleDeleteData(record._id, index)">X</Button>
      </template>
    </template>
  </Table>
</template>

<script lang="ts" setup>
  import { Button, Table } from 'ant-design-vue';
  import IndexDB from '../../../electron/libs/indexDB';
  import { onMounted, ref, defineComponent } from 'vue';
  import { IClipboardList } from '../../api/clipboard/model';

  defineComponent({
    name: 'HomeIndex',
  });

  const columns = [
    {
      title: 'id',
      dataIndex: '_id',
      key: '_id',
      width: 140,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
    },
  ];

  const indexDB = new IndexDB();

  const clipboardList = ref<IClipboardList[]>([]);

  async function handleDeleteData(id: string | number, index: number) {
    await indexDB.deleteData(id);
    clipboardList.value.splice(index, 1);
  }

  onMounted(() => {
    /**
     * 初始化
     */
    indexDB.init();

    setInterval(async () => {
      const data = await indexDB.getData();
      clipboardList.value = data as any[];
    }, 1000);
  });
</script>

<style lang="less" scoped></style>
