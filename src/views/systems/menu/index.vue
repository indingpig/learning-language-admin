<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="addNewTheme">+ 新增主题</el-button>
        <el-button @click="openAdDialog">配置广告</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="14" :sm="10" :md="8" :lg="6" :xl="1">
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="treeRef"
            default-expand-all
            node-key="id"
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span v-if="node.level === 1">
                  <el-button size="small" @click="openThemeConfig(data)" type="primary" link> 配置 </el-button>
                  <el-button size="small" type="success" link @click="qrCode(node, data)"> 生成二维码 </el-button>
                  <!-- 添加子节点 -->
                  <el-button size="small" type="primary" link @click="addFloder(node, data)"> 添加目录/页面 </el-button>
                </span>
                <span v-else>
                  <el-button size="small" @click="openConfig(data)" type="primary" link> 配置 </el-button>
                  <el-button size="small" type="primary" link @click="addSibling(node, data)" v-if="!isLeafNode(node)"> 添加页面 </el-button>
                  <el-button size="small" type="danger" link @click="removeConfirm(node, data)"> 删除 </el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <NewTheme ref="newThemeRef" @add-success="handleAddSuccess" />
    <ThemeConfig ref="themeConfigRef" @edit-success="handleEditSuccess" />
    <PageConfig ref="pageConfigRef" @edit-success="handleEditSuccess" />
    <AdConfig ref="adConfigRef"/>
    <el-dialog
      ref="popoverRef"
      v-model="moduleValue"
      top="5vh"
      width="20%"
      append-to-body
      title="新建目录/页面"
      center
    >
      <el-radio-group v-model="liftType">
        <el-radio value="floder" size="large">目录</el-radio>
        <el-radio value="page" size="large">页面</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button size="small" @click="moduleValue = false">取消</el-button>
        <el-button size="small" type="primary" @click="confirmLiftType(liftType)">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElTree, ElMessageBox, ElPopover } from 'element-plus';
import type Node from 'element-plus/es/components/tree/src/model/node'
import NewTheme from './newTheme.vue';
import ThemeConfig from './themeConfig.vue';
import PageConfig from './pageConfig.vue';
import AdConfig from './AdConfig.vue';
import { ref } from 'vue';
interface Tree {
  [key: string]: any
}
const newThemeRef = ref<InstanceType<typeof NewTheme>>();
const themeConfigRef = ref<InstanceType<typeof ThemeConfig>>();
const pageConfigRef = ref<InstanceType<typeof PageConfig>>();
const adConfigRef = ref<InstanceType<typeof AdConfig>>();
const moduleValue = ref<boolean>(false);
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

const currentNode = ref<Node | null>(null);
const currentData = ref<Tree | null>(null);

const addFloder = (node: Node, data: Tree) => {
  currentNode.value = node;
  currentData.value = data;
  moduleValue.value = true;
};

const confirmLiftType = (liftType: string) => {
  let label = '新目录';
  if (liftType === 'page') {
    label = '新页面';
  }
  currentData.value?.children.push({
    label,
    type: liftType,
    children: []
  });
  moduleValue.value = false;
};

const handleNodeClick = (data: Node) => {
  console.log(data);
};

const openThemeConfig = (data: Tree) => {
  themeConfigRef.value?.handleOpen(data);
};

const handleEditSuccess = (data: Tree) => {
  replaceNodeById(deptOptions.value, data);
  deptOptions.value = [...deptOptions.value];
};

const openConfig = (data: Tree) => {
  if (data.type === 'theme') {
    themeConfigRef.value?.handleOpen(data);
  } else {
    pageConfigRef.value?.handleOpen(data);
  }
};

const qrCode = (node: Node, data: Tree) => {
  console.log(node, data);
};

const removeNode = ref<Node | null>(null);
const removeData = ref<Tree | null>(null);

const remove = (node: Node, data: Tree) => {
  const parent = node.parent;
  if (!parent) {
    return;
  }
  const children = parent.data.children;
  const index = children.indexOf(node.data);
  children.splice(index, 1);
};

const removeConfirm = (node: Node, data: Tree) => {
  removeNode.value = node;
  removeData.value = data;
  ElMessageBox.confirm('此操作将永久删除该节点, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    remove(removeNode.value as Node, removeData.value as Tree);
  }).catch(() => {
    console.log('取消删除');
  });
};

const addSibling = (node: Node, data: Tree) => {
  node.data.children.push({
    label: '新页面',
    type: 'page',
    children: null
  });
};

const openAdDialog = () => {
  adConfigRef.value?.handleOpen('default');
};

const isLeafNode = (node: Node) => {
  return !node.data.children || node.data.children.length === 0;
};

// 递归查找并替换节点
const replaceNodeById = (nodes: Tree[], target: Tree) => {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (node.id === target.id) {
      // 如果找到了匹配的节点，替换它
      nodes[i] = target;
      return; // 找到后可以直接返回
    }
    // 如果有子节点，递归查找
    if (node.children && node.children.length > 0) {
      replaceNodeById(node.children, target);
    }
  }
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
