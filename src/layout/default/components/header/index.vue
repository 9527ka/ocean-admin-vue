<template>
    <header class="header">
        <div class="navbar">
            <div class="flex-1 flex">
                <div class="navbar-item">
                    <fold />
                </div>
                <div class="navbar-item">
                    <refresh />
                </div>
                <div class="flex items-center px-2" v-if="!isMobile && settingStore.showCrumb">
                    <breadcrumb />
                </div>
                <div class="audio-box">
                    订单监听：<el-switch v-model="isMonitoring" @change="toggleMonitoring" width="50"
                        class="custom-switch"></el-switch>
                </div>
            </div>
            <div class="flex">
                <div class="navbar-item" v-if="!isMobile">
                    <full-screen />
                </div>
                <div class="navbar-item">
                    <user-drop-down />
                </div>
                <div class="navbar-item">
                    <setting />
                </div>
            </div>
        </div>
        <multiple-tabs v-if="settingStore.openMultipleTabs" />
        <!-- 音频元素 -->
        <audio ref="audioPlayer" :src="audioRechargeSrc" style="display:none;"></audio>
        <audio ref="audioPlayer2" :src="audioShareSrc" style="display:none;"></audio>
    </header>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/modules/app'
import Fold from './fold.vue'
import Refresh from './refresh.vue'
import Breadcrumb from './breadcrumb.vue'
import FullScreen from './full-screen.vue'
import UserDropDown from './user-drop-down.vue'
import Setting from '../setting/index.vue'
import MultipleTabs from './multiple-tabs.vue'

import useSettingStore from '@/stores/modules/setting'
import { checkOrder } from '@/api/app'

const appStore = useAppStore()
const isMobile = computed(() => appStore.isMobile)
const settingStore = useSettingStore()

// 音频文件路径
import audioRechargeSrc from '@/assets/audio/recharge.mp3'
import audioShareSrc from '@/assets/audio/share.mp3'
// 是否正在监控订单
const isMonitoring = ref<boolean>(false);
// 定时器引用
const timer = ref<number | null>(null);
// 获取音频元素的引用
const audioPlayer = ref<HTMLAudioElement | null>(null);
const audioPlayer2 = ref<HTMLAudioElement | null>(null);
// 开始监控订单变化
const startMonitoring = () => {
    isMonitoring.value = true; // 设置监控状态为 true
    // 每隔3秒请求一次接口
    timer.value = window.setInterval(fetchData, 15000);
};
// 切换监控状态
const toggleMonitoring = () => {
    if (isMonitoring.value) {
        startMonitoring();
    } else {
        stopMonitoring();
    }
};
// 停止监控订单变化
const stopMonitoring = () => {
    if (timer.value !== null) {
        clearInterval(timer.value);
        timer.value = null;
    }
    isMonitoring.value = false; // 设置监控状态为 false
};

// 请求接口并检查订单变化
const fetchData = async () => {
    try {
        // 假设你的接口地址为 /api/checkOrder
        // const response = await axios.get(configs.baseUrl + '/workbench/checkOrder');
        const response = await checkOrder()
        const { orderCount, shareCount } = response;

        // 如果 orderCount 或 shareCount 大于 0，则播放音频
        if (orderCount > 0) {
            playAudio(1);
        }
        if (shareCount > 0) {
            playAudio(2);
        }
    } catch (error) {
        console.error('请求失败:', error);
    }
};

// 播放音频
const playAudio = (type: number) => {
    if (type == 1) {
        if (audioPlayer.value) {
            // 检查是否已经有音频元素
            let audio = document.getElementById('audioPlay') as HTMLAudioElement;
            if (!audio) {
                // 动态创建音频元素
                audio = document.createElement('audio');
                audio.id = 'audioPlay';
                audio.src = audioRechargeSrc;
                audio.style.display = 'none';
                document.body.appendChild(audio);
            }
            // 尝试播放音频
            audioPlayer.value.play().catch(error => {
                console.error('音频播放失败:', error);
            });
        }
    }
    if (type == 2) {
        if (audioPlayer2.value) {
            // 检查是否已经有音频元素
            let audio = document.getElementById('audioPlayer2') as HTMLAudioElement;
            if (!audio) {
                // 动态创建音频元素
                audio = document.createElement('audio');
                audio.id = 'audioPlayer2';
                audio.src = audioShareSrc;
                audio.style.display = 'none';
                document.body.appendChild(audio);
            }
            // 尝试播放音频
            audioPlayer2.value.play().catch(error => {
                console.error('音频播放失败:', error);
            });
        }
    }
};

// 组件挂载时启动监控，销毁前停止监控
onMounted(() => {
    startMonitoring();
});

onBeforeUnmount(() => {
    stopMonitoring();
});
</script>

<style lang="scss">
.navbar {
    height: var(--navbar-height);
    @apply flex px-2 bg-body;

    .navbar-item {
        @apply h-full flex justify-center items-center hover:bg-page;
    }
}

.audio-box {
    position: absolute;
    right: 200px;
    top: 9px;
}

/* 自定义开关样式 */
.audio-box .el-switch__core::before {
    content: '停止';
    color: #979797;
    /* 文字颜色 */
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    /* 文字大小 */
}

.audio-box .is-checked .el-switch__core::before {
    content: '启动';
    color: #ffffff;
    /* 文字颜色 */
    left: auto;
    right: 20px;
}
</style>
