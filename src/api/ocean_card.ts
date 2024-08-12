import request from '@/utils/request'

// 礼品卡列表
export function apiOceanCardLists(params: any) {
    return request.get({ url: '/ocean_card/lists', params })
}

// 添加礼品卡
export function apiOceanCardAdd(params: any) {
    return request.post({ url: '/ocean_card/add', params })
}

// 编辑礼品卡
export function apiOceanCardEdit(params: any) {
    return request.post({ url: '/ocean_card/edit', params })
}

// 删除礼品卡
export function apiOceanCardDelete(params: any) {
    return request.post({ url: '/ocean_card/delete', params })
}

// 礼品卡详情
export function apiOceanCardDetail(params: any) {
    return request.get({ url: '/ocean_card/detail', params })
}