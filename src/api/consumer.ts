import request from '@/utils/request'

// 用户列表
export function getUserList(params: any) {
    return request.get({ url: '/user.user/lists', params }, { ignoreCancelToken: true })
}

// 用户详情
export function getUserDetail(params: any) {
    return request.get({ url: '/user.user/detail', params })
}

// 用户编辑
export function userEdit(params: any) {
    return request.post({ url: '/user.user/edit', params })
}

// 用户编辑
export function adjustMoney(params: any) {
    return request.post({ url: '/user.user/adjustMoney', params })
}
// 添加用户表
export function apiUserAdd(params: any) {
    return request.post({ url: '/user.user/add', params })
}

// 编辑用户表
export function apiUserEdit(params: any) {
    return request.post({ url: '/user.user/edit', params })
}

// 删除用户表
export function apiUserDelete(params: any) {
    return request.post({ url: '/user.user/delete', params })
}

// 用户表详情
export function apiUserDetail(params: any) {
    return request.get({ url: '/user.user/detail', params })
}