import { request } from "@/utils/service"

export function getUserMenuApi(params: any) {
  return request({
    url: "/business/subject/list",
    method: "get",
    params
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

export function removeCatalogApi(dictIds: any) {
  return request({
    url: "/business/catalog/{dictIds}".replace('{dictIds}', dictIds),
    method: "delete"
  }) as Promise<{total: number, rows: any[], msg: string}>
}


export function addContentApi(data: any) {
  return request({
    url: "/business/content",
    method: "post",
    data
  }) as Promise<{total: number, rows: any[], msg: string}>
}

export function updateContentApi(data: any) {
  return request({
    url: "/business/content",
    method: "put",
    data
  }) as Promise<{total: number, rows: any[], msg: string}>
}

export function removeContentApi(contentIds: any) {
  return request({
    url: "/business/content/{contentIds}".replace('{contentIds}', contentIds),
    method: "delete"
  }) as Promise<any>
}

export function getCatalogSubjectApi(subjectId: string) {
  return request({
    url: "/business/catalog/subject/{subjectId}".replace('{subjectId}', subjectId),
    method: "get",
  })
}

export function getQrcodeApi(url: string) {
  return request({
    url: "/business/qrcode/getQRImg",
    method: "get",
    params: {url}
  }) as any;
}

export function getAdApi(advertiseId: string) {
  return request({
    url: "/business/advertise/{advertiseId}".replace('{advertiseId}', advertiseId),
    method: "get",
  }) as any;
}

export function getAdListApi(subjectId: string) {
  return request({
    url: "/business/advertise/subject/{subjectId}".replace('{subjectId}', subjectId),
    method: "get",
  }) as any;
}


export function uploadApi(data: any) {
  return request({
    url: "/business/qrcode/upload",
    method: "post",
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }) as any;
}

export function addAdApi(data: any) {
  return request({
    url: "/business/advertise",
    method: "post",
    data
  }) as any;
}

export function updateAdApi(data: any) {
  return request({
    url: "/business/advertise",
    method: "put",
    data
  }) as any;
}
