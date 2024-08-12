import request from '@/utils/request'

// 销售订单列表
export function apiOceanCardOrderLists(params: any) {
    return request.get({ url: '/ocean_card_order/lists', params })
}

// 添加销售订单
export function apiOceanCardOrderAdd(params: any) {
    return request.post({ url: '/ocean_card_order/add', params })
}

// 编辑销售订单
export function apiOceanCardOrderEdit(params: any) {
    return request.post({ url: '/ocean_card_order/edit', params })
}

// 删除销售订单
export function apiOceanCardOrderDelete(params: any) {
    return request.post({ url: '/ocean_card_order/delete', params })
}

// 销售订单详情
export function apiOceanCardOrderDetail(params: any) {
    return request.get({ url: '/ocean_card_order/detail', params })
}
//订单审核
export function apiOceanCardOrderCheck(params: any) {
    return request.post({ url: '/ocean_card_order/check', params })
}