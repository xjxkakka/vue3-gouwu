//detail模块的小仓库
import {reqAddOrUpdateShopCart, reqGoodsInfo} from "@/api";
import {getUUID} from "@/utils/uuid_token";
//封装游戏身份模块 uuid --->生成一个随机字符串(不能在变了)

const state={
        goodsInfo:{},
    //游客临时身份证
    uuid_token:getUUID()

};
const mutations={
    //通过这里修改state中的数据
    GET_GOODSINFO(state,goodsInfo){
        state.goodsInfo = goodsInfo;
    }

};
const actions = {
    async getGoodsInfo(context,skuId){
        let res = await reqGoodsInfo(skuId);
        if (res.code === 200){
            context.commit('GET_GOODSINFO',res.data)
        }
    },
    //将产品添加到购物中
    async addOrUpdateShopCart(context,{skuId,skuNum}){
        //加入购物车,返回解构
        //加入购物车以后(发请求)，前台将参数带给服务器
        //服务器血入数据成功，并没有返回其他的数据，只是返回code=200,代表这次操作成功
        //因为服务器没有返回其余数据，因此我们不需要三连环存储数据
        let res = await reqAddOrUpdateShopCart(skuId,skuNum)
        //代表加入购物车成功
        if (res.code === 200){
            return 'ok';
        }else{
            //代表加入购物车失败
            return  Promise.reject(new Error('fail'))
        }
    }
};
//计算属性，在项目当中，为了简化数据而生
//项目当中getters主要的作用是:简化仓库的数据（简化数据而生，简化了组件，复杂了这里）
//可以把我们将来在组件当中需要的数据简化一下，【将来组件在获取数据的时候就方便了】
const getters = {
    //路径导航简化的数据
    categoryView(state) {
        //这里一定要写不然会报错，因为计算需要时间，至少要返回一个空对象
        return state.goodsInfo.categoryView ||{};
    },
    //简化产品信息的数据
    skuInfo(state) {
        return state.goodsInfo.skuInfo || {};
    },
    //产品售卖属性的简化
    spuSaleAttrList(state){
        return state.goodsInfo.spuSaleAttrList || [];
    }
};
export default {
    state,mutations,actions,getters
}