import {v4 as uuidv4} from 'uuid';
//要生成一个随机字符串，且每次执行不能发生变化，游客身份证持久存储
export const getUUID = ()=>{
    //先从本地存储获取iid(看一下本地存储里面是否有)
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    //如果没有则创建一个，只会执行一次
    if (!uuid_token){
        //生成游客临时身份
        uuid_token = uuidv4();
        //然后本地存储一次
        localStorage.setItem("UUIDTOKEN",uuid_token)
    }
    return uuid_token;
}
//在发请求数据中不能带这个参数，所以去请求头里面设置带，请求头名字需要和后端协调