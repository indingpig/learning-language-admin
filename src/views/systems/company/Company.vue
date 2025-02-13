<template>
  <el-dialog
    ref="popoverRef"
    v-model="showUser"
    top="5vh"
    width="50%"
    append-to-body
    title="公司配置"
    :beforeClose="close"
    center
  >
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="主体名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入主体名称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="主体链接" prop="companyLink">
            <el-input v-model="form.companyLink" placeholder="请输入主体链接"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="主体logo" prop="companyLogo">
            <Upload :imageUrl="form.companyImg" @update-success="updateSuccess"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button size="small" type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { addCompany, getCompany, updateCompany } from '@/api/company';
import { ElMessage } from 'element-plus';
import Upload from '@/components/Upload/index.vue';
const showUser = ref(false);
const emits = defineEmits(['success'])
const form = reactive({
  companyId: "",
  companyName: '',
  companyLink: '',
  companyImg: ''
});


const rules = {
  companyName: [{ required: true, message: '请输入主体名称', trigger: 'blur' }],
  companyLink: [{ required: true, message: '请输入主体链接', trigger: 'blur' }]
};

const updateSuccess = (url: string) => {
  form.companyImg = url;
}
const getUerInfo = (companyId: string) => {
  getCompany(companyId).then((res: any) => {
    // console.log(data);
    form.companyId = res.data.companyId;
    form.companyName = res.data.companyName;
    form.companyLink = res.data.companyLink;
    form.companyImg = res.data.companyImg;
  });
};

const confirm = () => {
  if (form.companyId) {
    // 编辑
    updateCompany(form).then(() => {
      ElMessage.success('修改主体成功');
      close();
      emits('success')
    });
  } else {
    // 新增
    addCompany(form).then(() => {
      ElMessage.success('新增主体成功');
      emits('success')
      close();
    });
  }
};
const close = () => {
  showUser.value = false;
  form.companyId = '';
  form.companyName = '';
  form.companyLink = '';
  form.companyImg = '';
};
const handleOpen = (companyId?: string) => {
  showUser.value = true;
  if (companyId) {
    form.companyId = companyId;
    getUerInfo(companyId);
  }
};

defineExpose({
  handleOpen
});
</script>

<style lang="scss" scoped></style>
