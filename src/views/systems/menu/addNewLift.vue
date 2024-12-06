<template>
  <el-dialog
    title="新建目录/页面"
    v-model="moduleValue"
    :before-close="handleClose"
    top="5vh"
    width="40%"
    append-to-body
    center
  >
  <el-form ref="themeFormRef" :model="themeFormData">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item>
          <el-input v-model="themeFormData.name" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item class="text-center">
          <el-button type="primary" @click="addTheme">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const moduleValue = ref(false);
const themeFormData = ref({
  name: ''
})
const emit = defineEmits(['addSuccess']);
const handleClose = () => {
  moduleValue.value = false;
}
const handleOpen = () => {
  moduleValue.value = true;
}

const addTheme = () => {
  console.log(themeFormData.value);
  handleClose();
  emit('addSuccess');
}

defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>

</style>
