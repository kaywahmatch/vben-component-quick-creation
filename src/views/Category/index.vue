<template>
  <div class="category wrapper-container" id="abc">
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
    <Table :dataSource="categoryList" :columns="categoryColumns">
      <template #title>
        <div class="custom-table-header">
          <div class="custom-table-header_left"></div>
          <div class="custom-table-header_right">
            <Button @click="addCategory" type="primary"> 新建分类 </Button>
          </div>
        </div>
      </template>
      <template #bodyCell="{ record, column, index }">
        <!-- 操作栏 -->
        <template v-if="column.key === 'action'">
          <Button size="small" @click="handleEditCategory(record)" v-if="record._id" type="primary">
            编辑
          </Button>

          <Button
            size="small"
            @click="handleDeleteData(record, index)"
            v-if="record._id"
            type="primary"
            danger
            >删除</Button
          >
        </template>
      </template>
    </Table>
  </div>

  <AddCategory
    v-if="addCategoryVisible"
    @closeModal="closeModal"
    @success="addCategorySuccess"
    :data="editCategoryData"
  />
</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, reactive, ref } from 'vue';

  import { Button, Table, Form, Input, FormInstance, Row, Col, FormItem } from 'ant-design-vue';

  import AddCategory from './components/AddCategory/index.vue';

  import CateogryDB from '../../../electron/libs/indexDB/category';
  import { IAddCategory } from '/@/api/clipboard/model';

  import { categoryColumns } from './data';

  defineComponent({
    name: 'Category',
  });

  const cateogryDB = new CateogryDB();

  const categoryList = ref([] as IAddCategory[]);

  const handleDeleteData = async (record: Recordable, index: number) => {
    console.log('handleDeleteData', record, index);
    const response = await cateogryDB.deleteData(record._id!);
    if (response.code) {
      await getAllData();
    }
  };

  const formRef = ref<FormInstance>();

  const formState = reactive({
    queryData: '',
  });

  const isSearch = ref(false);

  const onFinish = async () => {
    isSearch.value = true;
    const data = await cateogryDB.queryData(formState.queryData);
    categoryList.value = data as IAddCategory[];
  };

  const onReset = () => {
    isSearch.value = false;
    getAllData();
  };

  const addCategoryVisible = ref(false);

  const closeModal = (visible: boolean) => {
    if (!visible) {
      addCategoryVisible.value = false;
    }
  };

  const editCategoryData = ref({} as IAddCategory);

  /**
   * 新建分类
   */
  const addCategory = () => {
    editCategoryData.value = {};
    addCategoryVisible.value = true;
  };

  const handleEditCategory = (data: IAddCategory) => {
    editCategoryData.value = data;
    addCategoryVisible.value = true;
  };

  const addCategorySuccess = async () => {
    closeModal(false);
    await getAllData();
  };

  /**
   * 获取数据
   */
  async function getAllData() {
    const data = await cateogryDB.getData();
    categoryList.value = data as IAddCategory[];
  }

  onMounted(async () => {
    cateogryDB.init();

    setTimeout(async () => {
      await getAllData();
    }, 1000);
  });
</script>

<style lang="less" scoped></style>
