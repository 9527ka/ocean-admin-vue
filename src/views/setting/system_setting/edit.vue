<template>
    <div class="edit-popup">
        <popup ref="popupRef" :title="popupTitle" :async="true" width="60%" @confirm="handleSubmit"
            @close="handleClose">
            <el-form ref="formRef" :model="formData" label-width="90px" :rules="formRules">
                <!-- <el-form-item label="版本号" prop="version_no">
                    <el-select class="flex-1" v-model="formData.version_no" clearable placeholder="请选择版本号">
                        <el-option v-for="(item, index) in dictData.version_no" :key="index" :label="item.name"
                            :value="parseInt(item.value)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否支持多语言" prop="multi_language">
                    <el-radio-group v-model="formData.multi_language" placeholder="请选择是否支持多语言">
                        <el-radio 
                            v-for="(item, index) in dictData.status"
                            :key="index"
                            :label="parseInt(item.value)"
                        >
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="语种" prop="language">
                    <el-select class="flex-1" v-model="formData.language" clearable placeholder="请选择语种">
                        <el-option 
                            v-for="(item, index) in dictData.lang_list"
                            :key="index" 
                            :label="item.name"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item> -->
                <el-form-item label="配置项key" prop="key">
                    <el-select class="flex-1" v-model="formData.key" clearable placeholder="请选择配置项key">
                        <el-option v-for="(item, index) in dictData.system_setting" :key="index" :label="item.name"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="描述" prop="value">
                    <el-input class="flex-1" v-model="formData.remark" type="textarea" rows="4" clearable
                        placeholder="请输入文章概述" />
                </el-form-item> -->
                <el-form-item label="内容" prop="value">
                    <editor class="flex-1" v-model="formData.value" :height="500" />
                </el-form-item>
                <el-form-item label="是否生效" prop="status">
                    <el-radio-group v-model="formData.status" placeholder="请选择是否生效">
                        <el-radio v-for="(item, index) in dictData.status" :key="index" :label="parseInt(item.value)">
                            {{ item.name }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </popup>
    </div>
</template>

<script lang="ts" setup name="systemSettingEdit">
import type { FormInstance } from 'element-plus'
import Popup from '@/components/popup/index.vue'
import { apiSystemSettingAdd, apiSystemSettingEdit, apiSystemSettingDetail } from '@/api/setting/system_setting'
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
    return mode.value == 'edit' ? '编辑系统配置项表' : '新增系统配置项表'
})

// 表单数据
const formData = reactive({
    id: '',
    version_no: '',
    remark: '',
    multi_language: '',
    language: '',
    key: '',
    value: '',
    status: '',
})


// 表单验证
const formRules = reactive<any>({
    // version_no: [{
    //     required: true,
    //     message: '请选择版本号',
    //     trigger: ['blur']
    // }],
    // multi_language: [{
    //     required: true,
    //     message: '请选择是否支持多语言',
    //     trigger: ['blur']
    // }],
    // language: [{
    //     required: true,
    //     message: '请选择语种',
    //     trigger: ['blur']
    // }],
    key: [{
        required: true,
        message: '请选择配置项key',
        trigger: ['blur']
    }],
    status: [{
        required: true,
        message: '请选择是否生效',
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
    const data = await apiSystemSettingDetail({
        id: row.id
    })
    setFormData(data)
}


// 提交按钮
const handleSubmit = async () => {
    await formRef.value?.validate()
    const data = { ...formData, }
    mode.value == 'edit'
        ? await apiSystemSettingEdit(data)
        : await apiSystemSettingAdd(data)
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
