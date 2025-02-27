import { type RouteRecordRaw, createRouter } from "vue-router"
import { history, flatMultiLevelRoutes } from "./helper"
import routeSettings from "@/config/route"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/redirect",
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/views/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/system",
    component: Layouts,
    redirect: "/system/user",
    name: "System",
    meta: {
      title: "系统管理",
      svgIcon: "system",
      // roles: ["admin", "editor"], // 可以在根路由中设置角色
      alwaysShow: true // 将始终显示根菜单
    },
    children: [
      {
        path: "/ChangePassword",
        name: "ChangePassword",
        component: () => import("@/views/changePassword/index.vue"),
        meta: {
          hidden: true,
          title: "修改密码"
        }
      },
      {
        path: "/user",
        component: () => import("@/views/systems/user/index.vue"),
        name: "User",
        meta: {
          title: "用户管理" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      },
      {
        path: "/company",
        component: () => import("@/views/systems/company/index.vue"),
        name: "Company",
        meta: {
          keepAlive: true,
          title: "主体管理" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
        }
      }
    ]
  },
  {
    name: 'object',
    path: '/object',
    component: Layouts,
    redirect: '/object/menu',
    meta: {
      title: '主题管理',
      svgIcon: 'lock',
      roles: ['admin'],
      alwaysShow: true
    },
    children: [
      {
        name: 'menuDetail',
        path: 'menu-detail/:subjectId',
        component: () => import("@/views/systems/menu/index.vue"),
        meta: {
          keepAlive: true,
          title: '主题详情',
          hidden: true
        }
      },
      {
        name: 'menu',
        path: 'menu-list',
        component: () => import("@/views/systems/menu/menuList.vue"),
        meta: {
          keepAlive: true,
          title: '主题管理'
        }
      },
      {
        name: 'catalog',
        path: 'catalog/:subjectId',
        component: () => import("@/views/systems/menu/catalog.vue"),
        meta: {
          title: '目录管理',
          hidden: true
        }
      }
    ]
  }
]

export const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}
