<template>
  <el-dialog
    ref="popoverRef"
    v-model="showUser"
    top="5vh"
    width="50%"
    append-to-body
    title="用户配置"
    :beforeClose="close"
    center
  >
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item v-if="form.userId == ''" label="用户名称" prop="userName">
            <el-input v-model="form.userName" placeholder="请输入用户名称" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="form.userId == ''" label="用户密码" prop="password">
            <el-input v-model="form.password" placeholder="请输入用户密码" type="password" maxlength="20" show-password/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="form.userId == ''" label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" placeholder="确认密码" type="password" maxlength="20" show-password/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
import { addUser, getUser, updateUser } from '@/api/user';
import { ElMessage } from 'element-plus';
const showUser = ref(false);
const form = reactive({
  userId: "",
  userName: '',
  phonenumber: '',
  nickName: '',
  email: '',
  password: '',
  confirmPassword: '',
  remark: '',
  roleIds: [1]
});

const rules = {
  nickName: [{ required: true, message: '请输入用户昵称', trigger: 'blur' }],
  phonenumber: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }]
};
const getUerInfo = (userId: string) => {
  getUser(userId).then((res: any) => {
    // console.log(data);
    form.userId = res.data.userId;
    form.userName = res.data.userName;
    form.phonenumber = res.data.phonenumber;
    form.nickName = res.data.nickName;
    form.email = res.data.email;
    form.remark = res.data.remark;
  });
};

const confirm = () => {
  if (form.userId) {
    // 编辑
    updateUser(form).then(() => {
      ElMessage.success('修改用户成功');
      close();
    });
  } else {
    // 新增
    addUser(form).then(() => {
      ElMessage.success('新增用户成功');
      close();
    });
  }
};
const close = () => {
  showUser.value = false;
  form.userId = '';
  form.userName = '';
  form.phonenumber = '';
  form.nickName = '';
  form.email = '';
  form.password = '';
  form.confirmPassword = '';
  form.remark = '';
};
const handleOpen = (userId?: string) => {
  showUser.value = true;
  if (userId) {
    form.userId = userId;
    getUerInfo(userId);
  }
};

defineExpose({
  handleOpen
});
</script>

<style lang="scss" scoped></style>
