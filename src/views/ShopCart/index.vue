<template>
  <Header></Header>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <!--        这里拿到的数据有点恶心人了-->
        <ul class="cart-list" v-for="(cart,index) in cartInfoList" :key="cart.id">
          <li class="cart-list-con1">
            <input
                type="checkbox"
                name="chk_list"
                :checked="cart.isChecked===1"
                @change="updateChecked($event,cart)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="cart.imgUrl"/>
            <div class="item-msg">{{ cart.skuName }}</div>
          </li>
          <li class="cart-list-con4">
            <span class="price">{{ cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
                href="javascript:void(0)"
                class="mins"
                @click="handler('minus',-1,cart)"
            >-</a>
            <input
                autocomplete="off"
                type="text"
                minnum="1"
                class="itxt"
                :value="cart.skuNum"
                @change="handler('change',$event.target.value,cart)"
            />
            <a
                href="javascript:void(0)"
                class="plus"
                @click="handler('add',1,cart)">+</a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ cart.skuNum * cart.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a class="sindelet" @click="deleteCartById(cart)">删除</a>
            <br/>
            <a href="#none">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
            class="chooseAll"
            type="checkbox"
            :checked="isAllCheck&&cartInfoList.length>0"
            @change="updateAllCartChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a @click="deleteAllCheckedCart">删除选中的商品</a>
        <a>移到我的关注</a>
        <a>清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ totalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
  <Footer></Footer>
</template>
<script>

import {computed, onMounted} from "vue";
import {useStore} from 'vuex';
import Header from '@/components/Header'
import Footer from '@/components/Footer'
//1.引入 lodash 按需引入的
import throttle from 'lodash/throttle';

export default {
  name: "ShopCart",
  components: {Header, Footer},
  setup() {
    let store = useStore();
    onMounted(() => {
      getData();
    })
    let getData = () => {
      //获取个人购物车
      store.dispatch('getCartList')
    }

    //获取仓库中购物车的数据
    let cartInfoList = computed(() => {
      return store.getters.cartList.cartInfoList || [];
    })
    //计算购买产品的总价
    let totalPrice = computed(() => {
      let sum = 0;
      cartInfoList.value.forEach(item => {
        if (item.isChecked===1){
          sum += item.skuNum * item.skuPrice;
        }
      })
      return sum;
    })

    //全选操作:判断底部复选框是否勾选【全部产品都选中，采勾选】   every这里搞定了如果全部勾上后自动把全选勾上
    let isAllCheck = computed(() => {
      //every的效果，返回 true和false，只有全部为true才会返回true
      return cartInfoList.value.every(item => item.isChecked === 1)
    })

    // handler:throttle(function (){},50)
    // let handler = throttle(function (){},50)
    //修改某一个产品的个数
    let handler = throttle(async function (type, num, cart) {
      //type:为了区别这三个元素
      //num: +变化量(1)    -变化量(-1)    input最终的个数(并不是变化量)
      //cart:哪一个产品【身上有id】
      // 服务器的接口需要传的值是 商品的id，和 需要修改的数量
      //添加操作
      if (type.includes('add')) {
        //禁止超过200数量
        if (cart.skuNum >= 200) return
      }
      //减少数量操作规范，禁止少于1
      if (type.includes('minus')) {
        //禁止少于1
        if (cart.skuNum <= 1) return
      }
      if (type.includes('change')) {
        if (isNaN(num) || num < 1 || num > 200) {
          //这里写0的原因，因为传数据过去是后，后台是 原值 + num ，或者原址 - num
          //出现了NaN代表出现非数字的东西就会显示NaN，传0过去代表数据不变
          num = 0;
        } else {
          //parseInt出现小数点默认抹掉,带给服务器变化的量 用户输入进来的 -  产品起始个数
          //num = 新50 - 旧40 num=10 传的10过去
          //num = 新30 - 旧40 num=-10 传的-10过去  就会旧-num
          num = parseInt(num) - cart.skuNum
        }
      }

      //派发action   这里需要使用await，等await代码执行完了才会执行后面的操作，不然数据跟不上
      try {
        await store.dispatch('addOrUpdateShopCart', {skuId: cart.skuId, skuNum: num})
        getData();
      } catch (error) {
        alert(error)
      }
    }, 600)

    //删除购物车中的产品
    let deleteCartById = async (cart) => {
      //发送vuex请求删除
      try {
        await store.dispatch('deleteCartListBySkuId', cart.skuId)
        getData();
      } catch (error) {
        alert(error.message)
      }
    }

    //修改某个产品的勾选状态
    let updateChecked = async (event, cart) => {
      try {
        //查看勾选状态   event.target.checked返回true或false
        // console.log(event.target.checked);
        //true代表1 false 代表 0
        let isChecked = event.target.checked ? 1 : 0;

        await store.dispatch('updateCheckedById', {skuId: cart.skuId, isChecked: isChecked})
        getData();
      } catch (error) {
        alert(error.message)
      }
    }

    //删除所有选中的产品
    let deleteAllCheckedCart = async () => {
      try {
        //调用action方法
        await store.dispatch('deleteAllCheckedCart')
        //当上面方法执行完后重新获取数据
        getData();
      } catch (error) {
        alert(error)
      }

    }

    //全选,反选
    let updateAllCartChecked = async (event) => {
      try {
        let isChecked = event.target.checked ? 1 : 0;
        //派发action
        await store.dispatch('updateAllCartChecked', isChecked)
        getData();
      } catch (error) {
        alert(error)
      }
    }


    return {
      getData,
      deleteAllCheckedCart,
      updateAllCartChecked,
      deleteCartById,
      updateChecked,
      cartInfoList,
      totalPrice,
      isAllCheck,
      handler
    }
  }

};
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 17%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 10%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 13%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: "Microsoft YaHei";
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
