//search模块的小仓库
import {reqGetSearchInfo} from "@/api";

const state={
    searList:{}
};
const mutations={
    //通过这里修改state中的categoryList中的数据
    GETSEARCHLIST(state,searList){
        state.searList = searList
    }
};
const actions = {
    //不传的话默认为{}
    async getSearchList(context,params={}){
        //当前这个reqGetSearchInfo这个函数在调用获取服务器的时候，至少传递一个参数(空对象)
        let res = await reqGetSearchInfo(params);
        if (res.code === 200){
            context.commit('GETSEARCHLIST',res.data)
        }
    }
};
//计算属性，在项目当中，为了简化数据而生
//项目当中getters主要的作用是:简化仓库的数据（简化数据而生，简化了组件，复杂了这里）
//可以把我们将来在组件当中需要的数据简化一下，【将来组件在获取数据的时候就方便了】
const getters = {
    //当前形参state,相当于当前仓库中的state，并非大仓库中的state
    //加入网络不给力|没有网state.searchList.goodsList返回的是undefined
    //计算新的属性的属性值至少给人家来一个数组
    goodList(state){
       return state.searList.goodsList || []
    },
    trademarkList(state){
        return state.searList.trademarkList;
    },
    attrsList(state) {
        return state.searList.attrsList;
    }
};
export default {
    state,mutations,actions,getters
}