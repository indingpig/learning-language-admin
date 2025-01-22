<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="addUser">+ 新增用户</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="userList">
      <!-- <el-table-column type="selection" width="50" align="center" /> -->
      <el-table-column label="用户编号" align="center" key="userId" prop="userId" />
      <el-table-column label="用户名称" align="center" key="userName" prop="userName"  />
      <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"  />
      <!-- <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"  /> -->
      <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber" />
      <!-- <el-table-column label="状态" align="center" key="status">
        <template #default="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="0"
            inactive-value="1"
          ></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <!-- <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template> -->
      </el-table-column>
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
    <User ref="userRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { listUserApi, delUser } from "@/api/user"
import { ElMessageBox, ElMessage } from "element-plus"
import User from "./User.vue"
const loading = ref(false)
const userRef = ref<InstanceType<typeof User>>();
const userList = ref([])

const handleUpdate = (row:any) => {
  userRef.value?.handleOpen(row.userId)
}
const handleDelete = (row:any) => {
  ElMessageBox.confirm('确认删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    delUser(row.userId).then(() => {
      ElMessage.success('删除成功')
      getUserList()
    })
  })
}

const addUser = () => {
  userRef.value?.handleOpen()
}

const queryParams = {
  pageNum: 1,
  pageSize: 10,
  userName: undefined,
  phonenumber: undefined,
  status: undefined,
  deptId: undefined
};

const getUserList = async () => {
  loading.value = true
  listUserApi(queryParams).then((res: any) => {
    userList.value = res.rows;
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  getUserList()
})

</script>

<style lang="scss" scoped>

</style>
