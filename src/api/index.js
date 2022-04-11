//当前这个模块:API进行统一管理
import request from "@/api/request";

//三级联动接口
// /api/product/getBaseCategoryList get 无参数

//发送请求:axios返回结果Promise对象
export const reqCategoryList = () => {
    return request({url: "/product/getBaseCategoryList", method: "get"})
}
//发送请求:search中的数据  地址:/api/list 请求方式:post 参数:需要带参
//当前这个接口，给服务器传递参数params，至少是一个空对象
export const reqGetSearchInfo = (params) => {
    return request({
        url: '/list',
        method: 'post',
        data: params
    })
}
//发送请求获取详情页的数据  URL:/api/item/{skuId} 请求方式get
export const reqGoodsInfo = (skuId) => request({url: `/item/${skuId}`, method: 'get'})

//将产品添加到购物车中，(获取更新某一个产品的个数)
// /api/cart/addToCart/{skuId}/{skuNum} 请求方式post
export const reqAddOrUpdateShopCart = (skuId, skuNum) => request({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post'
})

//获取购物车列表数据接口
// URL:/api/cart/cartList method:get
export const reqCartList = () => request({url: '/cart/cartList', method: 'get'})

//删除购物产品的接口
//RUL:/api/cart/deleteCart/{skuId}  method:DETELE
export const reqDeleteCartById = (skuId) => request({url: `/cart/deleteCart/${skuId}`, method: 'delete'})

//修改商品的选中状态
// URL:/api/cart/checkCart/${skuId}/{isChecked}     method:get
export const reqUpdateCheckedByid = (skuId, isChecked) => request({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get'
})

//获取验证码
//URL:/api/userInfo/passport/sendCode/{phone} method:get
export const reqGetCode = (phone) => request({url: `/user/passport/sendCode/${phone}`, method: 'get'})
//注册
//url:/api/userInfo/passport/register   method:post   带参(phone,code,password)
export const reqUserRegister = (data) => request({url: '/user/passport/register', data, method:'post'})
//登录
// URL:/api/user/passport/login     method:post     参数:phone password
export const reqUserLogin = (data)=> request({url:'/user/passport/login',data,method:'post'})
//获取用户信息【需要带着用户的token向服务器要用户信息】
// URL:/api/user/passport/auth/getUserInfo  method:get
export const reqUserInfo = () =>request({url:'/user/passport/auth/getUserInfo',method:'get'})
//退出登录
// URL: /api/user/passport/logout   get
export const reqLogout = ()=> request({url:'/user/passport/logout',method:'get'})

//获取用户地址信息
// URL:/api/user/userAddress/auth/findUserAddressList   method;get
export const reqAddressInfo =()=>request({url:'/user/userAddress/auth/findUserAddressList',method:'get'})
//获取商品清单
// URL:/api/order/auth/trade    method:get
export const reqOrderInfo =()=>request({url:'/order/auth/trade',method:'get'})

//提价订单的接口
// URL:/api/order/auth/submitOrder?tradeNo={tradeNo}    method:post
//这个接口需要传递7个参数，一个以路由参数传过去，还有六个以data传过去
export const reqSubmitOrder = (tradeNo,data)=> request({url:`/order/auth/submitOrder?tradeNo=${tradeNo}`,method:'post',data})

//获取支付信息
// URL:/api/payment/weixin/createNative/{orderId}   method:get
export const reqPayInfo = (orderId) => request({url:`/payment/weixin/createNative/${orderId}`,method:'get'})

//获取支付订单状态
// URL:/api/payment/weixin/queryPayStatus/{orderId}    method:get
export const reqPayStatus = (orderId) =>request({url:`/payment/weixin/queryPayStatus/${orderId}`,method:'get'})

//获取个人中心的数据
// URL:/api/order/auth/{page}/{limit}   method:get
export const reqMyOrderList =(page,limit)=>request({url:`/order/auth/${page}/${limit}`,method:'get'})

//mock的使用
import mockRequest from './mockAjax'
//获取banner(Home首页轮播接口)
export const reqGetBannerList = () => {
    return mockRequest({url: '/banner', method: 'get'})
}

//获取floor 数据
export const reqGetFloorList = () => {
    return mockRequest.get('/floor')
}