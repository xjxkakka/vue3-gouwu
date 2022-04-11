<template>
  <div class="order-right">
    <!--订单内容-->
    <div class="order-content">
      <div class="title">
        <h3>我的订单</h3>
      </div>
      <div class="chosetype">
        <table>
          <thead>
          <tr>
            <th width="29%">商品</th>
            <th width="31%">订单详情</th>
            <th width="13%">收货人</th>
            <th>金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
          </thead>
        </table>
      </div>
      <div class="orders">

        <table class="order-item" v-for="(order,index) in orderInfo.myOrder.records" :key="order.id">
          <thead>
          <tr>
            <th colspan="5">
        <span class="ordertitle">{{order.createTime}}　订单编号：{{order.outTradeNo}} <span
            class="pull-right delete"><img
            src="../images/delete.png"></span></span>
            </th>
          </tr>
          </thead>
          <tbody>
<!--          这里遍历一共有多少个产品 orderDetailList订单详情里面有多少个产品-->
<!--            product=产品-->
          <tr v-for="(product,index) in order.orderDetailList" :key="product.id">
            <td width="60%">
              <div class="typographic">
                <img :src='product.imgUrl' style="height: 100px;width:100px">
                <a href="#" class="block-text">{{product.skuName}}</a>
                <span>x{{product.skuNum}}</span>
                <a href="#" class="service">售后申请</a>
              </div>
            </td>
<!--            rowspan不要写死根据上面有多少产品写多少长度-->
<!--            然后通过 v-if='index===0'来显示可以多个产品只显示一个姓名金额等等-->
            <td :rowspan="order.orderDetailList.length" v-if="index===0" width="8%" class="center">{{order.consignee}}</td>
            <td :rowspan="order.orderDetailList.length" v-if="index===0" width="13%" class="center">
              <ul class="unstyled">
                <li>总金额¥{{order.totalAmount}}</li>
                <li>在线支付</li>

              </ul>
            </td>
            <td :rowspan="order.orderDetailList.length" v-if="index===0" width="8%" class="center">
              <a href="#" class="btn">{{order.orderStatusName}} </a>
            </td>
            <td :rowspan="order.orderDetailList.length" v-if="index===0" width="13%" class="center">
              <ul class="unstyled">
                <li>
                  <a href="mycomment.html" target="_blank">评价|晒单</a>
                </li>
              </ul>
            </td>
          </tr>
          </tbody>
        </table>

      </div>
      <div class="choose-order">
        <!--          分页器：当前的页码，显示多少条数据，总共多少条数据，连续的显示多少个页码-->
        <Pagination @getPageNo="getPageNo" :pageNo="orderInfo.page"
                    :pageSize="orderInfo.limit" :total="orderInfo.myOrder.total" :continues="5" ></Pagination>
      </div>
    </div>
    <!--猜你喜欢-->
    <div class="like">
      <h4 class="kt">猜你喜欢</h4>
      <ul class="like-list">
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike01.png" />
          </div>
          <div class="attr">
            <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
          </div>
          <div class="price">
            <em>¥</em>
            <i>3699.00</i>
          </div>
          <div class="commit">已有6人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike02.png" />
          </div>
          <div class="attr">
            Apple苹果iPhone 6s/6s Plus 16G 64G 128G
          </div>
          <div class="price">
            <em>¥</em>
            <i>4388.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike03.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
          </div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
        <li class="likeItem">
          <div class="p-img">
            <img src="../images/itemlike04.png" />
          </div>
          <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本
          </div>
          <div class="price">
            <em>¥</em>
            <i>4088.00</i>
          </div>
          <div class="commit">已有700人评价
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>

import {onMounted, reactive} from "vue";
import {reqMyOrderList} from "@/api";
//引入分页组件
import Pagination from '@/components/Pagination'
export default {
  name: "index",
  components:{Pagination},
  setup(){
    //订单中心的数据
    let orderInfo = reactive({
      //初始化参数
      //当前第几页
      page:1,
      //每一页展示数据个数
      limit:5,
      //存储我的订单数据
      myOrder:{}
    })
    onMounted(()=>{
      getData()
    })
    let getData=()=>{
      //发请求获取订单中心的数据,需要传入两个参数，(当前第几页，每一页展示数据的个数)
      reqMyOrderList(orderInfo.page,orderInfo.limit).then(res=>{
        if (res.code===200){
          console.log(res)
          orderInfo.myOrder = res.data
        }
      })
    }

    //分页器事件  传递过来的参数是当前点击的第几页
    let getPageNo = (page)=>{
        orderInfo.page = page;
        getData();
    }
    return{orderInfo,getPageNo}
  }

}
</script>

<style scoped>

</style>