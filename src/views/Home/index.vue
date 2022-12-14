<template>
  <div class="container wrapper-container">
    <Form
      ref="formRef"
      name="advanced_search"
      class="ant-advanced-search-form"
      :model="formState"
      @finish="onFinish"
      @reset="onReset"
    >
      <Row :gutter="24">
        <Col :span="8">
          <FormItem name="queryData" label="搜索内容">
            <Input v-model:value="formState.queryData" placeholder="请输入搜索关键字" />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :span="24" style="text-align: right">
          <Button type="primary" html-type="submit">Search</Button>
          <Button style="margin: 0 8px" html-type="reset">Clear</Button>
        </Col>
      </Row>
    </Form>
    <Table :dataSource="clipboardList" :columns="homeColumns">
      <template #bodyCell="{ record, column, index }">
        <!-- 内容 -->
        <template v-if="column.key === 'content'">
          <template v-if="record.type === 'text'">
            <!-- {{ record.content }} -->
            <div class="content" v-html="record.content"></div>
          </template>
          <template v-else-if="record.type === 'image'">
            <div class="content">
              <img :src="record.content" />
            </div>
          </template>
        </template>
        <!-- 操作栏 -->
        <template v-else-if="column.key === 'action'">
          <Button
            size="small"
            @click="handleDeleteData(record, index)"
            v-if="record._id"
            type="primary"
            danger
          >
            删除
          </Button>
          <Button size="small" @click="handleSaveData(record)" v-if="record._id"> 保存 </Button>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
  import { Button, Table, Form, Input, FormInstance, Row, Col, FormItem } from 'ant-design-vue';
  import IndexDB from '../../../electron/libs/indexDB';
  import RecordDB from '../../../electron/libs/indexDB/record';

  import { onMounted, ref, defineComponent, reactive } from 'vue';
  import { IClipboardList } from '../../api/clipboard/model';

  import { homeColumns } from './data';

  defineComponent({
    name: 'HomeIndex',
  });

  let getAllDataRef = ref();

  const indexDB = new IndexDB();
  const recordDB = new RecordDB();

  const clipboardList = ref<IClipboardList[]>([]);

  const isSearch = ref(false);

  async function handleDeleteData(record: IClipboardList, index: number) {
    await indexDB.deleteData(record._id!);
    record._id = '';
    record.content = '';
    if (isSearch.value) {
      clipboardList.value.splice(index, 1);
    }
  }

  async function handleSaveData(record: IClipboardList) {
    console.log(record);
    recordDB.addData([
      {
        ...record,
        categoryId: '',
      },
    ]);
  }

  const formRef = ref<FormInstance>();

  const formState = reactive({
    queryData: '',
  });

  const onFinish = async () => {
    isSearch.value = true;
    const data = await indexDB.queryData(formState.queryData);
    clipboardList.value = data as IClipboardList[];
    window.clearInterval(getAllDataRef.value);
  };

  async function getAllData() {
    const data = await indexDB.getData();
    clipboardList.value = data as any[];
  }

  const onReset = () => {
    isSearch.value = false;
    console.log('reset');
    getAllData();

    getAllDataRef.value = setInterval(async () => {
      getAllData();
    }, 1000);
  };

  onMounted(() => {
    /**
     * 初始化
     */
    indexDB.init();
    recordDB.init();

    getAllDataRef.value = setInterval(async () => {
      const data = await indexDB.getData();
      clipboardList.value = data as any[];
    }, 1000);
  });
</script>

<style lang="less" scoped>
  .container {
    padding: 16px;
  }

  .ant-advanced-search-form {
    margin-bottom: 10px;
  }

  .content {
    :deep(img) {
      width: 100%;
    }
  }
</style>
