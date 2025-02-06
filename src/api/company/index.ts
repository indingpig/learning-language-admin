import { request } from "@/utils/service"

export function listCompanyApi(query: any) {
  return request({
    url: '/business/company/list',
    method: 'get',
    params: query
  }) as any
}

// 新增用户
export function addCompany(data: any) {
  return request({
    url: '/business/company',
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getCompany(userId: string) {
  return request({
    url: '/business/company/' + userId,
    method: 'get'
  })
}

export function delCompany(userId: string) {
  return request({
    url: '/business/company/' + userId,
    method: 'delete'
  })
}

export function updateCompany(data: any) {
  return request({
    url: '/business/company/',
    method: 'put',
    data: data
  })
}

