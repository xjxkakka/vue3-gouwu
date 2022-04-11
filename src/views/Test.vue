<template>
  <h2>自定义带Hover提示的按钮</h2>
  <el-button type="primary" size="mini">
    <Plus style="width: 10px;height: 10px"></Plus>
    添加
  </el-button>
  <button @click="getMsg">按钮</button>
</template>

<script>
import {nextTick, reactive, ref} from "vue";
import {edit, Plus} from '@element-plus/icons-vue';
import {getMsg} from '@/MyMixin.js'

export default {
  name: "Test",
  components: {
    edit, Plus
  },
  // mixins: [getMsg]
  // ,
  setup() {

    return {getMsg};
  }
}
</script>

<style lang="less">
.login {
  margin: 0;
  width: 100%;
  height: 100vh;
  color: #fff;
  /*背景颜色设置渐变*/
  //background: linear-gradient(0deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  //background-size: 400% 400%;
  //animation: gradientBG 15s ease infinite;

  .el-header,
  .el-footer {
    margin: 0;
    padding: 0;
    height: 35px;
    color: white;
  }

  .el-main {
    margin: 0;
    padding: 0;
    height: calc(100vh - 120px);
    /* background-image: url('@/assets/莫哈韦沙漠晚上.jpg'); */
  }

  p,
  .el-form-item__label {
    color: white;
  }
}

@keyframes gradientBG {
  0% {
    background-position: 50% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 50% 50%;
  }
}

.el-loading-spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  -webkit-animation: typing 2s linear infinite alternate;
  -moz-animation: typing 1s linear infinite alternate;
  animation: typing 2s linear infinite alternate;
  margin: 10px auto;
  position: relative;
  left: 50px;
}

@keyframes typing {
  75% {
    background-color: rgb(2, 243, 130);
    box-shadow: 40px 0px 0px 0px rgb(2, 243, 130),
    80px 0px 0px 0px rgb(2, 243, 130);
  }
}

.el-loading-spinner .circular {
  display: none; //隐藏之前element-ui默认的loading动画
}
</style>