<template>
  <el-dialog
    title="新建主题"
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
        <el-form-item label="挂载主体" prop="companyId">
          <el-select v-model="themeFormData.companyId">
            <el-option v-for="(item, index) in companyList" :key="item.companyLink"
              :value="item.companyId" :label="item.companyName">
              <span>{{ item.companyName }}({{ item.companyLink }})</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="主题名称" prop="subjectName">
          <el-input v-model="themeFormData.subjectName" placeholder="请输入主题名称"></el-input>
        </el-form-item>
        <el-form-item label="主题描述" prop="subjectDesc">
          <el-input v-model="themeFormData.subjectDesc" placeholder="请输入主题名称"></el-input>
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
import { addSubjectApi } from '@/api/menu';
import { ElMessage } from 'element-plus';
const moduleValue = ref(false);
const themeFormData = ref({
  subjectName: '',
  subjectDesc: '',
  companyId: ''
})
interface Company {
  companyId: string;
  companyName: string;
  companyLink: string;
}
const props = defineProps<{
  companyList: Company[]
}>()
const emit = defineEmits(['addSuccess']);
const handleClose = () => {
  moduleValue.value = false;
}
const handleOpen = () => {
  moduleValue.value = true;
}

const addTheme = () => {
  console.log(themeFormData.value);
  if (themeFormData.value.subjectName.trim() === '' || themeFormData.value.subjectDesc.trim() === '') {
    ElMessage.error('请检查表单');
    return;
  }
  addSubjectApi(themeFormData.value).then(() => {
    ElMessage.success('新增主题成功');
    handleClose();
    emit('addSuccess');
  });
}

defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>

</style>
