import {reqAddressInfo, reqOrderInfo} from "@/api";

const state = {
    address:[],
    orderInfo:{}
};
const mutations = {
    GET_USERADDRESS(state,address){
        state.address = address
    },
    GET_ORDERINFO(state,orderInfo){
        state.orderInfo = orderInfo
    }
};
const actions = {
    //获取用户地址信息
    async getUserAddress(context){
      let result =  await reqAddressInfo();
        if (result.code===200){
            context.commit('GET_USERADDRESS',result.data)
            // console.log(result.data)
            return 'ok';
        }else{
            return Promise.reject(new Error(result.message))
        }
    },
    //获取商品清单数据
    async getOrderInfo(context){
        let result = await reqOrderInfo();
        if (result.code===200){
            context.commit('GET_ORDERINFO',result.data)
        }
    }
};
const getters = {};
export default {state, mutations, actions, getters}