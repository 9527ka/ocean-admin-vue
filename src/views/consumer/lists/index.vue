<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item label="用户名">
                    <el-input class="w-[280px]" v-model="queryParams.account" placeholder="用户名" clearable
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
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['user/add']" type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button v-perms="['user/delete']" :disabled="!selectData.length" @click="handleDelete(selectData)">
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="ID" prop="id" min-width="90" />
                    <el-table-column label="用户名" prop="account" width="100" />
                    <el-table-column label="全名" prop="real_name" min-width="100" />
                    <el-table-column label="上级" prop="parent_account" min-width="100" />
                    <el-table-column label="邮箱" prop="email" min-width="160" />
                    <el-table-column label="手机号" prop="mobile" min-width="100" />
                    <el-table-column label="积分" prop="points" min-width="60" />
                    <el-table-column label="邀请码" prop="icode" min-width="90" />
                    <el-table-column label="消费" prop="email" min-width="100">
                        <template #default="{ row }">
                            <div>总：{{ row.order_total }}</div>
                            <div>次：{{ row.order_count }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="登录信息" prop="login_device" min-width="130">
                        <template #default="{ row }">
                            <div v-if="row.login_device">{{ row.login_device }}</div>
                            <div v-if="row.login_ip">{{ row.login_ip }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="注册时间" prop="create_time" min-width="170" />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                            <child-list class="inline-block mr-[10px]" :account="row.account" :id="row.id">
                                <el-button type="primary" size="small">下级</el-button>
                            </child-list>
                            <el-button v-perms="['user/edit']" type="primary" link @click="handleEdit(row)">
                                编辑
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <edit-popup v-if="showEdit" ref="editRef" :dict-data="dictData" @success="getLists" @close="showEdit = false" />
    </div>
</template>

<script lang="ts" setup name="userLists">
import ChildList from './child_list.vue'
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { getUserList, apiUserDelete } from '@/api/consumer'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    account: '',
    password: '',
    mobile: '',
    email: '',
    points: '',
    login_ip: '',
    login_time: '',
    login_device: '',
    parent_id: '',
    parent_2_id: '',
    start_time: '',
    end_time: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: getUserList,
    params: queryParams
})

// 添加
const handleAdd = async () => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('add')
}

// 编辑
const handleEdit = async (data: any) => {
    showEdit.value = true
    await nextTick()
    editRef.value?.open('edit')
    editRef.value?.setFormData(data)
}

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiUserDelete({ id })
    getLists()
}

getLists()
</script>
