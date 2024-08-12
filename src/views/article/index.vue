<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form
                class="mb-[-16px]"
                :model="queryParams"
                inline
            >
                <el-form-item label="标题" prop="title">
                    <el-input class="w-[280px]" v-model="queryParams.title" clearable placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="主题" prop="theme">
                    <el-input class="w-[280px]" v-model="queryParams.theme" clearable placeholder="请输入主题" />
                </el-form-item>
                <el-form-item label="精选标志" prop="is_quality">
                    <el-select class="w-[280px]" v-model="queryParams.is_quality" clearable placeholder="请选择精选标志">
                        <el-option label="全部" value=""></el-option>
                        <el-option 
                            v-for="(item, index) in dictData.is_quality"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="时间" prop="date">
                  <el-date-picker
                      v-model="queryParams.date"
                      type="date"
                      placeholder="选择日期"
                      value-format="YYYY-MM-DD">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="创建时间" prop="create_time">
                  <el-date-picker
                      v-model="queryParams.create_time"
                      type="date"
                      placeholder="选择日期"
                      value-format="YYYY-MM-DD"
                  />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['article/add']" type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button
                v-perms="['article/delete']"
                :disabled="!selectData.length"
                @click="handleDelete(selectData)"
            >
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="ID" prop="id" show-overflow-tooltip />
                    <el-table-column label="标题" prop="title" show-overflow-tooltip />
                    <el-table-column label="文章概述" prop="desc" show-overflow-tooltip />
                    <el-table-column label="主题" prop="theme" show-overflow-tooltip />
                    <el-table-column label="精选标志" prop="is_quality">
                        <template #default="{ row }">
                            <dict-value :options="dictData.is_quality" :value="row.is_quality" />
                        </template>
                    </el-table-column>
                    <el-table-column label="时间" prop="date" show-overflow-tooltip />
                    <el-table-column label="图片" prop="image">
                        <template #default="{ row }">
                            <el-image style="width:50px;height:50px;" :src="row.image" />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" show-overflow-tooltip />
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['article/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                            <el-button
                                v-perms="['article/delete']"
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

<script lang="ts" setup name="articleLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiArticleLists, apiArticleDelete } from '@/api/article'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    title: '',
    theme: '',
    is_quality: '',
    date: '',
    create_time: ''
})


// 选中数据
const selectData = ref<any[]>([])

// 表格选择后回调事件
const handleSelectionChange = (val: any[]) => {
    selectData.value = val.map(({ id }) => id)
}

// 获取字典数据
const { dictData } = useDictData('is_quality')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiArticleLists,
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
    await apiArticleDelete({ id })
    getLists()
}

getLists()

</script>

