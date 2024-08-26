<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>
                <el-form-item label="用户id" prop="user_id">
                    <el-input class="w-[280px]" v-model="queryParams.user_id" clearable placeholder="请输入用户id" />
                </el-form-item>
                <el-form-item label="用户名" prop="user_id">
                    <el-input class="w-[280px]" v-model="queryParams.account" clearable placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="审核状态" prop="audit_status">
                    <el-select class="w-[280px]" v-model="queryParams.audit_status" clearable placeholder="请选择审核状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item, index) in dictData.check_status" :key="index" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                    <daterange-picker v-model:startTime="queryParams.start_time"
                        v-model:endTime="queryParams.end_time" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['user/delete']" :disabled="!selectData.length" @click="handleDelete(selectData)">
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="用户ID" prop="user_id" show-overflow-tooltip />
                    <el-table-column label="用户名" prop="account" show-overflow-tooltip />
                    <el-table-column label="图片" prop="poster_images">
                        <template #default="{ row }">
                            <el-image v-for="(image, index) in parseImages(row.poster_images)" :key="index" :src="image"
                                :preview-src-list="parseImages(row.poster_images)" class="image"
                                style="width: 50px;margin-right: 10px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time">
                        <template #default="{ row }">
                            <span>{{ row.create_time ? timeFormat(row.create_time, 'yyyy-mm-dd hh:MM:ss') : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="审核" width="120" fixed="right">
                        <template #default="{ row }">
                            <el-button v-if="row.audit_status == 0" v-perms="['user_posters/check']" type="primary" link
                                :disabled="row.audit_status == 1" @click="handleCheck(row.id, 1)">
                                通过
                            </el-button>
                            <el-button v-if="row.audit_status == 0" v-perms="['user_posters/check']" type="primary" link
                                :disabled="row.audit_status == 9" @click="handleCheck(row.id, 9)">
                                拒绝
                            </el-button>
                            <span v-if="row.audit_status == 1" style="color:#1c990b;">通过</span>
                            <span v-if="row.audit_status == 9" style="color:#b11d0c;">拒绝</span>
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
<style>
.poster-box img {
    float: left;
    padding-right: 5px;
}

.el-table .el-table__cell {
    z-index: unset;
}

.el-image-viewer__wrapper {
    z-index: 9999 !important;
}
</style>
<script lang="ts" setup name="userPostersLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiUserPostersLists, apiUserPostersDelete, apiUserPostersCheck } from '@/api/user_posters'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    user_id: '',
    account: '',
    audit_status: '',
    create_time: '',
    start_time: '',
    end_time: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}
// 判断并转换图片字符串为数组
const parseImages = (posterImages: any[]) => {
    if (typeof posterImages === 'string') {
        try {
            // 替换单引号为双引号，并尝试解析
            return JSON.parse(posterImages.replace(/'/g, '"'));
        } catch (error) {
            console.error('无法解析 poster_images:', error);
            return [];
        }
    }
    return posterImages;
}
// 获取字典数据
const { dictData } = useDictData('check_status')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiUserPostersLists,
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
    await apiUserPostersDelete({ id })
    getLists()
}
const handleCheck = async (id: number | any[], audit_status: number | any[]) => {
    var state_txt = audit_status == 1 ? '通过' : '拒绝';
    await feedback.confirm('确定' + state_txt + '审核？')
    await apiUserPostersCheck({ id, audit_status })
    getLists()
}
getLists()
</script>
