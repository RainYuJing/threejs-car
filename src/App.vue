<script setup lang="ts">
import { onMounted, getCurrentInstance, ref } from 'vue'
import {
  qiankunWindow
} from 'vite-plugin-qiankun/dist/helper'
const instance = getCurrentInstance()
const appName = instance?.appContext.config.globalProperties?.$appName
onMounted(() => {
  if(qiankunWindow.__POWERED_BY_QIANKUN__) {
    const { onGlobalStateChange } = window[`__QIANKUN_PROPS__${appName}`] as Record<string, any>;
    onGlobalStateChange((state: Record<string, any>) => {
      appsState.value = state
      appState.value = state[appName]
    });
  
    setTimeout(() => {
      changeAppState()
    }, 10000);
  }
  
})
const appsState = ref<Record<string, any>>({})
const appState = ref<Record<string, any>>({})
function changeAppState() {
  const { setGlobalState } = window[`__QIANKUN_PROPS__${appName}`] as Record<string, any>;
  // console.log(setGlobalState, appName, 'sub-app-vue3');
  
  appState.value.loading = false
  setGlobalState({
    ...appsState.value,
    [appName]: {
      ...appState.value
    }
  })
}


</script>
<template>
  <router-view></router-view>
</template>

<style >
#__qiankun_microapp_wrapper_for_threejs_car__{
  width: 100%;
  height: 100%;
}
</style>
