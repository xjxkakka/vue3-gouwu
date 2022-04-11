import {reqCategoryList, reqGetFloorList} from "@/api";
import {reqGetBannerList} from "@/api";
//home模块的小仓库
const state = {
    //接收API接口传过来的数据
    categoryList: {},
    //轮播图数据
    bannerList:[],
    //floor数据
    floorList:[],
};
const mutations = {
    //通过这里修改state中的categoryList中的数据
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
    },
    GETBANNERLIST(state,bannerList){
        state.bannerList = bannerList;
    },
    GETFLOORLIST(state,floorList){
        state.floorList = floorList
    }
};
//actions中不能直接修改state中的数据，需要通过 context.commit提交mutation 调用mutation中的方法
//actions中的方法都有一个参数context,
//context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
const actions = {
    //通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    //Action 通过 store.dispatch 方法触发：categoryList  这个方法在TypeNav中有使用
    categoryLIST: async (context) => {
        let result = await reqCategoryList();
        //如果发送请求没问题，我们在通过commit提交 mutations中的方法修改state中的数据
        if (result.code === 200) {
            context.commit("CATEGORYLIST", result.data.splice(0, 16))
            // console.log(context)
        }
    },

    //获取轮播图数据
    getBannerList: async (context) => {
        let res = await reqGetBannerList()
        if (res.code === 200) {
            context.commit("GETBANNERLIST",res.data)
        }
    },

    //获取floor数据
    getFloorList : async (context)=>{
        let res = await reqGetFloorList();
        if (res.code === 200){
            context.commit("GETFLOORLIST",res.data)
        }
    }

};
const getters = {};
export default {
    state, mutations, actions, getters
}