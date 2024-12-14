<template>
  <div class="image-upload-wrap">
    <!-- 图片上传区域 -->
    <div class="image-upload-container" @click="triggerFileInput">
      <div v-if="!image" class="image-upload-placeholder">
        <span>+</span>
      </div>
      <img v-if="image" :src="image" alt="Uploaded Image" class="uploaded-image" />
      <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageUpload" v-show="false"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const image = ref<string>();  // 存储上传后的图片 URL
const fileInputRef = ref<HTMLInputElement | null>(null);

// 触发文件输入框的点击事件
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// 处理图片上传
const handleImageUpload = (event: Event) => {
  if (!event.target) return;
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  if (file) {
    handleUpload(file);
  }
};

const handleUpload = (file: File) => {
  // 上传图片逻辑
};
</script>

<style lange="scss" scoped>
.image-upload-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
/* 图片上传框的样式 */
.image-upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  border: 2px dashed #ddd;
  position: relative;
  cursor: pointer;
}

.image-upload-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  color: #aaa;
}

.uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 如果上传的是图片，隐藏 + 号 */
.image-upload-container img {
  display: block;
}

input[type="file"] {
  display: none;
}
</style>
