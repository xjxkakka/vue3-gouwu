import {reqGetCode, reqLogout, reqUserInfo, reqUserLogin, reqUserRegister} from "@/api";

const state = {
    token:localStorage.getItem('TOKEN'),
    userInfo:{}
};
const mutations = {
    USERLOGIN(state,token){
        state.token = token
    },
    GET_USETINFO(state,userInfo){
        state.userInfo = userInfo
    },
    //请求本地数据
    CLEAR(state){
        state.token='';
        state.userInfo={};
        //本地存储清空 TOKEN
        localStorage.removeItem('TOKEN')
    }
};
const actions = {
    //获取验证码
    async getCode(context, phone) {
        let res = await reqGetCode(phone);
        if (res.code === 200) {
            return res.data
        } else {
            // return Promise.reject(new Error(res.message))
        }
    },
    //注册
    async userRegister(context, user) {
        let res = await reqUserRegister(user);
        if (res.code === 200) {
            return 'ok'
        } else {
            console.log(res)
            return Promise.reject(new Error(res.message))
        }
    },
    //1.登录，判断账号是否正确，成功后返回token
    async userLogin(context, user) {
        let res = await reqUserLogin(user);
        //服务器下发token，用户唯一标识符(uuid)
        //将来经常通过带token找服务器要用户信息进行展示
        if (res.code === 200) {
            // console.log(res)
            //默认token上面是空的就算写了  token:localStorage.getItem('TOKEN') 此时是空的，
            //state不是持久化的但是我们写了本地存储 刷新后他就会等于本地存储的这个
            context.commit('USERLOGIN', res.data.token)
            //持久化存储
            localStorage.setItem('TOKEN',res.data.token)
            return 'ok'
        } else {
            console.log(res)
            return Promise.reject(new Error(res.message))
        }
    },
    //2.点击登录后跳转到首页，在首页发送请求获取用户信息,记得需要在请求拦截器中请求头设置token
    //这段函数只有在请求拦截器中有带token才会返回用户数据，如果没有token返回的code不是200
    async getUserInfo(context){
        let result = await reqUserInfo();
        // console.log(result)
        if (result.code===200){
            context.commit('GET_USETINFO',result.data)
            return 'ok'
        }
        //不要写else了，如果没登录在组件中会报错，应该挂载完就会发起请求
    },

    //退出登录
    async userLogout(context){
        //只是向服务器发起一次请求，通知服务器清楚token
       let result =  await reqLogout();
       //action里面不能操作state，mutations修改state
            if (result.code===200){
                context.commit('CLEAR')
            }
    }

};
const getters = {};
export default {state, mutations, actions, getters}
