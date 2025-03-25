
import axios from 'axios'
import {
    ElMessage } from 'element-plus'
 console.log(import.meta.env.VITE_API_BASE_URL, 'dawfawfawf');
 
const http = axios.create({
   
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 300 * 1000, // 请求超时时间设置为300秒
  headers: {
    'Content-Type': 'application/json'
  }
})
 
const NETWORK_ERROR = '网络错误，请联系开发人员'
 
/**
 * 请求拦截器
 */
http.interceptors.request.use((req) => {
   
  console.log('请求拦截器 =>', req)
  
  ElMessage.error(NETWORK_ERROR)
  return req;
}, (error) => {
  // ElMessage.error(NETWORK_ERROR)
  return Promise.reject(error);
});
 
/**
 * 响应拦截器
 */
http.interceptors.response.use(function (res) {
   
  console.log('响应拦截器 =>', res)
  // Nprogress.done()
  if (res.status == 200) {
   
    return res.data
  } else {
   
    ElMessage.error((NETWORK_ERROR))
    return Promise.reject(NETWORK_ERROR)
  }
});
 
export default http