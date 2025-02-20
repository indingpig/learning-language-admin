<template>
  <div class="image-upload-wrap">
    <!-- 图片上传区域 -->
    <div class="image-upload-container">
      <div @click="triggerFileInput">
        <div v-if="!imageUrl">
          <div v-if="!imageUrl" class="image-upload-placeholder">
            <span>+</span>
          </div>
          <!-- <img v-if="image" :src="image" alt="Uploaded Image" class="uploaded-image" /> -->
        </div>
        <img v-if="imageUrl" :src="imageUrl" alt="Uploaded Image" class="uploaded-image" />
      </div>
      <input ref="fileInputRef" type="file" accept="image/*" @change="handleImageUpload" v-show="false"/>
      <SvgIcon name="close" class="text-lg del-icon" @click="del" v-if="imageUrl" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { uploadApi } from '@/api/menu';
import { ElMessage } from 'element-plus';

const image = ref<string>();  // 存储上传后的图片 URL
const fileInputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  imageUrl: string;
}>();
const emits = defineEmits(['updateSuccess', 'delSuccess']);

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

const del = () => {
  emits('delSuccess', '');
};

const handleUpload = (file: File) => {
  // 上传图片逻辑
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  fileInputRef.value!.value = '';
  uploadApi(formData).then((res: any) => {
    console.log('上传成功', res);
    ElMessage.success('上传成功');
    emits('updateSuccess', res.fileurl);
    // 图片上传成功后，将图片转成 URL
    image.value = URL.createObjectURL(file);
  });
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
  > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.del-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  color: #fff;
  background-color: rgba(255, 0, 0, 0.929);
  border-radius: 50%;
  padding: 5px;
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
  object-fit: contain;
}

/* 如果上传的是图片，隐藏 + 号 */
.image-upload-container img {
  display: block;
}

input[type="file"] {
  display: none;
}
</style>
