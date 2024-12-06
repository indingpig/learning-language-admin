<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="addNewTheme">+ 新增根主题</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="5">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            default-expand-all
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="node.level === 1">
                  <el-button size="small" @click="openConfig(data)" type="text"> 配置按钮 </el-button>
                  <el-button size="small" type="text" @click="qrCode(node, data)"> 生成二维码 </el-button>
                  <!-- 添加子节点 -->
                  <el-button size="small" type="text" @click="addFloder(node, data)" v-click-outside="onClickOutside"> 添加目录/页面 </el-button>
                </span>
                <span v-else>
                  <el-button size="small" @click="openConfig(data)" type="text"> 配置按钮 </el-button>
                  <el-button size="small" type="text" @click="remove(node, data)"> 删除 </el-button>
                  <el-button v-if="isLastChild(node)" size="small" type="text" @click="addSibling(node, data)"> 添加同级 </el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <NewTheme ref="newThemeRef" @add-success="handleAddSuccess" />
    <el-popover
      ref="popoverRef"
      :virtual-ref="buttonRef"
      trigger="click"
      title="With title"
      virtual-triggering
    >
      <el-radio-group v-model="liftType">
        <el-radio value="floder" size="large">目录</el-radio>
        <el-radio value="page" size="large">页面</el-radio>
      </el-radio-group>
      <el-button size="small" type="primary" @click="confirmLiftType">确定</el-button>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ElTree, ClickOutside as vClickOutside, ElPopover } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node'
import NewTheme from './newTheme.vue';
import { ref, unref } from 'vue';
interface Tree {
  [key: string]: any
}
const newThemeRef = ref<InstanceType<typeof NewTheme>>();
const buttonRef = ref<HTMLElement>();
const popoverRef = ref<InstanceType<typeof ElPopover>>();
const treeRef = ref<InstanceType<typeof ElTree>>();
const deptOptions = ref<Tree[]>([
  {
    id: 1,
    label: '主题 1',
    type: 'theme',
    children: [
      {
        id: 4,
        label: '目录 1-1',
        type: 'folder',
        children: [
          {
            id: 9,
            label: '页面 1-1-1',
            type: 'page'
          },
          {
            id: 10,
            label: '页面 1-1-2',
            type: 'page'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    label: '主题 2',
    type: 'theme',
    children: [
      {
        id: 5,
        label: '目录 2-1',
        type: 'folder',
      },
      {
        id: 6,
        label: '目录 2-2',
        type: 'folder',
      }
    ]
  },
  {
    id: 3,
    label: '主题 3',
    type: 'theme',
    children: [
      {
        id: 7,
        label: '目录 3-1',
        type: 'folder',
      },
      {
        id: 8,
        label: '目录 3-2',
        type: 'folder',
      }
    ]
  }
]);
const defaultProps = {
  children: 'children',
  label: 'label'
};
const liftType = ref('floder');

const addNewTheme = () => {
  newThemeRef.value?.handleOpen();
};

const handleAddSuccess = () => {
  deptOptions.value.push({
    id: 4,
    label: '主题 4',
    type: 'theme',
    children: []
  });
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

const addFloder = (node: Node, data: Tree) => {
  const children = node.data.children;
  children.push({
    label: '新节点',
    children: []
  });
};

const confirmLiftType = () => {
  console.log(liftType.value);
};

const onClickOutside = () => {
  if (!popoverRef.value) {
    return;
  }
  unref(popoverRef).popperRef?.delayHide?.()
}

const handleNodeClick = (data: Node) => {
  console.log(data);
};

const openConfig = (data: Tree) => {
  console.log(data);
};

const qrCode = (node: Node, data: Tree) => {
  console.log(node, data);
};

const remove = (node: Node, data: Tree) => {
  console.log(node, data);
};

const addSibling = (node: Node, data: Tree) => {
  const parent = node.parent;
  if (parent) {
    parent.data.children.push({
      label: '新节点',
      children: []
    });
  }
};

const isLastChild = (node: Node) => {
  const parent = node.parent;
  if (parent) {
    const siblings = parent.data.children;
    return siblings[siblings.length - 1] === node.data;
  }
  return false;
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  .el-button + .el-button {
    margin-left: 0;
  }
  .el-button--small {
    padding: 5px;
  }
}
</style>
