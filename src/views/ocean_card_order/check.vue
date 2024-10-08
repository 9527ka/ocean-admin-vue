<template>
    <div class="check-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="40%" @confirm="handleSubmit"
            @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-form-item label="拒绝理由" prop="remark">
                    <el-input v-model="formData.remark" clearable placeholder="请输入拒绝理由" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="oceanCardOrderCheck">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiOceanCardOrderCheck } from '@/api/ocean_card_order'
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
    return '审核'
})

// 表单数据
const formData = reactive({
    remark: '',
    state: 2,
    id: ''
})

// 表单验证
const formRules = reactive<any>({
    title: [{
        required: true,
        message: '请输入拒绝理由',
        trigger: ['blur']
    }],
})

// 获取详情
const setFormData = async (id: any) => {
    formData['id'] = id
    console.log(id)
}

// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData, }
    await apiOceanCardOrderCheck(data)
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
    setFormData
})
</script>
