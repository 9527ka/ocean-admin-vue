<template>
    <div class="edit-popup">
        <popup
            ref="popupRef"
            :title="popupTitle"
            :async="true"
            width="80%"
            @confirm="handleSubmit"
            @close="handleClose"
        >
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="formData.title" clearable placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input class="flex-1" v-model="formData.desc" type="textarea" rows="4" clearable placeholder="请输入描述" />
                </el-form-item>
                <el-form-item label="推荐" prop="is_recommend">
                    <el-radio-group v-model="formData.is_recommend" placeholder="请选择推荐">
                        <el-radio 
                            v-for="(item, index) in dictData.is_recommend"
                            :key="index"
                            :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <editor class="flex-1" v-model="formData.content" :height="500" />
                </el-form-item>
                <el-form-item label="图片" prop="image">
                    <material-picker v-model="formData.image" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="plantsEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiPlantsAdd, apiPlantsEdit, apiPlantsDetail } from '@/api/plants'
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
    return mode.value == 'edit' ? '编辑植物表' : '新增植物表'
})

// 表单数据
const formData = reactive({
    id: '',
    title: '',
    desc: '',
    is_recommend: '',
    content: '',
    image: '',
})


// 表单验证
const formRules = reactive<any>({
    title: [{
        required: true,
        message: '请输入标题',
        trigger: ['blur']
    }],
    desc: [{
        required: true,
        message: '请输入描述',
        trigger: ['blur']
    }],
    is_recommend: [{
        required: true,
        message: '请选择推荐',
        trigger: ['blur']
    }],
    image: [{
        required: true,
        message: '请选择图片',
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
    const data = await apiPlantsDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiPlantsEdit(data) 
        : await apiPlantsAdd(data)
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
