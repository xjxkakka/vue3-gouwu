<template>
  <div class="swiper-container" id="mySwiper" ref="cur">
    <div class="swiper-wrapper">
      <div class="swiper-slide" v-for="(slide,index) in skuImageList" :key="slide.id">
        <img :src="slide.imgUrl" :class="{active:activeIndex === index}" @mouseenter="changeCurrentIndex(index)"/>
      </div>

    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>

    <!-- 如果需要导航按钮 -->
    <div class="swiper-button-prev"></div>
    <div class="swiper-button-next"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import {nextTick, ref, watch} from "vue";
import EventBus from "@/EventBus";
export default {
  name: "ImageList",
  props:['skuImageList'],
  setup(props,context){
    let activeIndex = ref(0) ;
    let changeCurrentIndex = (index)=>{
      activeIndex.value = index;
      //然后把索引保存下来传递给最大的那个图片，因为是兄弟组件所以使用 mitt插件来传
      //1.使用 emit	调用方法发起数据传递   然后兄弟组件使用EventBus.on接收
         EventBus.emit("changeImg",index)

    }
    let cur = ref(null);
    //监听数据有没传过来
    watch(()=>props.skuImageList,(newValue,oldValue)=>{
      //如果传完数据回来，等渲染完在执行下面的函数
      nextTick(()=>{
        new Swiper (cur.value, {
          //显示几个图片 一行
          slidesPerView : 2,
          //点一次切换三个图片
          slidesPerGroup : 2,

          // 如果需要前进后退按钮
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
        })
      })
    })
    return{cur,activeIndex,changeCurrentIndex}
  }
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 56px;
  width: 412px;
  box-sizing: border-box;
  padding: 0 12px;

  .swiper-slide {
    width: 56px;
    height: 56px;

    img {
      width: 100%;
      height: 100%;
      border: 1px solid #ccc;
      padding: 2px;
      width: 50px;
      height: 50px;
      display: block;

      &.active {
        border: 2px solid #f60;
        padding: 1px;
      }

    }
  }

  .swiper-button-next {
    left: auto;
    right: 0;
  }

  .swiper-button-prev {
    left: 0;
    right: auto;
  }

  .swiper-button-next,
  .swiper-button-prev {
    box-sizing: border-box;
    width: 12px;
    height: 56px;
    background: rgb(235, 235, 235);
    border: 1px solid rgb(204, 204, 204);
    top: 0;
    margin-top: 0;
    &::after {
      font-size: 12px;
    }
  }
}
</style>