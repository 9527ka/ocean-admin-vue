<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="账号">
                    <el-input class="w-[280px]" v-model="queryParams.account" placeholder="账号" clearable
                        @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input class="w-[280px]" v-model="queryParams.email" placeholder="邮箱" clearable
                        @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input class="w-[280px]" v-model="queryParams.mobile" placeholder="手机号" clearable
                        @keyup.enter="resetPage" />
                </el-form-item>
                <el-form-item label="注册时间" prop="create_time">
                    <daterange-picker v-model:startTime="queryParams.start_time"
                        v-model:endTime="queryParams.end_time" />
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
                <el-table-column label="ID" prop="id" min-width="90" />
                <el-table-column label="用户名" prop="account" min-width="90" />
                <el-table-column label="上级用户名" prop="parent_account" min-width="100" />
                <el-table-column label="全名" prop="real_name" min-width="90" />
                <el-table-column label="邮箱" prop="email" min-width="160" />
                <el-table-column label="手机号" prop="mobile" min-width="100" />
                <el-table-column label="积分" prop="points" min-width="60" />
                <el-table-column label="邀请码" prop="icode" min-width="90" />
                <el-table-column label="注册时间" prop="create_time" min-width="140" />
                <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                        <child-list class="inline-block mr-[10px]" @success="setData(123)" :account="row.account"
                            :id="row.id">
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
import { getUserList } from '@/api/consumer'

const queryParams = reactive({
    account: '',
    email: '',
    mobile: '',
    start_time: '',
    end_time: ''
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
