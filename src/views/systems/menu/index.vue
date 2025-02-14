<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button @click="openAdDialog">配置广告</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="14" :sm="10" :md="8" :lg="8" :xl="8">
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
                  <el-button size="small" type="primary" link @click="addSibling(data)" v-if="!isLeafNode(data)"> 添加页面 </el-button>
                  <el-button size="small" type="danger" link @click="removeConfirm(node, data)"> 删除 </el-button>
                </span>
              </span>
            </template>
          </el-tree>
        </div>
      </el-col>
    </el-row>
    <ThemeConfig ref="themeConfigRef" @edit-success="handleEditSuccess" />
    <PageConfig ref="pageConfigRef" @edit-success="handleEditSuccess" />
    <AdConfig ref="adConfigRef"/>
    <QrCode ref="qrCodeRef" :subject-id="subjectId" />
    <AddChild ref="addChildRef" @add-success="handleAddSuccess" />

  </div>
</template>

<script setup lang="ts">
import { ElTree, ElMessageBox, ElPopover } from 'element-plus';
import { listCompanyApi } from "@/api/company"
import { getCatalogSubjectApi, getQrcodeApi, getSubjectApi, removeCatalogApi, removeContentApi } from '@/api/menu';
import { useRoute, useRouter } from "vue-router"
import type Node from 'element-plus/es/components/tree/src/model/node'
import ThemeConfig from './themeConfig.vue';
import PageConfig from './pageConfig.vue';
import AdConfig from './AdConfig.vue';
import QrCode from './qrCode.vue';
import AddChild from './addChild.vue';
import { onMounted, ref } from 'vue';
interface Tree {
  [key: string]: any
}
const route = useRoute();
const router = useRouter();
const themeConfigRef = ref<InstanceType<typeof ThemeConfig>>();
const pageConfigRef = ref<InstanceType<typeof PageConfig>>();
const adConfigRef = ref<InstanceType<typeof AdConfig>>();
const qrCodeRef = ref<InstanceType<typeof QrCode>>();
const addChildRef = ref<InstanceType<typeof AddChild>>();
const moduleValue = ref<boolean>(false);
const qrcodeInt = ref<boolean>(false);
const qrcodeUrl = ref<string>()
const popoverRef = ref<InstanceType<typeof ElPopover>>();
const treeRef = ref<InstanceType<typeof ElTree>>();
let dataList: any[] = [];
const deptOptions = ref<Tree[]>([
  // {
  //   id: 1,
  //   label: '主题 1',
  //   type: 'theme',
  //   children: [
  //     {
  //       id: 4,
  //       label: '目录 1-1',
  //       type: 'folder',
  //       children: [
  //         {
  //           id: 9,
  //           label: '页面 1-1-1',
  //           type: 'page'
  //         },
  //         {
  //           id: 10,
  //           label: '页面 1-1-2',
  //           type: 'page'
  //         }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   id: 2,
  //   label: '主题 2',
  //   type: 'theme',
  //   children: [
  //     {
  //       id: 5,
  //       label: '目录 2-1',
  //       type: 'folder',
  //     },
  //     {
  //       id: 6,
  //       label: '目录 2-2',
  //       type: 'folder',
  //     }
  //   ]
  // },
  // {
  //   id: 3,
  //   label: '主题 3',
  //   type: 'theme',
  //   children: [
  //     {
  //       id: 7,
  //       label: '目录 3-1',
  //       type: 'folder',
  //     },
  //     {
  //       id: 8,
  //       label: '目录 3-2',
  //       type: 'folder',
  //     }
  //   ]
  // }
]);
const defaultProps = {
  children: 'children',
  label: 'label'
};
const liftType = ref('floder');

const openAdDialog = () => {
  adConfigRef.value?.handleOpen('default');
};

const filterNode = (value: string, data: Tree) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};

const currentNode = ref<Node | null>(null);
const currentData = ref<Tree | null>(null);

