import http from '@/utils/requestUtil'
 
export default {
   
  /**
   * 根据用户ID查询用户信息
   * 请服务端先准备好此接口：http://localhost:8080/v1/api/getUserById?userId=10001
   */
  getUserById(userId: any) {
   
    return http.get(`/api/getUserById?userId=${
     userId}`)
  },
 
  /**
   * 保存用户信息
   */
  saveUser(data: any) {
   
    return http.post(
      '/v1/api/saveUser',
      data,
      {
   
        headers: {
   
          'Content-Type': 'application/json'
        },
      }
    )
  },
}