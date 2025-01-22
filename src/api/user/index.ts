import { request } from "@/utils/service"

export function listUserApi(query: any) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  }) as any
}

// 新增用户
export function addUser(data: any) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getUser(userId: string) {
  return request({
    url: '/system/user/' + userId,
    method: 'get'
  })
}

export function delUser(userId: string) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword:string, newPassword: string) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    params: data
  })
}

// 修改用户
export function updateUser(data: any) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}


