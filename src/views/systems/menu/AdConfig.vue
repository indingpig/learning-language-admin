<template>
  <el-dialog
    title="广告图配置"
    v-model="moduleValue"
    :before-close="handleClose"
    top="5vh"
    width="50%"
    append-to-body
    class="theme-config"
    :close-on-click-modal="false"
    center
  >
    <main>
      <Upload :imageUrl="formData.advertiseImg" @update-success="updateSuccess" @del-success="delSuccess"/>
      <el-form :model="formData" label-position="top">
        <el-form-item prop="advertiseLink" :label="alertTitle">
          <el-input v-model="formData.advertiseLink" placeholder="请输入链接地址"></el-input>
        </el-form-item>
        <div v-if="formData.advertiseLink">
          <p>保存前请确认链接地址是否正确：</p>
          <el-link type="primary" :href="formData.advertiseLink" target="_blank">{{formData.advertiseLink}}</el-link>
        </div>
      </el-form>
    </main>
    <template #footer>
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import Upload from '@/components/Upload/index.vue';
import { getAdApi, addAdApi, updateAdApi } from '@/api/menu';
import { ElMessage } from 'element-plus';
const moduleValue = ref(false);
const imageUrl = ref('');
const formData = reactive({
  advertiseImg: '',
  advertiseLink: ''
})
const alertTitle = '网址必须以http://或https://开头';
const handleClose = () => {
  moduleValue.value = false;
  formData.advertiseImg = '';
  formData.advertiseLink = '';
  imageUrl.value = '';
  subjectId = '';
  companyId = '';
}
let subjectId = '';
let companyId = '';
let advertiseId = '';
const handleOpen = (id: string, adCompanyId: string, adAubjectId: string) => {
  moduleValue.value = true;
  subjectId = adAubjectId;
  companyId = adCompanyId;
  advertiseId = id;
  if (!id) return;
  getAdApi(id).then((res: any) => {
    formData.advertiseImg = res.advertiseImg;
    formData.advertiseLink = res.advertiseLink;
  })
}

const updateSuccess = (url: string) => {
  formData.advertiseImg = url;
}

const delSuccess = () => {
  formData.advertiseImg = '';
}

const getData = () => {
  return {
    advertiseImg: formData.advertiseImg,
    advertiseLink: formData.advertiseLink,
    subjectId,
    // companyId,
    advertiseId
  }
}

const addAd = () => {
  const data = getData();
  addAdApi(data).then(() => {
    ElMessage.success('添加成功');
    handleClose();
  })
}

const updateAd = () => {
  const data = getData();
  updateAdApi(data).then(() => {
    ElMessage.success('修改成功');
    handleClose();
  })
}

const confirm = () => {
  if (!formData.advertiseLink) {
    ElMessage.error('请输入链接地址');
    return;
  }
  if (advertiseId) {
    updateAd();
  } else {
    addAd();
  }
}


defineExpose({
  handleOpen
})
</script>

<style lang="scss" scoped>
.theme-config :global(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}
.theme-config {
  main {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h4 {
      margin: 0;
    }
  }
}
.word-item {
  display: flex;
  gap: 10px;
  .word {
    flex: 1.5;
  }
}
.page-icon {
  cursor: pointer;
  color: #409EFF;
}
.page-icon + .page-icon {
  margin-left: 10px;
}

</style>
