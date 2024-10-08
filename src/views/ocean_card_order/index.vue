<template>
    <div>
        <el-card class="!border-none mb-4" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" inline>
                <el-form-item label="卡名称" prop="card_name">
                    <el-input class="w-[280px]" v-model="queryParams.card_name" clearable placeholder="请输入卡名称" />
                </el-form-item>
                <el-form-item label="面值" prop="price">
                    <el-input class="w-[280px]" v-model="queryParams.price" clearable placeholder="请输入面值" />
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select class="w-[280px]" v-model="queryParams.state" clearable placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item, index) in dictData.order_status" :key="index" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="序列号" prop="serial_number">
                    <el-input class="w-[280px]" v-model="queryParams.serial_number" clearable placeholder="请输入序列号" />
                </el-form-item>
                <el-form-item label="兑换码" prop="cdk">
                    <el-input class="w-[280px]" v-model="queryParams.cdk" clearable placeholder="请输入兑换码" />
                </el-form-item>
                <el-form-item label="用户名" prop="account">
                    <el-input class="w-[280px]" v-model="queryParams.account" clearable placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="支付方式" prop="pay_method">
                    <el-select class="w-[280px]" v-model="queryParams.pay_method" clearable placeholder="请选择支付方式">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item, index) in dictData.pay_type" :key="index" :label="item.name"
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
                    <export-data class="ml-2.5" :fetch-fun="apiOceanCardOrderLists" :params="queryParams"
                        :page-size="pager.size" />
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none" v-loading="pager.loading" shadow="never">
            <el-button v-perms="['user/delete']" :disabled="!selectData.length" @click="handleDelete(selectData)">
                删除
            </el-button>
            <div class="mt-4">
                <el-table :data="pager.lists" @selection-change="handleSelectionChange" style="font-size: 12px;">
                    <el-table-column type="selection" width="55" />
                    <!-- <el-table-column label="卡id" prop="card_id" show-overflow-tooltip /> -->
                    <el-table-column label="卡名称" prop="card_name" show-overflow-tooltip />
                    <el-table-column label="金额(USD)" prop="price">
                        <template #default="{ row }">
                            <div>价格：{{ row.order_price }}</div>
                            <div>面值：{{ row.price }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="卡密" prop="pay_method" width="180">
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
                    <el-table-column label="用户" prop="account" width="120" show-overflow-tooltip />
                    <el-table-column label="支付" prop="pay_method" width="240">
                        <template #default="{ row }">
                            <div style="display: flex;">支付方式：<dict-value :options="dictData.pay_type"
                                    :value="row.pay_method" /></div>
                            <div style="display: flex;">哈希：{{ row.pay_hash }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付截图" prop="pay_img">
                        <template #default="{ row }">
                            <el-image :src="row.pay_img" :preview-src-list="[row.pay_img]" class="image"
                                style="width: 50px;margin-right: 10px" />
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="create_time" width="180">
                        <template #default="{ row }">
                            <span>{{ row.create_time ? timeFormat(row.create_time, 'yyyy-mm-dd hh:MM:ss') : '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template #default="{ row }">
                            <el-button v-if="row.state == 0" v-perms="['ocean_card_order/check']" type="primary" link
                                :disabled="row.state == 1" @click="handleCheckPass(row.id, 1)">
                                通过
                            </el-button>
                            <el-button v-if="row.state == 0" v-perms="['ocean_card_order/check']" type="primary" link
                                :disabled="row.state == 1" @click="handleCheck(row.id)">
                                拒绝
                            </el-button>
                            <span v-if="row.state == 1" style="color:#1c990b;">审核通过</span>
                            <span v-if="row.state == 2" style="color:#b11d0c;">审核拒绝<br>({{ row.remark }})</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="flex mt-4 justify-end">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
        <check-popup v-if="showCheck" ref="checkRef" :dict-data="dictData" @success="getLists"
            @close="showCheck = false" />
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
<script lang="ts" setup name="oceanCardOrderLists">
import { usePaging } from '@/hooks/usePaging'
import { useDictData } from '@/hooks/useDictOptions'
import { apiOceanCardOrderLists, apiOceanCardOrderCheck, apiOceanCardOrderDelete } from '@/api/ocean_card_order'
import { timeFormat } from '@/utils/util'
import feedback from '@/utils/feedback'
import CheckPopup from './check.vue'

const checkRef = shallowRef<InstanceType<typeof CheckPopup>>()
// 是否显示编辑框
const showCheck = ref(false)

// 查询条件
const queryParams = reactive({
    card_name: '',
    price: '',
    state: '',
    serial_number: '',
    cdk: '',
    account: '',
    pay_method: '',
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
const { dictData } = useDictData('order_status,pay_type')

// 分页相关
const { pager, getLists, resetParams, resetPage } = usePaging({
    fetchFun: apiOceanCardOrderLists,
    params: queryParams
})

// 拒绝审核
const handleCheck = async (id: any) => {
    showCheck.value = true
    await nextTick()
    checkRef.value?.open('check')
    checkRef.value?.setFormData(id)
}

// 删除
const handleDelete = async (id: number | any[]) => {
    await feedback.confirm('确定要删除？')
    await apiOceanCardOrderDelete({ id })
    getLists()
}
const handleCheckPass = async (id: number | any[], state: number | any[]) => {
    var state_txt = state == 1 ? '通过' : '拒绝';
    await feedback.confirm('确定' + state_txt + '审核？')
    await apiOceanCardOrderCheck({ id, state })
    getLists()
}
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
