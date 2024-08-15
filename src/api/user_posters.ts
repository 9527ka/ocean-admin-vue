import request from '@/utils/request'

// 会员分享海报表列表
export function apiUserPostersLists(params: any) {
    return request.get({ url: '/user_posters/lists', params })
}

// 添加会员分享海报表
export function apiUserPostersAdd(params: any) {
    return request.post({ url: '/user_posters/add', params })
}

// 编辑会员分享海报表
export function apiUserPostersEdit(params: any) {
    return request.post({ url: '/user_posters/edit', params })
}

// 删除会员分享海报表
export function apiUserPostersDelete(params: any) {
    return request.post({ url: '/user_posters/delete', params })
}

// 会员分享海报表详情
export function apiUserPostersDetail(params: any) {
    return request.get({ url: '/user_posters/detail', params })
}

// 会员分享海报审核
export function apiUserPostersCheck(params: any) {
    return request.post({ url: '/user_posters/check', params })
}
