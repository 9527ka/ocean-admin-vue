<template>
    <div>
        <popup ref="popupRef" :clickModalClose="true" :title="popupTitle" width="900px" :modal-append-to-body="false"
            :show-close="false" :show-confirm-button="false">
            <template #trigger>
                <slot></slot>
            </template>
            <div class="list">
                <!-- <div>上级：</div> -->
                <!-- <div>邀请码：{{ formData.channel }}</div> -->
                <div style="background-color: #4a5dff;">总充值额度：{{ formData.order_total }}</div>
                <div style="background-color: #01CFE8;">总充值次数：{{ formData.order_count }}</div>
                <div style="background-color: #FF9F43;">下级人数：{{ formData.subordinate_count }}</div>
                <div style="background-color: #28C76F;">下级分享次数：{{ formData.has_share_user_count }}</div>
            </div>
            <!-- <el-card class="!border-none" shadow="never">
                <el-form ref="formRef" class="mb-[-16px]" :model="queryParams" :inline="true">
                    <el-form-item label="用户信息">
                        <el-input class="w-[280px]" v-model="queryParams.keyword" placeholder="账号/昵称/手机号码" clearable
                            @keyup.enter="resetPage" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetPage">查询</el-button>
                        <el-button @click="resetParams">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card> -->
            <el-card class="!border-none mt-4" shadow="never">
                <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                    <el-table-column label="一级用户" prop="user_name" min-width="120" />
                    <el-table-column label="邀请时间" prop="create_time" min-width="120" />
                    <el-table-column label="二级用户" prop="child_1_name" min-width="130" />
                    <el-form-item label="邀请时间">
                        <template #default="{ row }">
                            <span>{{ queryParams.child_1_create_time ? timeFormat(queryParams.child_1_create_time,
            'yyyy-mm-dd hh:MM:ss') : '' }}</span>
                        </template>
                    </el-form-item>
                </el-table>
                <div class="flex justify-end mt-4">
                    <pagination v-model="pager" @change="getLists" />
                </div>
            </el-card>
        </popup>
    </div>
</template>
<style lang="scss" scoped>
.list {
    display: flex;
    margin-left: 20px;

    div {
        padding: 10px 15px;
        color: #fff;
        border-radius: 10px;
        margin-right: 10px;
    }
}
</style>
<script lang="ts" setup name="childLists">
import Popup from '@/components/popup/index.vue'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'
import { getUserList, getUserDetail } from '@/api/consumer'
import { ClientMap } from '@/enums/appEnums'
import type { defineProps } from 'vue'
const props = defineProps({
    userInfo: Object
})
const popupTitle = computed(() => {
    return props.userInfo.account + ' 用户下级详情'
})
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const queryParams = reactive({
    user_id: '',
    keyword: ''
})
const formData = reactive({
    // parent_account:'',//上级用户
    order_total: 0,//下级订单总额
    order_count: 0,//下级订单总数
    subordinate_count: '',//下级总人数
    has_share_user_count: '',//有分享记录的账号总数
    // user_discount: 0,//用户等级
})
queryParams.user_id = props.userInfo.id
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getUserList,
    params: queryParams
})

const handleUserDetail = async () => {
    var res = await getUserDetail({ id: props.userInfo.id })
    Object.keys(formData).forEach((key) => {
        formData[key] = res[key]
    })
}
const setData = async (user_id: any) => {
    queryParams.user_id = user_id
    getLists()
}

watch(
    () => popupRef.value?.visible,
    (value) => {
        if (value) {
            getLists()
            handleUserDetail()
        }
    }
)
defineExpose({
    setData
})
</script>
