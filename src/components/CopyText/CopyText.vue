<template>
  <a v-bind="$attrs" :style="getButtonMarginLeft" @click="copyTextFn">
    <template v-if="showInnerText">
      {{ showInnerText }}
    </template>
    <template v-else>
      <CopyOutlined :style="{ color: iconColor }" />
    </template>
  </a>
</template>
<script lang="tsx">
  import { defineComponent, computed, CSSProperties } from 'vue';
  import { CopyOutlined } from '@ant-design/icons-vue';
  import { copyTextToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { message } from 'ant-design-vue';

  export default defineComponent({
    name: 'LinksCopyText',
    components: {
      CopyOutlined,
    },
    props: {
      /**
       * icon颜色
       */
      iconColor: {
        type: String,
        default: '#5a94fd',
      },
      /**
       * 左边距
       */
      marginLeft: {
        type: Number,
        default: 14,
      },
      /**
       * 复制内容
       */
      copyText: {
        type: String,
        default: '',
      },
      /**
       * 复制内容
       */
      successTipsText: {
        type: String,
        default: '复制成功',
      },
      /**
       * 复制内容
       */
      showInnerText: {
        type: String,
        default: '',
      },
    },

    emits: ['success'],

    setup(props, { emit }) {
      // 计算左外边距距离
      const getButtonMarginLeft = computed((): CSSProperties => {
        const { marginLeft, showInnerText } = props;
        if (showInnerText) return { marginLeft: 0 };
        const ml = `${marginLeft}px`;
        return { marginLeft: ml };
      });

      const copyTextFn = () => {
        copyTextToClipboard(props.copyText);
        emit('success');
        message.success(props.successTipsText);
      };

      return {
        getButtonMarginLeft,
        copyTextFn,
      };
    },
  });
</script>
<style lang="less"></style>
