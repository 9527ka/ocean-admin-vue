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
                <el-form-item label="文章概述" prop="desc">
                    <el-input class="flex-1" v-model="formData.desc" type="textarea" rows="4" clearable placeholder="请输入文章概述" />
                </el-form-item>
                <el-form-item label="主题" prop="theme">
                    <el-input v-model="formData.theme" clearable placeholder="请输入主题" />
                </el-form-item>
                <el-form-item label="精选标志" prop="is_quality">
                    <el-radio-group v-model="formData.is_quality" placeholder="请选择精选标志">
                        <el-radio 
                            v-for="(item, index) in dictData.is_quality"
                            :key="index"
                            :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="时间" prop="date">
                    <el-date-picker 
                        class="flex-1 !flex"
                        v-model="formData.date"
                        clearable
                        type="date"
                        value-format="YYYY-MM-DD"
                        placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                
                <el-form-item label="图片" prop="image">
                    <material-picker v-model="formData.image" />
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <editor class="flex-1" v-model="formData.content" :height="500" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="articleEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiArticleAdd, apiArticleEdit, apiArticleDetail } from '@/api/article'
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
    return mode.value == 'edit' ? '编辑文章表' : '新增文章表'
})

// 表单数据
const formData = reactive({
    id: '',
    title: '',
    desc: '',
    theme: '',
    is_quality: '',
    date: '',
    image: '',
    content: ''
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
        message: '请输入文章概述',
        trigger: ['blur']
    }],
    theme: [{
        required: true,
        message: '请输入主题',
        trigger: ['blur']
    }],
    is_quality: [{
        required: true,
        message: '请选择精选标志',
        trigger: ['blur']
    }],
    date: [{
        required: true,
        message: '请选择时间',
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
    const data = await apiArticleDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData,  }
    mode.value == 'edit' 
        ? await apiArticleEdit(data) 
        : await apiArticleAdd(data)
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
