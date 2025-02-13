<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="openAdDialog">配置广告</el-button>
        <el-button @click="openQrCode">生成二维码</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe border>
      <el-table-column prop="subjectName" label="目录名称"></el-table-column>
      <el-table-column prop="subjectDesc" label="目录描述"></el-table-column>
      <el-table-column prop="isExpired" label="是否过期">
        <template #default="{ row }">
          <el-tag v-if="row.isExpired === 'Y'" type="danger">是</el-tag>
          <el-tag v-if="row.isExpired === 'N'" type="success">否</el-tag>
          <el-tag v-if="row.isExpired === null" type="primary">---</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <AdConfig ref="adConfigRef"/>
    <QrCode ref="qrCodeRef" :subject-id="subjectId" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getCatalogSubjectApi } from '@/api/menu';
import AdConfig from './AdConfig.vue';
import QrCode from './qrCode.vue';
const route = useRoute();
const adConfigRef = ref<InstanceType<typeof AdConfig>>();
const qrCodeRef = ref<InstanceType<typeof QrCode>>();
const tableData = ref<{
  catalogName: string;
  catalogDesc: string;
  isExpired: string;
}[]>();
const openAdDialog = () => {
  adConfigRef.value?.handleOpen('default');
};

const openQrCode = () => {
  qrCodeRef.value?.qrCodeInit('');
};

const getCatalogList = () => {
  getCatalogSubjectApi(subjectId.value).then((data: any) => {
    tableData.value = data.rows;
  });
};

const openEdit = (row: any) => {
  console.log(row);
};

const subjectId = computed(() => {
  return route.params.subjectId as string;
});

onMounted(() => {
  getCatalogList();
});
</script>

<style lang="scss" scoped>

</style>
