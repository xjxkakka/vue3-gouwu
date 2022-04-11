import {reqCartList, reqDeleteCartById, reqUpdateCheckedByid} from "@/api";

const state = {
    cartList: []
};
const mutations = {
    GET_CARTLIST(state, cartList) {
        state.cartList = cartList
    }
};
const actions = {
    //获取购物车列表数据
    async getCartList(context) {
        let result = await reqCartList();
        //测试是否能获取到个人购物车数据
        if (result.code === 200) {
            context.commit('GET_CARTLIST', result.data)
        }
    },
    //删除购物车中的产品
    async deleteCartListBySkuId(context, skuId) {
        let res = await reqDeleteCartById(skuId);
        if (res.code === 200) {
            return 'OK'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //修改购物车某一个产品的选中状态
    async updateCheckedById(context, {skuId, isChecked}) {
        let res = await reqUpdateCheckedByid(skuId, isChecked);
        if (res.code === 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    //删除全部勾选的产品
    deleteAllCheckedCart(context) {
        //context:小仓库,commit[提交mutations修改state] getters[计算属性]  dispatch[派发action]  state[当前仓库数据]
        //获取购物车中全部的产品(是一个数组)
        let PromiseAll = [];
        //遍历仓库中的数据
        context.getters.cartList.cartInfoList.forEach(item => {
            //三元运算符 写法
            // let promise = item.isChecked==1?context.dispatch('deleteCartListBySkuId',item.skuId):'';
            //isChecked==1,代表勾上了,然后发请求传当前id值过去删除掉
            if (item.isChecked == 1) {
                //返回的promise对象
                let promise = context.dispatch('deleteCartListBySkuId', item.skuId);
                //然后添加到这个数组中,在使用Promise.all来判断是否全部返回成功
                PromiseAll.push(promise)
            }
        })
        //判断删除后返回的Promise是否全部都成功,有一个失败都会返回失败
        return Promise.all(PromiseAll);
    },

    //全选,反选
    updateAllCartChecked(context, isChecked) {
        let PromiseAll = [];
        //他这里会遍历仓库的每一条数据
        context.state.cartList[0].cartInfoList.forEach(item =>{
        //调用 修改购物车某一个产品的选中状态方法,传入全选的状态值 1 or 0
            //遍历全部把当前的商品id传过去和,全选的状态值,通过这个方法来更新状态
            //有多少条数据发多少次请求等于
            let promise = context.dispatch('updateCheckedById', {
                //传入两个值,一个当前商品的id值
                skuId: item.skuId,
                //全选的状态值
                isChecked: isChecked
            });
            PromiseAll.push(promise)
        })
        //最终返回结果
        return Promise.all(PromiseAll);
    }
};
const getters = {
    cartList(state){
        return state.cartList[0] || {};
    }
};
export default {state, mutations, actions, getters}