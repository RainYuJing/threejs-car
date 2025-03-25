import {
  defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import qiankun from 'vite-plugin-qiankun'

/**
* 详情见 vitejs 文档：https://vitejs.dev/config/
*/
console.log(process.env.NODE_ENV, 'process.env.NODE_ENV');

export default defineConfig({
 
plugins: [
  vue(),
  qiankun('threejs-car', {
    useDevMode: true
  })
],
base: process.env.NODE_ENV === 'production' ? '/threejs-car/' : '/', // 配置相对地址或绝对地址，此处应为绝对地址，若将 Web 部署到 Nginx 所在的目录为 nginx-1.17.8/html/xxx ，则这个 base 的值就为 /xxx/
build: {
  outDir: 'dist',  // 确保输出到 dist 目录
  assetsDir: 'assets',
},
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
    assets: resolve(__dirname, './src/assets'),
    public: resolve(__dirname, './public'),
  }
},
server: {
 
  host: 'localhost', // 主机
  port: 3004, // 端口
  cors: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  proxy: {
 
    // 项目 v1 的服务端接口地址
    '/api': {  // 代理前缀
      target: 'http://localhost:3003',  // 后端真实地址
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '') // 移除代理前缀
    },

    // 项目 v2 的服务端接口地址
    '/v2/api': {
 
      target: 'http://127.0.0.1:8092/',
      changeOrigin: true,
      secure: false,
      ws: true
    },

    // 项目 v3 的服务端接口地址
    '/v3/api': {
 
      target: 'http://127.0.0.1:8093/',
      changeOrigin: true,
      secure: false,
      ws: true
    },

    // // 默认服务端接口地址
    // '/': {
 
    //   target: 'http://127.0.0.1:8090/',
    //   changeOrigin: true,
    //   secure: false,
    //   ws: false
    // }
  }
}
})