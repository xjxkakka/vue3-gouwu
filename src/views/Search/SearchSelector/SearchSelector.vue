<template>
  <!--selector-->
  <div class="clearfix selector">
    <div class="type-wrap logo">
      <div class="fl key brand">品牌</div>
      <div class="value logos">
        <ul class="logo-list">
          <li v-for="(brand,index) in brand" :key="brand.tmId" @click="BrandName(brand)">{{ brand.tmName }}</li>
        </ul>
      </div>
      <div class="ext">
        <a href="javascript:void(0);" class="sui-btn">多选</a>
        <a href="javascript:void(0);">更多</a>
      </div>
    </div>
<!--    平台售卖属性的地方-->
    <div class="type-wrap" v-for="(attr,index) in attrsList" :key="attr.attrId">
<!--      平台售卖的属性：比如颜色-->
      <div class="fl key">{{ attr.attrName }}</div>
      <div class="fl value">
        <ul class="type-list">
<!--          平台售卖的属性的属性值:粉色，黑色...-->
          <li v-for="(attrValue,index) in attr.attrValueList" :key="index" @click="attrInfo(attr,attrValue)">
            <a>{{ attrValue }}</a>
          </li>
        </ul>
      </div>
      <div class="fl ext"></div>
    </div>

  </div>
</template>

<script>
import {useStore} from 'vuex';
import {computed} from "vue";

export default {
  name: "SearchSelector",
  emits: ['BrandInfo','attrInfo'],
  setup(props, context) {
    let store = useStore();
    //获取仓库中的品牌
    let brand = computed(() => {
      return store.getters.trademarkList;
    })
    let attrsList = computed(() => {
      return store.getters.attrsList;
    })
    //品牌的事件处理函数
    const BrandName = (value) => {
      //点击了品牌(苹果)，还是需要整理参数，向服务器发请求获取相应的数据进行展示
      //但是请求的数据在父组件所以需要，自定义事件把品牌的名字传递给父组件
      context.emit("BrandInfo", value)
    }

    let attrInfo =(attr,attrValue)=>{
      //["属性ID:属性值:属性名"]
      // console.log(attr,attrValue)
      context.emit("attrInfo",attr,attrValue)
    }
    return {brand, attrInfo,attrsList, BrandName}
  }

};
</script>

<style lang="less" scoped>
.selector {
  border: 1px solid #ddd;
  margin-bottom: 5px;
  overflow: hidden;

  .logo {
    border-top: 0;
    margin: 0;
    position: relative;
    overflow: hidden;

    .key {
      padding-bottom: 87px !important;
    }
  }

  .type-wrap {
    margin: 0;
    position: relative;
    border-top: 1px solid #ddd;
    overflow: hidden;

    .key {
      width: 100px;
      background: #f1f1f1;
      line-height: 26px;
      text-align: right;
      padding: 10px 10px 0 15px;
      float: left;
    }

    .value {
      overflow: hidden;
      padding: 10px 0 0 15px;
      color: #333;
      margin-left: 120px;
      padding-right: 90px;

      .logo-list {
        li {
          float: left;
          border: 1px solid #e4e4e4;
          margin: -1px -1px 0 0;
          width: 105px;
          height: 52px;
          text-align: center;
          line-height: 52px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 700;
          color: #e1251b;
          font-style: italic;
          font-size: 14px;

          img {
            max-width: 100%;
            vertical-align: middle;
          }
        }
      }

      .type-list {
        li {
          float: left;
          display: block;
          margin-right: 30px;
          line-height: 26px;

          a {
            text-decoration: none;
            color: #666;
          }
        }
      }
    }

    .ext {
      position: absolute;
      top: 10px;
      right: 10px;

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
        padding: 0 10px;
        background: #fff;
        border: 1px solid #d5d5d5;
      }

      a {
        color: #666;
      }
    }
  }
}

</style>
