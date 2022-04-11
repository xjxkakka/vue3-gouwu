<template>

  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <h2 class="all" >全部商品分类</h2>
      <div id="tips"  @mouseenter="enterShow" ></div>
      <nav class="nav" >
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
      <!--      当来到search 页面的时候默认不展示-->
      <!--      过渡动画-->

      <transition name="sort" @mouseleave="leaveShow">

        <div class="sort" v-show="show">
          <!--        利用时间委派+编程式导航实现路由的跳转与传递参数-->
          <div class="all-sort-list2" @click="goSearch">
            <div class="item" v-for="(c1,index) in list.categoryList" :key="c1.categoryId">
              <h3>
                <!--              区分一级二级三级，在写一个data自定义-->
                <a :data-categoryName="c1.categoryName" :data-category1Id="c1.categoryId">{{ c1.categoryName }}</a>
              </h3>
              <div class="item-list clearfix">
                <div class="subitem" v-for="(c2,index) in c1.categoryChild" :key="c2.categoryId">
                  <dl class="fore">
                    <dt>
                      <a :data-categoryName="c2.categoryName" :data-category2Id="c2.categoryId">{{
                          c2.categoryName
                        }}</a>
                    </dt>
                    <dd>
                      <em v-for="(c3,index) in c2.categoryChild" :key="c3.categoryId">
                        <a :data-categoryName="c3.categoryName"
                           :data-category3Id="c3.categoryId">{{ c3.categoryName }}</a>
                      </em>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
//引入vuex
import {useStore} from 'vuex'
import {useRouter, useRoute} from 'vue-router'
import {onMounted, computed, reactive, ref, nextTick} from "vue";

export default {
  name: "TypeNav",
  setup() {
    let store = useStore();
    let router = useRouter();
    let route = useRoute();
    onMounted(() => {
      //执行 actions中的方法  Action 通过 store.dispatch 方法触发：
      //为了优化性能，写在这里 来回切换会发送多次请求，所以写去了main.js中，只执行一次，数据就存储到了仓库中
      // store.dispatch("categoryLIST")
    })

    let list = computed(() => {
      return store.state.home
    })

    //进行路由跳转，为什么这样写呢，因为直接写for里面会创建很多个函数出来，为了性能优化
    let goSearch = (event) => {
      //最好的解决方案:编程式导航 + 事件委派
      //存在一些问题:事件委派，是把全部的子节点【h3,dt,dl,em】
      //点击a标签的时候，才会进行路由跳转【怎么能确定点击的一定是a标签】
      //存在另外一个问题:即使你能确定点击的是a标签，如何区别是一级、二级、三级分类的标签呢

      //第一个问题:把子节点当中a标签，我加上自定义属性data-categoryName,其余的子节点是没有的
      //let element = event.target; 获取当前点击元素信息
      let element = event.target;
      //获取到当前触发这个事件的节点【h3、a、dt、dl】,需要带有data-categoryname这样节点的【一定是a标签】
      let {categoryname, category1id, category2id, category3id} = element.dataset
      // console.log(categoryname,category1id,category2id,category3id)
      console.log(element)
      //如果标签身上有categoryname就一定是a标签，不是的话会返回undefined
      //如果有自定义的categoryname就继续执行
      if (categoryname) {
        //整理路由跳转的参数
        let location = {name: "Search"}
        //动态添加query  目前已知categoryname 先添加 categoryname
        let query = {categoryName: categoryname}
        //一级分类、二级分类、三级分类的a标签
        if (category1id) {
          //如果要添加到query这个对象中 直接 query.就能添加
          query.category1Id = category1id
        } else if (category2id) {
          query.category2Id = category2id
        } else if (category3id) {
          query.category3Id = category3id
        }
        //判断:如果路由跳转的时候，带有params参数，需要一起带过去
        //常见场景，一款奶粉用户搜索后，下面有选项 2段，用户点击后 需要把奶粉加2段一起传递

        location.params = route.params
        //整理query参数，添加到location，然后跳转
        location.query = query;
        //路由跳转
        router.push(location)


      }
    }

    //当进入到search页面的时候默认不展示列表
    let show = ref(true)
    //首先判断当前路由 是不是Search
    if (route.path.indexOf("/search") !== -1) {
      show.value = false;
    } else if (route.path.indexOf("/detail") !== -1) {
      show.value = false;
    }

    //判断有没出现/search 这里如果直接搜索会有bug 要想处理就换下面的这个代码
    // console.log(route.path.indexOf("/search"))
    let enterShow = () => {
      if (route.path.indexOf("/search") !== -1) {
        show.value = true;
      } else if (route.path.indexOf("/detail") !== -1) {
        show.value = true;
      }
    }
    let leaveShow = () => {
      if (route.path.indexOf("/search") !== -1) {
        show.value = false;
      } else if (route.path.indexOf("/detail") !== -1) {
        show.value = false;
      }
    }


    return {list, show, goSearch, enterShow, leaveShow}
  }
}
</script>

<style scoped lang="less">
.type-nav {
  border-bottom: 2px solid #e1251b;

  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 45px;
      width: 210px;
      height: 461px;
      position: absolute;
      background: #fafafa;
      z-index: 999;

      animation: mymove .5s linear;

      .all-sort-list2 {
        .item {
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;

            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 0;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }
            //这里的作用主要是碰到item就是一级菜单，二级菜单就会显示
          &:hover {
            .item-list {
              display: block;
            }
          }
        }
      }
    }
  }

  //过渡动画的样式
  //过渡动画开始状态(进入)
  .sort-enter {
    height: 0;

  }

  //过渡动画结束状态(进入)
  .sort-enter-to {
    height: 461px;

  }

  //自定义动画时间、速率
  .sort-enter-active {
    transition: all .5s linear;
  }
}

@keyframes mymove {
  from {
    height: 0;
  }
  to {
    height: 461px;
  }
}
#tips{
  position: absolute;
  width: 210px;
  height: 45px;

  top: 0;
  left: 0;
}
</style>