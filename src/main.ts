import {
  createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from './router/index'
import store from './store/index'
// 引入HTTP请求工具并配置为全局方法
import axios from 'axios'
import UserManage_Api from '@/api/UserManage/index'
import {
  renderWithQiankun,
  qiankunWindow,
  QiankunProps
} from 'vite-plugin-qiankun/dist/helper'

// 引入 ElementPlus 插件(npm i element-plus)
import ElementPlusPlugin from '@/plugins/element-plus'

// 全局注册 ElementPlus 图标组件(npm install @element-plus/icons-vue)
import * as ElementPlusIcons from '@element-plus/icons-vue'

let app: any
const render = (props?: any) => {
  app = createApp(App)
  if(props) {
    app.config.globalProperties.$appName = props.appName
  }
  for(const [key, component] of Object.entries(ElementPlusIcons)) {
    app.component(key, component)
  }
  app.config.globalProperties.$http = {
    ...UserManage_Api,
  }
  app.config.globalProperties.$axios = axios
  console.log(props, 'props');
  
  app
    .use(store)
    .use(router)
    .use(ElementPlusPlugin)
    .mount(props?.container ? props.container.querySelector('#app') : '#app')
}

const initQianKun = () => {
  renderWithQiankun({
    mount(props) {
      // 挂载到 window 对象
      window[`__QIANKUN_PROPS__${props.appName}`] = props
    
      // 子应用更新全局状态
      // props.setGlobalState({ theme: 'dark' });
      try {
      // 主动通知主应用（关键！）
      if (props.onMountCompleted) {
        props.onMountCompleted()
      }
      console.log('mount');
      render(props)
      } catch (err) {
        if (props.onMountFailed) {
          props.onMountFailed(err)
        }
        throw err
      }
    
      
    },
    bootstrap() { 
      console.log('bootstrap');
      
    },
    unmount() {
      app.unmount()
      app = null;
      console.log('[子应用] unmount')
    },
    update: function (props: QiankunProps): void | Promise<void> {
      throw new Error('Function not implemented.')
    }
  })
}
qiankunWindow.__POWERED_BY_QIANKUN__ ? initQianKun() : render()
console.log(qiankunWindow.__POWERED_BY_QIANKUN__, '__POWERED_BY_QIANKUN__');

// const app = createApp(App)




// app
// .use(store)
// .use(router)
// .use(ElementPlusPlugin)
// .mount('#app')