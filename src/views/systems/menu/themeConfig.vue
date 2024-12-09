<template>
  <el-dialog
    title="主题页配置"
    v-model="moduleValue"
    :before-close="handleClose"
    top="5vh"
    width="50%"
    append-to-body
    center
  >
  <el-form ref="themeFormRef" :model="themeFormData">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item>
          <el-input v-model="themeFormData.themeName" placeholder="请输入主题名称"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item class="text-center">
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
  <template #footer>
    <el-button type="primary" @click="addTheme">确定</el-button>
    <el-button @click="handleClose">取消</el-button>
  </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const moduleValue = ref(false);
const themeFormData = ref({
  themeName: ''
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
