<template>
  <el-dialog
    ref="popoverRef"
    v-model="qrcodeInt"
    top="5vh"
    width="40%"
    append-to-body
    title="二维码"
    @beforeClose="closeQR"
    center
  >
    <img :src="qrcodeUrl" alt="">
    <template #footer>
      <el-button size="small" type="primary" @click="closeQR">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getQrcodeApi } from '@/api/menu';

const props = defineProps<{
  subjectId: string
}>();
const qrcodeInt = ref(false);
const qrcodeUrl = ref<string>('');
const qrCodeInit = () => {
  const subjectId = props.subjectId;
  getQrcodeApi(subjectId).then((res: any) => {
    qrcodeUrl.value = 'data:image/png;base64,' + res.img;
    qrcodeInt.value = true;
  })
};

const closeQR = () => {
  qrcodeInt.value = false;
  qrcodeUrl.value = '';
};

defineExpose({
  qrCodeInit
});

</script>

<style scoped lang="scss">

</style>
