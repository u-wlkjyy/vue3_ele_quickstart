<template>
  <el-avatar :size="size" :src="avatarSrc" :alt="alt" />
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import apiServer_client from "@/utils/apiServer_client.js";

export default {
  name: 'Avatar',
  props: {
    fileId: {
      type: String,
      required: true, // fileId 是必传参数
    },
    size: {
      type: [Number, String],
      default: 32, // 默认头像尺寸
    },
    alt: {
      type: String,
      default: 'Avatar', // 默认 alt 属性
    },
  },
  setup(props) {
    const avatarSrc = ref('');

    const loadAvatar = async (fileId) => {
      avatarSrc.value = await apiServer_client.downFileToBase64(fileId);
    };

    // 在组件挂载时或 fileId 更新时加载头像
    watch(
        () => props.fileId,
        (newFileId) => {
          if (newFileId) {
            loadAvatar(newFileId);
          }
        },
        { immediate: true } // 立即执行一次
    );

    return {
      avatarSrc,
    };
  },
};
</script>

<style scoped>
/* 添加必要的样式 */
</style>
