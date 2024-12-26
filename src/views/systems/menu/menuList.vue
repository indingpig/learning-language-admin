<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="addNewTheme">+ 新增主题</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData" stripe border>
      <el-table-column prop="catalogName" label="主题名称"></el-table-column>
      <el-table-column prop="catalogDesc" label="描述"></el-table-column>
      <el-table-column prop="isExpired" label="是否过期">
        <template #default="{ row }">
          <el-tag v-if="row.isExpired === 'Y'" type="danger">是</el-tag>
          <el-tag v-if="row.isExpired === 'N'" type="success">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
          <el-button link type="primary" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <NewTheme ref="newThemeRef" @add-success="handleAddSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router"
import NewTheme from './newTheme.vue';
import { getUserMenuApi } from '@/api/menu';
const newThemeRef = ref<InstanceType<typeof NewTheme>>();
const router = useRouter();
const tableData = ref<{
  catalogName: string;
  catalogDesc: string;
  isExpired: string;
}[]>();

const addNewTheme = () => {
  newThemeRef.value?.handleOpen();
};


const handleAddSuccess = () => {
  console.log('新增主题成功');
};

const openEdit = (row: any) => {
  router.push({ name: 'menuDetail', params: { catalogId: row.catalogId } });
};

const getMenu = () => {
  getUserMenuApi().then(data => {
    data.rows = [
      {
        catalogId: 1,
        catalogName: '主题1',
        catalogDesc: '主题1描述',
        isExpired: 'Y'
      },
      {
        catalogId: 2,
        catalogName: '主题2',
        catalogDesc: '主题2描述',
        isExpired: 'N'
      }
    ]
    tableData.value = data.rows;
  });
};

onMounted(() => {
  getMenu();
});
</script>

<style lang="scss" scoped>

</style>
