import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//引入需要全局注册的组件
import TypeNav from '@/components/TypeNav/index.vue'
const app = createApp(App);
//引入MockServer.js ----mock数据
import '@/mock/mockServe'
//引入swiper的css样式
import "swiper/css/swiper.css"


//执行 actions中的方法  Action 通过 store.dispatch 方法触发：
store.dispatch("categoryLIST")

//引入懒加载插件
import lazyPlugin from 'vue3-lazy'
//注册插件
app.use(lazyPlugin,{
    //需要懒加载的图片
    loading:require('@/assets/ys.jpg'),
    error:require('@/assets/ys.jpg')
})

app.use(store).use(router).mount('#app')
//注册全局组件，需要填写两个参数，第一个参数是：当前组件的name名，第二个参数是：哪一个组件
//需要使用的时候是使用 当前组件的name名 去调用
app.component("TypeNav",TypeNav)

