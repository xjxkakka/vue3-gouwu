//对于axios进行二次封装
import axios from "axios";
//1.引入进度条  start:进度条开始 done:进度条结束
import nprogress from 'nprogress'
//2.引入进度条的css样式
import "nprogress/nprogress.css"

//在当前模块引入store
import store from '@/store/detail'
import user from '@/store/user/user'


//1.利用axios对象的方法create，去创建一个axios实例
//2.request就是axios，只不过稍微配置一下
const request = axios.create({
    //配置对象
    //基础路径，发请求的时候，路径当中会出现api
    //到时候那边写的url会自动拼接这里的
    baseURL: "/api",
    //代表请求超过的时间5S
    timeout:5000
});
//请求拦截器:在发送请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
request.interceptors.request.use((config)=>{
    //进度条开始动
    nprogress.start();

    //请求头添加一个字段(userTempId):和后端商量好了
    if (store.state.uuid_token){
        config.headers.userTempId = store.state.uuid_token
    }
    //点击登录后，需要携带token带给服务器，查看仓库是否有token
    if (user.state.token){
        config.headers.token = user.state.token
    }

    //config:配置对象，对象里面有一个属性很重要，headers请求头
    return config;
})
//响应拦截器  有两个参数可以写，成功和失败，可以只写成功的
request.interceptors.response.use((res)=>{
    //进度条结束
    nprogress.done();

    //成功的回调函数:服务器响应数据回来以后，响应拦截器可以检测到，比如处理下返回的结果
    return res.data
},(error => {
    //响应失败的回调函数
    return Promise.reject(new error("failed! 失败！"))
}))

//对外暴露
export default request;