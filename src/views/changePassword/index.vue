<template>
  <div class="app-container">
    <el-form
      ref="loginFormRef"
      :model="loginFormData"
      :rules="loginFormRules"
      label-width="80px"
      class="login-form"
    >
      <el-form-item prop="oldPassword" label="旧密码">
        <el-input v-model="loginFormData.oldPassword" placeholder="请输入旧密码" type="password" maxlength="20" show-password />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="loginFormData.newPassword"  placeholder="请输入新密码" type="password" maxlength="20" show-password />
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认密码">
        <el-input v-model="loginFormData.confirmPassword"  placeholder="请再次输入新密码" type="password" maxlength="20" show-password/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="changePassword">修改密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from 'element-plus';
import { updateUserPwd } from "@/api/user"
const loginFormRef = ref(null)
const loginFormData = reactive({
  username: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
})
const equalToPassword = (rule: any, value: string, callback: any) => {
  if (loginFormData.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"));
  } else {
    callback();
  }
};
const loginFormRules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入新密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请再次输入新密码", trigger: "blur" },
    { validator: equalToPassword, trigger: "blur" },
  ],
}
const user = localStorage.getItem("user")

const changePassword = () => {
  if (!loginFormData.oldPassword || !loginFormData.newPassword) {
    ElMessage.error("请输入旧密码和新密码")
    return
  }
  if (loginFormData.oldPassword === loginFormData.newPassword) {
    ElMessage.error("新密码不能与旧密码相同")
    return
  }
  if (loginFormData.newPassword !== loginFormData.confirmPassword) {
    ElMessage.error("两次输入的密码不一致")
    return
  }
  updateUserPwd(
    loginFormData.oldPassword,
    loginFormData.newPassword,
  ).then(() => {
    ElMessage.success("修改密码成功")
  })
}
</script>

<style lang="ts" scoped>

</style>
