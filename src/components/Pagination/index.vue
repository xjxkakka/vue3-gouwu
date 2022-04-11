<template>
  <div class="pagination">
    <!-- 上 -->
    <button @click="getPage('last')" :disabled="pageNo === 1" >上一页</button>
    <!--    如果起始页为一则不显示,不为 1才显示 -->
    <!--    当前页 为 1 2 3 都不会显示这个1-->
    <button v-if="startNumAndEndNum.start > 1" @click="getPage(1)" >1</button>
    <!--    当前页只有大于5才会显示这个...-->
    <button v-if="startNumAndEndNum.start > 2">...</button>
    <!--    1...3 4 5 6 7 ... 31 下一页 共31页-->

    <!-- 中间部分 -->
    <!--    首先遍历结束页，下面用函数控制了 结束页最少都是5-->
    <template v-for="(page,index) in startNumAndEndNum.end" :key="index">
      <!--因为上面是遍历数字所以要用v-if筛选大于起始数字的-->
      <!--比如结束页为25 遍历 25 那么起始页就是 20 只有大于等于 20的 21 22 23 24 25会显示-->
      <button v-if="page>= startNumAndEndNum.start " @click="getPage(page)" :class="{active:pageNo === page}">{{ page }}</button>
<!--      添加 active样式    只有page和pageNo相等的才会显示-->
    </template>

    <!-- 下 -->
    <!--    比如有60页，结束页为59 小于 60-1  就是说小于59就显示-->
    <button v-if="startNumAndEndNum.end<totalPage - 1">...</button>
    <!--    结束页小于总页才显示，总页60 当结束页为60的时候就隐藏，-->
    <button v-if="startNumAndEndNum.end < totalPage" @click="getPage(totalPage)">{{ totalPage }}</button>
    <button @click="getPage('next')" :disabled="pageNo === totalPage">下一页</button>
    <button style="margin-left: 30px">共{{ totalPage }}页</button>

  </div>

</template>

<script>
import {computed} from "vue";

export default {
  name: "index",
  //自定义事件
  emits: ['getPageNo']
  ,
  //当前页码，显示多少条数据，总共多少条数据，连续显示多少页码
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  setup(props, context) {
    //分页器 S
    //总共多少页   total 除以 continues
    let totalPage = computed(() => {
      //向上取整 因为结果出现30.1 要变成31页
      return Math.ceil(props.total / props.continues);
    })
    //计算出连续的页码的起始数字与结束数字[连续页面的数字:至少是5]
    let startNumAndEndNum = computed(() => {
      //定义两个变量存储 起始数字与结束数字
      let start = 0;
      let end = 0;
      //连续页码数字5【就是至少五页】，如果出现不正常的现象【就是不够五页】
      //不正常现象【总页数[totalPage ]没有连续页码多[continues]】
      if (props.continues > totalPage) {
        start = 1;
        end = totalPage
      } else {
        //正常现象【连续页码5，但是你的总页数一定是大于5的】
        //起始数字 当前页码 - 连续页码/2
        //比如当前页数 10 页码7  10-(7/2) 10-3=7  起始等于7
        start = props.pageNo - parseInt(props.continues / 2);
        //结束数字
        // 比如当前页数 10 页码7  10+(5/2) 10+2=12  结束等于12
        end = props.pageNo + parseInt(props.continues / 2)
        //把出现不正常的现象【start数字出现0|负数】纠正
        //比如 当前页是1就会出现负数
        if (start < 1) {
          start = 1;
          end = props.continues;
        }

        //把出现不正常的现象【end数字大于总页码】纠正 比如end出现31 但是总页码只有30
        if (end > totalPage.value) {
          //如果结束页超过当前总页数，结束页就等于总页数 总页数31
          end = totalPage.value
          //开始页，总页数 - 连续页+1  比如 31 - 连续页5  + 1 = 27
          //27 28 29 30 31
          start = totalPage.value - props.continues + 1;
        }
      }
      //分页器 E
      return {start, end}
    })
    //发起自定义事件，点击分页获取数据
    let getPage = (index) => {
      context.emit('getPageNo', index)
    }

    return {startNumAndEndNum, totalPage, getPage}
  }

}
</script>

<style lang="less" scoped>
.pagination {
  text-align: center;

  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}

.active {
  background: skyblue;
}
</style>
