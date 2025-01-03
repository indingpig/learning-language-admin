import { request } from "@/utils/service"

export function getUserMenuApi() {
  return request({
    url: "/business/subject/list",
    method: "get"
  }) as Promise<{total: number, rows: any[], msg: string}>
}


export function addSubjectApi(data: any) {
  return request({
    url: "/business/subject",
    method: "post",
    data
  })
}

export function updateSubjectApi(data: any) {
  return request({
    url: "/business/subject",
    method: "put",
    data
  })
}

export function getSubjectApi(subjectId: string) {
  return request({
    url: "/business/subject/{subjectId}".replace('{subjectId}', subjectId),
    method: "get",
  }) as any
}

export function addCatalogApi(data: any) {
  return request({
    url: "/business/catalog",
    method: "post",
    data
  }) as Promise<{total: number, rows: any[], msg: string}>
}

export function updateCatalogApi(data: any) {
  return request({
    url: "/business/catalog",
    method: "put",
    data
  }) as Promise<{total: number, rows: any[], msg: string}>
}

export function addContentApi(data: any) {
  return request({
    url: "/business/content",
    method: "post",
    data
  }) as Promise<{total: number, rows: any[], msg: string}>
}

export function getCatalogSubjectApi(subjectId: string) {
  return request({
    url: "/business/catalog/subject/{subjectId}".replace('{subjectId}', subjectId),
    method: "get",
  })
}

export function getQrcodeApi(subjectId: string) {
  return request({
    url: "/business/qrcode/{subjectId}".replace('{subjectId}', subjectId),
    method: "get",
  }) as any;
}

export function getAdApi(AdvertiseId: string) {
  return request({
    url: "/business/advertise/{AdvertiseId}".replace('{AdvertiseId}', AdvertiseId),
    method: "get",
  }) as any;
}
