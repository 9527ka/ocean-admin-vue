<template>
    <div>
        <popup ref="popupRef" :clickModalClose="true" :title="popupTitle" width="900px" :modal-append-to-body="false"
            :show-close="false" :show-confirm-button="false">
            <template #trigger>
                <slot></slot>
            </template>
            <div class="list">
                <div style="background-color: #4a5dff;">总充值额度：{{ formData.order_total }}</div>
                <div style="background-color: #01CFE8;">总充值次数：{{ formData.order_count }}</div>
                <div style="background-color: #FF9F43;">下级人数：{{ formData.subordinate_count }}</div>
                <div style="background-color: #28C76F;">下级分享次数：{{ formData.has_share_user_count }}</div>
            </div>
            <el-card class="!border-none mt-4" shadow="never">
                <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                    <el-table-column label="一级用户" prop="user_name" min-width="120" />
                    <el-table-column label="邀请时间" prop="create_time" min-width="120" />
                    <el-table-column label="二级用户" prop="child_1_name" min-width="130" />
                    <el-table-column label="邀请时间" prop="child_1_create_time" min-width="120" />
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
import { getUserList, getUserDetail } from '@/api/consumer'
import type { defineProps } from 'vue'

const props = defineProps({
    account: String,
    id: String
})
const popupTitle = computed(() => {
    return `${props.account || '用户'} 用户下级详情`;
});

const popupRef = shallowRef<InstanceType<typeof Popup>>()

const formData = reactive({
    order_total: 0,//下级订单总额
    order_count: 0,//下级订单总数
    subordinate_count: '',//下级总人数
    has_share_user_count: '',//有分享记录的账号总数
})

const param = reactive({
    user_id: props.id
});
const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getUserList,
    params: param
})
const handleUserDetail = async () => {
    try {
        const res = await getUserDetail({ id: props.id });
        Object.keys(formData).forEach((key) => {
            if (res.hasOwnProperty(key)) {
                formData[key] = res[key];
            }
        });
    } catch (error) {
        console.error('Error fetching user details:', error);
    }
};

watch(
    () => popupRef.value?.visible,
    (value) => {
        if (value) {
            param.user_id = props.id;
            getLists();
            handleUserDetail();
        }
    }
);
</script>
