import {
  defineStore } from 'pinia'

/**
* 爱老虎油状态管理仓库
*/
export const info = defineStore({
 
id: 'info', // ID必填且唯一
state: () => {
 
  return {
 
    xxx: 'Hello,World!',
    yyy: 520,
  }
},
getters: {
 

},
actions: {
 
  setXxx(xxx: string) {
 
    this.xxx = xxx
  },
}
})