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
                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="formData.name" clearable placeholder="请输入等级名称" />
                </el-form-item>
                <el-form-item label="折扣" prop="discount">
                    <el-input v-model="formData.discount" clearable placeholder="请输入折扣" />
                </el-form-item>
                <el-form-item label="积分" prop="points">
                    <el-input v-model="formData.points" clearable placeholder="请输入积分" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="userLevelsEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiUserLevelsAdd, apiUserLevelsEdit, apiUserLevelsDetail } from '@/api/user_levels'
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
    return mode.value == 'edit' ? '编辑会员等级' : '新增会员等级'
})

// 表单数据
const formData = reactive({
    id: '',
    name: '',
    discount: '',
    points: '',
})


// 表单验证
const formRules = reactive<any>({
    name: [{
        required: true,
        message: '请输入等级名称',
        trigger: ['blur']
    }],
    discount: [{
        required: true,
        message: '请输入折扣',
        trigger: ['blur']
    }],
    points: [{
        required: true,
        message: '请输入积分',
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
    
    
}

const getDetail = async (row: Record<string, any>) => {
    const data = await apiUserLevelsDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiUserLevelsEdit(data) 
        : await apiUserLevelsAdd(data)
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
