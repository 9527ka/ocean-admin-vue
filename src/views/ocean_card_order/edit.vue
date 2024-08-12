<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="550px"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="oceanCardOrderEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiOceanCardOrderAdd, apiOceanCardOrderEdit, apiOceanCardOrderDetail } from '@/api/ocean_card_order'
import { timeFormat } from '@/utils/util'
import type { PropType } from 'vue'
defineProps({
    dictData: {
        type: Object as PropType<Record<string, any[]>>,
        default: () => ({})
    }
})
const emit = defineEmits(['success', 'close'])
const formRef = shallowRef<FormInstance>()
const popupRef = shallowRef<InstanceType<typeof Popup>>()
const mode = ref('add')


// 弹窗标题
const popupTitle = computed(() => {
    return mode.value == 'edit' ? '编辑销售订单' : '新增销售订单'
})

// 表单数据
const formData = reactive({
    id: '',
    
})


// 表单验证
const formRules = reactive<any>({
    card_id: [{
        required: true,
        message: '请输入卡id',
        trigger: ['blur']
    }],
    card_name: [{
        required: true,
        message: '请输入卡名称',
        trigger: ['blur']
    }],
    price: [{
        required: true,
        message: '请输入面值',
        trigger: ['blur']
    }],
    state: [{
        required: true,
        message: '请选择状态',
        trigger: ['blur']
    }],
    serial_number: [{
        required: true,
        message: '请输入序列号',
        trigger: ['blur']
    }],
    cdk: [{
        required: true,
        message: '请输入兑换码',
        trigger: ['blur']
    }],
    username: [{
        required: true,
        message: '请输入用户名',
        trigger: ['blur']
    }],
    user_id: [{
        required: true,
        message: '请输入用户ID',
        trigger: ['blur']
    }],
    pay_method: [{
        required: true,
        message: '请选择支付方式',
        trigger: ['blur']
    }],
    pay_img: [{
        required: true,
        message: '请输入支付截图',
        trigger: ['blur']
    }],
    create_time: [{
        required: true,
        message: '请选择创建时间',
        trigger: ['blur']
    }]
})


// 获取详情
const setFormData = async (data: Record<any, any>) => {
    for (const key in formData) {
        if (data[key] != null && data[key] != undefined) {
            //@ts-ignore
            formData[key] = data[key]
        }
    }
    
    //@ts-ignore
    formData.create_time = timeFormat(formData.create_time,'yyyy-mm-dd hh:MM:ss') 
}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiOceanCardOrderDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiOceanCardOrderEdit(data) 
        : await apiOceanCardOrderAdd(data)
    popupRef.value?.close()
    emit('success')
}

//打开弹窗
const open = (type = 'add') => {
    mode.value = type
    popupRef.value?.open()
}

// 关闭回调
const handleClose = () => {
    emit('close')
}



defineExpose({
    open,
    setFormData,
    getDetail
})
</script>
