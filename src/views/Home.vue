<template>
  <div class="home">
    <Header></Header>
    <router-view></router-view>
    <TypeNav></TypeNav>
    <ListContainer></ListContainer>
    <Recommend></Recommend>
    <Rank></Rank>
    <Like></Like>
<!--    v-for可以在组件上写，-->
<!--    这里获取到数据后传给Floor-->
    <Floor v-for="floor in floorList" :key="floor.id" :list="floor"></Floor>

    <Brand></Brand>
    <Footer v-show="isShow"></Footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Recommend from "@/views/Recommend/Recommend";
import ListContainer from "@/views/ListContainer/ListContainer";
import Rank from "@/views/Rank/Rank";
import Like from "@/views/Like/Like";
import Floor from "@/views/Floor/Floor";
import Brand from "@/views/Brand/Brand";
import {useRouter} from 'vue-router'
import {computed, onMounted, ref, watch} from 'vue'
import MyIndex from "@/components/TypeNav";
import {useStore} from 'vuex'
export default {
  name: 'Home',
  components: {
    MyIndex,
    Header,Footer,ListContainer,Recommend,Rank,Like,Floor,Brand
  },
  setup(){
    let router = useRouter();
    let isShow = ref(true);

    router.beforeEach((to, from) => {
      isShow.value = to.meta.show
    })

    //发送请求，获取Floor中的数据 然后传给Floor，我们要把数据存储到vuex中去
    // TypeNav组件的请求写到了main里面节约性能 写不写看自己
    let store = useStore();
    store.dispatch("getFloorList")

    let floorList = computed(()=>{
      return store.state.home.floorList
    })



    return{isShow,floorList}
  }
}
</script>
