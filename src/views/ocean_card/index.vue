<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>
                <el-form-item label="标题" prop="name">
                    <el-input class="w-[280px]" v-model="queryParams.name" clearable placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="面值" prop="price">
                    <el-input class="w-[280px]" v-model="queryParams.price" clearable placeholder="请输入面值" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select class="w-[280px]" v-model="queryParams.state" clearable placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item, index) in dictData.card_state" :key="index" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="序列号" prop="serial_number">
                    <el-input class="w-[280px]" v-model="queryParams.serial_number" clearable placeholder="请输入序列号" />
                </el-form-item>
                <el-form-item label="兑换码" prop="cdk">
                    <el-input class="w-[280px]" v-model="queryParams.cdk" clearable placeholder="请输入兑换码" />
                </el-form-item>
                <el-form-item label="核销状态" prop="redemption_state">
                    <el-select class="w-[280px]" v-model="queryParams.redemption_state" clearable placeholder="请选择核销状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item, index) in dictData.redemption_state" :key="index" :label="item.name"
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
                    <export-data class="ml-2.5" :fetch-fun="apiOceanCardLists" :params="queryParams"
                        :page-size="pager.size" />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['ocean_card/add']" type="primary" @click="handleAdd">
                <template #icon>
                    <icon name="el-icon-Plus" />
                </template>
                新增
            </el-button>
            <el-button v-perms="['ocean_card/delete']" :disabled="!selectData.length" @click="handleDelete(selectData)">
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" />
                    <el-table-column label="标题" prop="name" show-overflow-tooltip />
                    <el-table-column label="图片" prop="image">
                        <template #default="{ row }">
                            <el-image :src="row.image" :preview-src-list="[row.image]" class="image"
                                style="width: 50px;margin-right: 10px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="面值(USD)" prop="price" show-overflow-tooltip />
                    <el-table-column label="卡密" prop="cdk" width="180">
                        <template #default="{ row }">
                            <div style="display:flex;">
                                <div>
                                    <div>{{ row.serial_number }}</div>
                                    <div>{{ row.cdk }}</div>
                                </div>
                                <icon class="copy-btn" title="复制" name="el-icon-CopyDocument" @click="copyText(row)" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="state">
                        <template #default="{ row }">
                            <!-- <dict-value :options="dictData.card_state" :value="row.state" /> -->
                            <span v-if="row.state == 1" style="color:#ccc;">已售</span>
                            <span v-if="row.state == 0" style="color:#1c990b;">未售</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="核销状态" prop="redemption_state">
                        <template #default="{ row }">
                            <!-- <dict-value :options="dictData.redemption_state" :value="row.redemption_state" /> -->
                            <span v-if="row.redemption_state == 1" style="color:#ccc;">已核销</span>
                            <span v-if="row.redemption_state == 0" style="color:#1c990b;">未核销</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                             <el-button
                                v-perms="['ocean_card/edit']"
                                type="primary"
                                link
                                @click="handleEdit(row)"
                            >
                                编辑
                            </el-button>
                        </template>
                    </el-table-column> -->
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
.el-table .el-table__cell {
    z-index: unset;
}

.copy-btn {
    position: absolute;
    right: 10px;
    bottom: 40%;
    cursor: pointer;
}
</style>
<script lang="ts" setup name="oceanCardLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiOceanCardLists, apiOceanCardDelete } from '@/api/ocean_card'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import EditPopup from './edit.vue'

const editRef = shallowRef<InstanceType<typeof EditPopup>>()
// 是否显示编辑框
const showEdit = ref(false)


// 查询条件
const queryParams = reactive({
    name: '',
    price: '',
    state: '',
    serial_number: '',
    cdk: '',
    redemption_state: '',
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

// 获取字典数据
const { dictData } = useDictData('card_state,redemption_state')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiOceanCardLists,
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
    await apiOceanCardDelete({ id })
    getLists()
}

onActivated(() => {
    getLists()
})

const copyText = async (row: any) => {
    const textArea = document.createElement('textarea');
    textArea.value = row.serial_number + "\n" + row.cdk;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    feedback.msgSuccess('复制成功')
}
getLists()
</script>
