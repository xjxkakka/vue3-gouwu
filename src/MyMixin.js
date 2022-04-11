//对外暴露对象，可以放置组件重复JS业务逻辑
//   1. <button @click="getMsg">按钮</button>
// 2. import {getMsg} from '@/MyMixin.js'
// 3. mixins: [getMsg]
//  4.  return {getMsg};
export const getMsg = ()=>{
    alert(123)
}