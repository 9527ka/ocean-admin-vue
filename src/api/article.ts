import request from '@/utils/request'

// 文章表列表
export function apiArticleLists(params: any) {
    return request.get({ url: '/article/lists', params })
}

// 添加文章表
export function apiArticleAdd(params: any) {
    return request.post({ url: '/article/add', params })
}

// 编辑文章表
export function apiArticleEdit(params: any) {
    return request.post({ url: '/article/edit', params })
}

// 删除文章表
export function apiArticleDelete(params: any) {
    return request.post({ url: '/article/delete', params })
}

// 文章表详情
export function apiArticleDetail(params: any) {
    return request.get({ url: '/article/detail', params })
}