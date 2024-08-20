<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="用户信息">
                    <el-input class="w-[280px]" v-model="queryParams.keyword" placeholder="账号/昵称/邮箱/手机号码" clearable
                        @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item label="注册时间">
                    <daterange-picker v-model:startTime="queryParams.create_time_start"
                        v-model:endTime="queryParams.create_time_end" />
                </el-form-item>
                <el-form-item label="注册来源">
                    <el-select class="w-[280px]" v-model="queryParams.channel">
                        <el-option v-for="(item, key) in ClientMap" :key="key" :label="item" :value="key" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                    <export-data class="ml-2.5" :fetch-fun="getUserList" :params="queryParams"
                        :page-size="pager.size" />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="账号" prop="account" min-width="100" />
                <el-table-column label="用户名" prop="real_name" min-width="120" />
                <el-table-column label="邮箱" prop="email" min-width="130" />
                <el-table-column label="手机号" prop="mobile" min-width="100" />
                <el-table-column label="积分" prop="points" min-width="120" />
                <el-table-column label="邀请码" prop="icode" min-width="120" />
                <el-table-column label="注册时间" prop="create_time" min-width="140" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <child-list class="inline-block mr-[10px]" @success="getLists" :userInfo="row">
                            <el-button type="primary" size="small">查看下级</el-button>
                        </child-list>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup name="consumerLists">

import ChildList from './child_list.vue'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import { getUserList } from '@/api/consumer'
import { ClientMap } from '@/enums/appEnums'

const queryParams = reactive({
    keyword: '',
    channel: '',
    create_time_start: '',
    create_time_end: ''
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getUserList,
    params: queryParams
})
onActivated(() => {
    getLists()
})

getLists()
</script>
