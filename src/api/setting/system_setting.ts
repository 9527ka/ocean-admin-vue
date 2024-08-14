import request from '@/utils/request'

// 系统配置项表列表
export function apiSystemSettingLists(params: any) {
    return request.get({ url: '/setting.system_setting/lists', params })
}

// 添加系统配置项表
export function apiSystemSettingAdd(params: any) {
    return request.post({ url: '/setting.system_setting/add', params })
}

// 编辑系统配置项表
export function apiSystemSettingEdit(params: any) {
    return request.post({ url: '/setting.system_setting/edit', params })
}

// 删除系统配置项表
export function apiSystemSettingDelete(params: any) {
    return request.post({ url: '/setting.system_setting/delete', params })
}

// 系统配置项表详情
export function apiSystemSettingDetail(params: any) {
    return request.get({ url: '/setting.system_setting/detail', params })
}