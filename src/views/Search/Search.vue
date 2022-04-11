<template>
  <Header></Header>
  <div>
    <!-- 商品分类三级列表 -->
    <TypeNav></TypeNav>
    <div class="main">
      <div class="py-container">
        <!--bread:面包屑，带有x的结构的-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类的面包屑 -->
            <li class="with-x" v-show="searchParams.categoryName" @click="removeCategoryName()">
              {{ searchParams.categoryName }}<i>x</i></li>

            <!--            关键字的面包屑-->
            <li class="with-x" v-show="searchParams.keyword" @click="removeKeyword()">
              {{ searchParams.keyword }}<i>x</i></li>
            <!--            品牌的面包屑-->
            <li class="with-x" v-show="searchParams.trademark" @click="removeBrand()">
              {{ searchParams.trademark.split(":")[1] }}<i>x</i></li>
            <!--            平台的售卖属性值展示-->
            <li class="with-x" v-for="(attrValue,index) in searchParams.props" :key="index" @click="removeAttr(index)">
              {{ attrValue.split(":")[1] }}<i>x</i></li>
          </ul>
        </div>

        <!--selector-->
        <SearchSelector @BrandInfo="brandInfo" @attrInfo="attrInfo"/>
        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序的解构 -->
              <ul class="sui-nav">
<!--                1:综合，2:价格    参数格式默认: "1:desc"-->
<!--                首先这个active的逻辑是，看看order中是否包含 1 来显示-->
                <li @click="changOrder(1)" :class="{active:searchParams.order.includes('1')}">
<!--                  这里的话检测order中是desc还是asc来显示箭头-->
<!--                  判断是否包含1 来选中是否显示箭头-->
                  <a>综合<span v-if="searchParams.order.includes('1')" class="iconfont"
                     :class="{'icon-down':searchParams.order.includes('desc'),'icon-up':searchParams.order.includes('asc')}"></span></a>
                </li>
                <!--              箭头图标是否显示判断当前包含的是desc还是asc-->
                <li @click="changOrder(2)" :class="{active:searchParams.order.includes('2')}">
                  <a>价格<span v-if="searchParams.order.includes('2')" class="iconfont"
                             :class="{'icon-down':searchParams.order.includes('desc'),'icon-up':searchParams.order.includes('asc')}"></span></a>
                </li>


              </ul>
            </div>
          </div>
          <!-- 销售产品列表 -->
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="(good,index) in goodList" :key="good.id">
                <div class="list-wrap">
<!--                  当点击图片的时候跳转到详情页并且把id带上-->

                  <div class="p-img">
                    <!-- 在路由跳转的时候切记别忘记带id（params）参数 -->
                    <router-link :to="`/detail/${good.id}`">
<!--                      <img :src="good.defaultImg" alt="">-->
<!--                      使用懒加载-->
                      <img v-lazy="good.defaultImg" alt="">
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥</em>
                      <i>{{ good.price }}.00</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                        target="_blank"
                        href="item.html"
                        :title=good.title
                    >{{ good.title }}
                    </a
                    >
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                        href="success-cart.html"
                        target="_blank"
                        class="sui-btn btn-bordered btn-danger"
                    >加入购物车</a
                    >
                    <a href="javascript:void(0);" class="sui-btn btn-bordered"
                    >收藏</a
                    >
                  </div>
                </div>
              </li>
            </ul>
          </div>
<!--          分页器：当前的页码，显示多少条数据，总共多少条数据，连续的显示多少个页码-->
            <Pagination @getPageNo="getPageNo" :pageNo="searchParams.pageNo"
                        :pageSize="searchParams.pageSize" :total="total" :continues="5" ></Pagination>
        </div>
      </div>

    </div>

  </div>

  <Footer></Footer>
</template>

<script>
import {useRoute, useRouter} from 'vue-router'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SearchSelector from "@/views/Search/SearchSelector/SearchSelector.vue";
import Pagination from '@/components/Pagination'
import {computed, inject, onMounted, provide, reactive, ref, watch} from "vue";
import {useStore} from "vuex";
//引入EventBus.js  全局组件通信插件
import EventBus from "@/EventBus";
import search from "@/store/search";

