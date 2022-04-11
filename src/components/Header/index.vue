<template>
  <!-- 头部 -->
  <header class="header">
    <!-- 头部的第一行 -->
    <div class="top">
      <div class="container">
        <div class="loginList">
          <p>尚品汇欢迎您！</p>
          <!--          没用用户名:未登录-->
          <p v-if="!userName">
            <span>请</span>
            <router-link to="/login">登录</router-link>
            <router-link to="/register" class="register">免费注册</router-link>
          </p>
          <p v-else>
            <span>{{ userName }}</span>
            <a href="#" class="register" @click="logout">退出登录</a>
          </p>
        </div>
        <div class="typeList">
          <router-link to="/center">我的订单</router-link>
          <router-link to="/ShopCart">我的购物车</router-link>
          <a href="###">我的尚品汇</a>
          <a href="###">尚品汇会员</a>
          <a href="###">企业采购</a>
          <a href="###">关注尚品汇</a>
          <a href="###">合作招商</a>
          <a href="###">商家后台</a>
        </div>
      </div>
    </div>
    <!--头部第二行 搜索区域-->
    <div class="bottom">
      <h1 class="logoArea">
        <router-link to="/home" class="logo">
          <img src="./images/logo.png" alt="">
        </router-link>
      </h1>
      <div class="searchArea">
        <form action="###" class="searchForm">
          <input type="text" v-model="keyword" id="autocomplete" class="input-error input-xxlarge"/>
          <button class="sui-btn btn-xlarge btn-danger" type="button" @click="goSearch()">搜索</button>
        </form>
      </div>
    </div>
  </header>
</template>

<script>
import {useRouter, useRoute} from 'vue-router'
import {computed, onMounted, ref, watch} from "vue";
import {useStore} from 'vuex'
import EventBus from "@/EventBus";

export default {
  name: "index",

  setup() {
    let router = useRouter();
    let route = useRoute();
    let store = useStore();
    let keyword = ref("");
    //搜索按钮的回调函数:需要向search路由进行跳转
    let goSearch = () => {
      //路由传参：
      //模板字符串
      // router.push(`/search/${keyword.value}?k=${keyword.value.toUpperCase()}`)
      //通过对象的方式传参
      //注意params需要和name搭配使用，query则没要求

      let location = {name: "Search", params: {keyword: keyword.value || undefined},}
      //如果有query就把query带上一起传递
      location.query = route.query
      router.push(location)

    }
    //当搜索页面删除搜索框的面包屑后，把keyword清空
    EventBus.on('clear', () => {
      keyword.value = '';
    })

    onMounted(() => {
      store.dispatch('getUserInfo')
    })

    //判断是否登录了 vuex中是否有name
    let userName = computed(() => {
      return store.state.user.userInfo.name
    })


    //退出登录
    let logout = () => {
      //退出登录需要做的事情
      //1.需要发请求，通知服务器退出登录【清除一些数据:token】
      //2.清除项目当中的数据【userInfo、token】
      store.dispatch('userLogout')
    }

    return {goSearch, keyword, userName, logout}
  }
}
</script>

<style lang="less" scoped>
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;

          & + a {
            border-left: 1px solid #b3aeae;
          }
        }

      }

    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>