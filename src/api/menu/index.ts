import { request } from "@/utils/service"

export function getUserMenuApi() {
  return request({
    url: "/business/catalog/list",
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
