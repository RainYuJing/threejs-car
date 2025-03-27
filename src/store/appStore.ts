import { defineStore } from 'pinia';

export const useAppStore = defineStore('appStore', {
  state: () => {
    return {
      appInfo: {}
    }
  },
  actions: {
    changeAppInfo(data: Record<string, any>) {
      this.appInfo = data
    },
    changeKeyAppInfo(key: string, value: any) {
      this.appInfo[key] = value
    }
    
  },
  getters: {
    getAppInfo: (state) => state.appInfo,
  }
})