export default {
  name: "Search",
  components: {Header, Footer, SearchSelector,Pagination},
  //路由组件可以传递props
  // 路由那边开启props:true，就可以用props接收并且使用但是只能params传递
  // props:['keyword','k'],
  setup(props, context) {
    let route = useRoute();
    let router = useRouter();
    let store = useStore();
    //发送请求需要带参数，可以带的参数以下，
    //当跳到这个页面后，获取路由传递的参数，赋值给searchParams
    let searchParams = reactive({
      //产品相应的id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //产品的名字
      categoryName: "",
      //搜索的关键字
      keyword: "",
      //排序:初始状态应该是综合且降序
      //目前只有综合和价格的升序降序
      //1是综合，2是价格，默认是综合的降序
      order: "1:desc",
      //第几页
      pageNo: 1,
      //每一页展示条数
      pageSize: 10,
      //平台属性的操作
      props: [],
      //品牌
      trademark: "",
    })

    //!!!!!!进来后首先获取路由的参数，赋值，然后才发送请求
    // console.log(route.query,route.params)
    //Object.assign:ES6新增的语法，合并对象
    //第一个参数，第一个接收合并的参数，第二个把参数合并给searchParams，第三个，第四个...
    //比如searchParams中有keyword，route.params也有keyword就会把keyword的参数传输给searchParams
    //在发送请求之前，把接口需要传递参数，进行整理(服务器发送请求之前，把参数整理好，服务器就会返回查询的数据)
    Object.assign(searchParams, route.query, route.params)
    // console.log(searchParams)

    //把这次的请求封装为一次函数，当需要的时候调用即可
    let getData = () => {
      //发送的post请求需要传递参数
      store.dispatch('getSearchList', searchParams)
    }


    //派发Vuex中的请求
    onMounted(() => {
      getData()

    })
    //直接获取vuex search仓库里面的total
    let total = computed(()=>{
      return store.state.search.searList.total
    })
    let goodList = computed(() => {
      //这次使用了getters来获取数据
      return store.getters.goodList
    })

    //在搜索页面监听路由的变化，重新获取数据
    watch(route, (newValue, oldValue) => {
      //每一次请求完成，应该把相应的1、2、3级分类的id置空，让他接受下一次的相应1、2、3
      searchParams.category1Id = '';
      searchParams.category2Id = '';
      searchParams.category3Id = '';
      //再次发请求之前整理带给服务器参数
      Object.assign(searchParams, route.query, route.params)
      getData();

    })

    //删除分类的名字
    let removeCategoryName = () => {
      //把带给服务器的参数置空了，还需要向服务器发送请求
      //带给服务器参数说明可有可无的；如果属性值为空的字符串还会把相应的字段带给服务器
      //但是你把相应的字段变为undefined，当前这个字段不会带给服务器
      searchParams.categoryName = undefined;
      searchParams.category1Id = undefined;
      searchParams.category2Id = undefined;
      searchParams.category3Id = undefined;
      getData();
      //地址栏也需要需改：进行路由跳转(现在的路由跳转只是跳转到自己这里)
      //严谨:本意是删除query，如果路径当中出现params不应该删除，路由跳转的时候应该带着
      router.push({name: "Search"})
    }
    //删除输入框添加上去的面包屑
    let removeKeyword = () => {
      searchParams.keyword = undefined;
      getData();
      //通知Header组件把搜索框的关键字删掉
      EventBus.emit("clear")

      router.push({name: "Search", query: route.query})
    }
    //子组件传递过来的品牌名字
    let brandInfo = (value) => {
      console.log(value)
      //拿到传过来的品牌数据整理参数发请求 需要的参数: "ID:品牌名称"
      searchParams.trademark = `${value.tmId}:${value.tmName}`;
      getData();
    }

    //删除品牌的面包屑
    let removeBrand = () => {
      searchParams.trademark = '';
      //再次发请求获取search模块列表数据进行展示
      getData();
    }

    //收集平台属性地方回调函数
    let attrInfo = (attr, attrValue) => {
      //["属性ID:属性值:属性名"]
      console.log(attr, attrValue)
      //参数格式整理好
      //避免重复使用includes 如果判断是包含，包含返回true
      let props = `${attr.attrId}:${attrValue}:${attr.attrName}`
      if (!searchParams.props.includes(props)) {
        searchParams.props.push(props);
        //再次发送请求
        getData();
      }

    }
    //removeAttr删除售卖的属性
    let removeAttr = (index) => {
      //splice删除的索引值从第几个开始删除，删除几个
      searchParams.props.splice(index, 1);
      getData();
    }

    //综合和价格的升序降序
    let changOrder = (index)=>{
      //如果当前包含 index 只需要更改 desc和asc
      if (searchParams.order.includes(index)){
        //如果包含desc把内容变成asc
        if (searchParams.order.includes('desc')){
          searchParams.order = `${index}:asc`;
          getData();
        }else if (searchParams.order.includes('asc')){
          searchParams.order = `${index}:desc`;
          getData();
        }
        return
      }
      //如果不包含 就把order变成当前的 默认 index:desc 重新发送请求
      if (!searchParams.order.includes(index)){
        searchParams.order = `${index}:desc`;
        getData();
      }
    }

    //点击分页获取数据
    let getPageNo = (index)=>{
      console.log(index)
      if (index === "last"){
        searchParams.pageNo = searchParams.pageNo - 1;
      }else if (index === "next"){
        searchParams.pageNo = searchParams.pageNo + 1;
      }else{
        searchParams.pageNo = index
      }
      getData();
    }


    return {
      route,
      searchParams,
      removeAttr,
      brandInfo,
      attrInfo,
      goodList,
      removeKeyword,
      removeBrand,
      removeCategoryName,
      changOrder,
      total,getPageNo
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }


    }
  }

}

</style>