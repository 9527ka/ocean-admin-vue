import request from '@/utils/request'

// 动物表列表
export function apiAnimalsLists(params: any) {
    return request.get({ url: '/animals/lists', params })
}

// 添加动物表
export function apiAnimalsAdd(params: any) {
    return request.post({ url: '/animals/add', params })
}

// 编辑动物表
export function apiAnimalsEdit(params: any) {
    return request.post({ url: '/animals/edit', params })
}

// 删除动物表
export function apiAnimalsDelete(params: any) {
    return request.post({ url: '/animals/delete', params })
}

// 动物表详情
export function apiAnimalsDetail(params: any) {
    return request.get({ url: '/animals/detail', params })
}