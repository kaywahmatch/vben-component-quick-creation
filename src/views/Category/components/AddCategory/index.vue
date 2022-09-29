<template>
  <Modal
    v-bind="$attrs"
    visible
    class="add-flassification"
    @ok="handleOk"
    @cancel="cancel"
    title="添加分类"
  >
    {{ formState.value }}
    <Form ref="formRef" name="advanced_search" class="ant-advanced-search-form" :model="formState">
      <Row :gutter="24">
        <Col :span="24">
          <FormItem name="name" label="排序">
            <Input v-model:value="formState.sort" placeholder="请输入排序" />
          </FormItem>
        </Col>
        <Col :span="24">
          <FormItem name="name" label="分类名称">
            <Input v-model:value="formState.name" placeholder="请输入分类名称" />
          </FormItem>
        </Col>
      </Row>
    </Form>
  </Modal>
</template>

<script lang="ts" setup>
  import { defineComponent, onMounted, ref } from 'vue';

  import { Modal, Form, Input, Row, Col, FormItem } from 'ant-design-vue';

  import CateogryDB from '../../../../../electron/libs/indexDB/category';
  import { IAddCategory } from '/@/api/clipboard/model';

  defineComponent({
    name: 'AddCategory',
  });

  const emit = defineEmits(['success', 'error', 'closeModal']);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const formState = ref({
    name: '',
    sort: '',
  });

  const categoryDB = new CateogryDB();

  const cancel = () => {
    emit('closeModal', false);
  };

  const handleOk = async () => {
    console.log(formState.value);
    let response = null;

    if (props.data?._id) {
      response = await categoryDB.updateData({
        ...props.data,
        ...formState.value,
      });
    } else {
      response = await categoryDB.addData([
        {
          ...formState.value,
          createTime: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
          _id: new Date().getTime().toString(),
        },
      ]);
    }

    if (response.code) {
      emit('success');
    } else {
      emit('error');
    }

    console.log(response);
  };

  onMounted(() => {
    categoryDB.init();
    console.log(props.data);
    formState.value = props.data;
    // formState.value = Object.assign({}, props.data);
  });
</script>

<style lang="less" scoped></style>
