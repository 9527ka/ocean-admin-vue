<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="版本号" prop="version_no">
                    <el-select class="w-[280px]" v-model="queryParams.version_no" clearable placeholder="请选择版本号">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.version_no"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否支持多语言" prop="multi_language">
                    <el-select class="w-[280px]" v-model="queryParams.multi_language" clearable placeholder="请选择是否支持多语言">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.status"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="语种" prop="language">
                    <el-select class="w-[280px]" v-model="queryParams.language" clearable placeholder="请选择语种">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.lang_list"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="配置项key" prop="key">
                    <el-select class="w-[280px]" v-model="queryParams.key" clearable placeholder="请选择配置项key">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.system_setting"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否生效" prop="status">
                    <el-select class="w-[280px]" v-model="queryParams.status" clearable placeholder="请选择是否生效">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.status"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['system_setting/add']" type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button
                v-perms="['system_setting/delete']"
                :disabled="!selectData.length"
                @click="handleDelete(selectData)"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="版本号" prop="version_no">
                        <template #default="{ row }">
                            <dict-value :options="dictData.version_no" :value="row.version_no" />
                        </template>
                    </el-table-column>
                    <el-table-column label="是否支持多语言" prop="multi_language">
                        <template #default="{ row }">
                            <dict-value :options="dictData.status" :value="row.multi_language" />
                        </template>
                    </el-table-column>
                    <el-table-column label="语种" prop="language">
                        <template #default="{ row }">
                            <dict-value :options="dictData.lang_list" :value="row.language" />
                        </template>
                    </el-table-column>
                    <el-table-column label="配置项key" prop="key">
                        <template #default="{ row }">
                            <dict-value :options="dictData.system_setting" :value="row.key" />
                        </template>
                    </el-table-column>
                    <el-table-column label="配置项的值" prop="value" show-overflow-tooltip />
                    <el-table-column label="是否生效" prop="status">
                        <template #default="{ row }">
                            <dict-value :options="dictData.status" :value="row.status" />
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['system_setting/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                v-perms="['system_setting/delete']"
                                type="danger"
                                link
                                @click="handleDelete(row.id)"
                            >
                                删除
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

<script lang="ts" setup name="systemSettingLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiSystemSettingLists, apiSystemSettingDelete } from '@/api/setting/system_setting'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    version_no: '',
    multi_language: '',
    language: '',
    key: '',
    status: ''
})

// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('version_no,status,lang_list,system_setting')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiSystemSettingLists,
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
    await apiSystemSettingDelete({ id })
    getLists()
}

getLists()
</script>

