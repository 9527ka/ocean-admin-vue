<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="550px" @confirm="handleSubmit"
            @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <el-form-item label="头像" prop="avatar">
                    <material-picker v-model="formData.avatar" />
                </el-form-item>
                <el-form-item label="用户名" prop="account" v-if="mode == 'add'">
                    <el-input v-model="formData.account" clearable placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="全名" prop="real_name">
                    <el-input v-model="formData.real_name" clearable placeholder="请输入全名" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="formData.mobile" clearable placeholder="请输入手机号" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formData.email" clearable placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="积分" prop="points">
                    <el-input v-model="formData.points" clearable placeholder="请输入积分" />
                </el-form-item>
                <el-form-item label="邀请码" prop="invitation_code" v-if="!formData.id">
                    <el-input v-model="formData.invitation_code" clearable placeholder="请输入邀请码" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-if="formData.id">
                    <el-input v-model="formData.password" clearable placeholder="请输入密码(非必填，不修改留空)" />
                </el-form-item>
                <el-form-item label="密码" prop="password" v-else>
                    <el-input v-model="formData.password" clearable placeholder="请输入密码(必填)" />
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="userEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiUserAdd, apiUserEdit, apiUserDetail } from '@/api/consumer'
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
    return mode.value == 'edit' ? '编辑用户：' + formData.account : '新增用户'
})

// 表单数据
const formData = reactive({
    id: '',
    avatar: '',
    real_name: '',
    account: '',
    password: '',
    mobile: '',
    email: '',
    points: '',
    invitation_code: '',
})


// 表单验证
const formRules = reactive<any>({
    real_name: [{
        required: true,
        message: '请输入全名',
        trigger: ['blur']
    }],
    account: [{
        required: true,
        message: '请输入用户名',
        trigger: ['blur']
    }],
    mobile: [{
        required: true,
        message: '请输入手机号',
        trigger: ['blur']
    }],
    email: [{
        required: true,
        message: '请输入邮箱',
        trigger: ['blur']
    }],
    points: [{
        required: true,
        message: '请输入积分',
        trigger: ['blur']
    }],
    invitation_code: [{
        required: true,
        message: '请输入邀请码',
        trigger: ['blur']
    }],
    password: [{
        required: true,
        message: '请输入密码',
        trigger: ['blur']
    }],
})
watch(mode, (newMode) => {
    if (newMode === 'edit') {
        formRules.invitation_code = [];
        formRules.password = [];
    }
}, { immediate: true });

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
    const data = await apiUserDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData, }
    mode.value == 'edit'
        ? await apiUserEdit(data)
        : await apiUserAdd(data)
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
