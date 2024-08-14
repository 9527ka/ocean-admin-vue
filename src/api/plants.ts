import request from '@/utils/request'

// 植物表列表
export function apiPlantsLists(params: any) {
    return request.get({ url: '/plants/lists', params })
}

// 添加植物表
export function apiPlantsAdd(params: any) {
    return request.post({ url: '/plants/add', params })
}

// 编辑植物表
export function apiPlantsEdit(params: any) {
    return request.post({ url: '/plants/edit', params })
}

// 删除植物表
export function apiPlantsDelete(params: any) {
    return request.post({ url: '/plants/delete', params })
}

// 植物表详情
export function apiPlantsDetail(params: any) {
    return request.get({ url: '/plants/detail', params })
}