const addFloder = (node: Node, data: Tree) => {
  addChildRef.value?.open();
};

const handleNodeClick = (data: Node) => {
  console.log(data);
};

const openThemeConfig = (data: Tree) => {
  themeConfigRef.value?.handleOpen(data);
};

const handleEditSuccess = (data: Tree) => {
  // replaceNodeById(deptOptions.value, data);
  // deptOptions.value = [...deptOptions.value];
  initPage();
};

const openConfig = (data: Tree) => {
  console.log(data);
  if (data.type === 'page') {
    pageConfigRef.value?.handleOpen(data, data.catalogId, false);
  } else {
    themeConfigRef.value?.handleOpen(data);
  }
};

const subjectId = route.params.subjectId as string;
const qrCode = (node: Node, data: Tree) => {
  const company = dataList.find(item => item.companyId === data.companyId);
  const url = `https://app.${company.companyLink}/flashCard?subjectId=${subjectId}`;
  qrCodeRef.value?.qrCodeInit(url);
};

const removeNode = ref<Node | null>(null);
const removeData = ref<Tree | null>(null);

const remove = (node: Node, data: Tree) => {
  const parent = node.parent;
  if (!parent) {
    return;
  }
  if (data.type === 'folder') {
    removeFloder(data.catalogId);
  }
  if (data.type === 'page') {
    removePage(data.contentId);
  }
  console.log(data);
};

const removeFloder = (catalogId: string) => {
  removeCatalogApi(catalogId).then(() => {
    initPage();
  });
};

const removePage = (contentId: string) => {
  removeContentApi(contentId).then(() => {
    initPage();
  });
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

const addSibling = (data: Tree) => {
  const catalogId = data.catalogId;
  pageConfigRef.value?.handleOpen(data, catalogId, true);
  console.log(data);
  // node.data.children.push({
  //   label: '新页面',
  //   type: 'page',
  //   children: null
  // });
};

const handleAddSuccess = () => {
  initPage();
};

const isLeafNode = (node: any) => {
  return node.type === 'page';
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
const getCompanyList = () => {
  const queryParams = {
    pageNum: 1,
    pageSize: 100,
  };
  listCompanyApi(queryParams).then((res: any) => {
    dataList = res.rows;
  })
}

const initPage = () => {
  const subjectId = route.params.subjectId as string;
  getSubjectApi(subjectId).then((res: any) => {
    const subjectDesc = res.data.subjectDesc;
    const subjectName = res.data.subjectName;
    const children = []
    if (res.data.catalogList) {
      res.data.catalogList.forEach((item: any) => {
        item.type = 'folder';
        item.sortId = item.catalogSort;
        item.label = item.catalogName;
        item.id = subjectId + '-folder-' + item.catalogId;
        item.children = item.contentList.map((content: any) => {
          content.type = 'page';
          content.label = content.contentName;
          item.id = subjectId + '-folder-' + item.catalogId + '-page-' + content.contentId;
          content.sortId = content.contentSort;
          return content;
        });
      });
      children.push(...res.data.catalogList);
    }
    if (res.data.contentList) {
      res.data.contentList.forEach((item: any) => {
        item.type = 'page';
        item.label = item.contentName;
        item.sortId = item.contentSort;
        item.id = subjectId + '-page-' + item.contentId;
      });
      children.push(...res.data.contentList);
    }
    children.sort((item1, item2) => {
      // if (item1.sortId)
      return item1.sortId - item2.sortId;
    });
    const node = [
      {
        id: subjectId,
        label: subjectName,
        labelDesc: subjectDesc,
        type: 'theme',
        companyId: res.data.companyId,
        children,
        subjectImg: res.data.subjectImg
      }
    ]
    deptOptions.value = node;
    console.log(res.data);
  });
}

onMounted(() => {
  getCompanyList();
  initPage();
})
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
