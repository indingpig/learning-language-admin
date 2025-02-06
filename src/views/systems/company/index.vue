<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="addCompany">+ 新增公司</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="dataList">
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <!-- <el-table-column label="用户编号" align="center" key="companyId" prop="companyId" /> -->
      <el-table-column label="主体名称" align="center" key="companyName" prop="companyName"  />
      <el-table-column label="主体链接" align="center" key="companyLink" prop="companyLink"  />
      <!-- <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"  /> -->
      <!-- <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" /> -->
      <!-- <el-table-column label="状态" align="center" key="status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="创建时间" align="center" prop="createTime" width="160"> -->
        <!-- <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column
        label="操作"
        align="center"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template #default="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <Company ref="companyRef" @success="getCompanyList"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { listCompanyApi, delCompany } from "@/api/company"
import { ElMessageBox, ElMessage } from "element-plus"
import Company from "./Company.vue"
const loading = ref(false)
const companyRef = ref<InstanceType<typeof Company>>();
const dataList = ref([])

const handleUpdate = (row:any) => {
  companyRef.value?.handleOpen(row.companyId)
}
const handleDelete = (row:any) => {
  ElMessageBox.confirm('确认删除该公司吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delCompany(row.companyId).then(() => {
      ElMessage.success('删除成功')
      getCompanyList()
    })
  })
}

const addCompany = () => {
  companyRef.value?.handleOpen()
}

const queryParams = {
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
};

const getCompanyList = async () => {
  loading.value = true
  listCompanyApi(queryParams).then((res: any) => {
    dataList.value = res.rows;
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getCompanyList()
})

</script>

<style lang="scss" scoped>

</style>
