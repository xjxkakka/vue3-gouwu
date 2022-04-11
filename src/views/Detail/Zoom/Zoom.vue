<template>
  <div class="spec-preview">
    <!--    默认显示第一张图片-->
    <img :src="imgObj.imgUrl"/>
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big"/>
    </div>
    <!-- 遮罩层 -->
    <div  class="mask" ref="mask"></div>
  </div>
</template>

<script>
import {computed, ref} from "vue";
import EventBus from "@/EventBus";

export default {
  name: "Zoom",
  props: ['skuImageList'],
  setup(props, context) {
    let ImageIndex = ref(0)
    let imgObj = computed(() => {
      //不要直接用父传过来的数据，用computed让他最少为空对象
      // return props.skuImageList[0] || {};
      return props.skuImageList[ImageIndex.value] || {};
    })
    //接收兄弟组件传递过来的index
    EventBus.on('changeImg', (index) => {
      //computed属性值只读，不可修改
      ImageIndex.value = index
    })

    //放大镜
    //蒙版
    let mask = ref(null);
    //放大的图片
    let big = ref(null);
    //鼠标进入
    let handler = (event) => {
      //蒙版*2的宽度和高度 等于整个盒子
      //当鼠标进入时获取距离左边的距离
      //鼠标在蒙版的中间，所以要除以二
      let left = event.offsetX - mask.value.offsetWidth / 2;
      let top = event.offsetY - mask.value.offsetHeight / 2;
      //约束范围
      if (left <= 0) left = 0;
      if (left >= mask.value.offsetWidth) left = mask.value.offsetWidth;
      if (top <= 0) top = 0;
      if (top >= mask.value.offsetWidth) top = mask.value.offsetHeight;
      //修改元素的lef|top属性值
      mask.value.style.left = left + 'px';
      mask.value.style.top = top + 'px';
      big.value.style.left = -2 * left + 'px';
      big.value.style.top = -2 * top + 'px';
    }
    return {imgObj, ImageIndex, mask, big, handler}
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>