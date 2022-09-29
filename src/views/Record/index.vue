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
    <Table :dataSource="recordList" :columns="recordColumns">
      <template #bodyCell="{ record, column, index }">
        <!-- 内容 -->
        <template v-if="column.key === 'content'">
          <template v-if="record.type === 'text'">
            <div class="content" v-html="record.content"></div>
          </template>
          <template v-else-if="record.type === 'image'">
            <div class="content">
              <img :src="record.content" />
            </div>
          </template>
        </template>
        <!-- 分类 -->
        <template v-if="column.key === 'categoryId'">
          <Select
            style="width: 100%"
            :options="categoryList"
            :fieldNames="{
              label: 'name',
              value: '_id',
            }"
            v-model:value="record.categoryId"
            @change="(value: string) => handleChangeCategory(value, record)"
          />
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
          <Button size="small" @click="handleSaveData(record)" v-if="record._id" type="primary">
            <CopyText :copyText="record.content" showInnerText="复制" />
          </Button>
        </template>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
  import {
    Button,
    Table,
    Form,
    Input,
    FormInstance,
    Row,
    Col,
    FormItem,
    Select,
  } from 'ant-design-vue';
  import Record from '../../../electron/libs/indexDB/record';
  import CategoryDB from '../../../electron/libs/indexDB/category';
  import { onMounted, ref, defineComponent, reactive } from 'vue';
  import { ICategory, IClipboardList } from '../../api/clipboard/model';

  import CopyText from '/@/components/CopyText/CopyText.vue';

  import { recordColumns } from './data';

  defineComponent({
    name: 'HomeIndex',
  });

  const categoryDB = new CategoryDB();

  let getAllDataRef = ref();

  const recordData = new Record();

  const recordList = ref<IClipboardList[]>([]);
  const categoryList = ref<ICategory[]>([]);

  const isSearch = ref(false);

  async function handleDeleteData(record: ICategory, index: number) {
    await recordData.deleteData(record._id!);
    record._id = '';
    record.content = '';
    // if (isSearch.value) {
    recordList.value.splice(index, 1);
    // }
  }

  async function handleSaveData(record: ICategory) {
    console.log(record);
  }

  const formRef = ref<FormInstance>();
  const formState = reactive({
    queryData: '',
  });
  const onFinish = async () => {
    isSearch.value = true;
    const data = await recordData.queryData(formState.queryData);
    recordList.value = data as ICategory[];
    window.clearInterval(getAllDataRef.value);
  };

  async function getAllData() {
    const data = await recordData.getData();
    recordList.value = data as any[];
  }

  const onReset = () => {
    isSearch.value = false;
    console.log('reset');
    getAllData();

    getAllDataRef.value = setInterval(async () => {
      getAllData();
    }, 1000);
  };

  function handleChangeCategory(value: string, option: ICategory | Array<ICategory>) {
    console.log(value, option);
    recordData.updateData(option);
  }

  async function getData() {
    const data = await recordData.getData();
    recordList.value = data as ICategory[];
  }

  onMounted(async () => {
    /**
     * 初始化
     */
    recordData.init();
    categoryDB.init();

    // getAllDataRef.value = setInterval(async () => {
    //   const data = await recordData.getData();
    //   recordList.value = data as ICategory[];
    // }, 1000);

    setTimeout(async () => {
      await getData();
      categoryList.value = await categoryDB.getData();
      console.log(categoryList.value);
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
