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
                <el-form-item label="标题" prop="name">
                    <el-input v-model="formData.name" clearable placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="图片" prop="image">
                    <material-picker v-model="formData.image" />
                </el-form-item>
                <el-form-item label="面值" prop="price">
                    <el-input v-model="formData.price" clearable placeholder="请输入面值" />
                </el-form-item>
                <el-form-item label="数量" prop="number">
                    <el-input v-model="formData.number" clearable placeholder="请输入数量" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="oceanCardEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiOceanCardAdd, apiOceanCardEdit, apiOceanCardDetail } from '@/api/ocean_card'
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
    return mode.value == 'edit' ? '编辑礼品卡' : '新增礼品卡'
})

// 表单数据
const formData = reactive({
    id: '',
    name: '',
    image: '',
    price: '',
    number: ''
})

// 表单验证
const formRules = reactive<any>({
    name: [{
        required: true,
        message: '请输入标题',
        trigger: ['blur']
    }],
    image: [{
        required: true,
        message: '请选择图片',
        trigger: ['blur']
    }],
    price: [{
        required: true,
        message: '请输入面值',
        trigger: ['blur']
    }],
    number: [{
        required: true,
        message: '请输入生成数量',
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
    const data = await apiOceanCardDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiOceanCardEdit(data) 
        : await apiOceanCardAdd(data)
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
