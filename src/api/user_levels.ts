import request from '@/utils/request'

// 会员等级列表
export function apiUserLevelsLists(params: any) {
    return request.get({ url: '/user_levels/lists', params })
}

// 添加会员等级
export function apiUserLevelsAdd(params: any) {
    return request.post({ url: '/user_levels/add', params })
}

// 编辑会员等级
export function apiUserLevelsEdit(params: any) {
    return request.post({ url: '/user_levels/edit', params })
}

// 删除会员等级
export function apiUserLevelsDelete(params: any) {
    return request.post({ url: '/user_levels/delete', params })
}

// 会员等级详情
export function apiUserLevelsDetail(params: any) {
    return request.get({ url: '/user_levels/detail', params })
}