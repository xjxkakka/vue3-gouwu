import {createStore} from 'vuex'
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user/user'
import trade from './trade'

export default createStore({
    //存储数据的地方
    state: {

    },

    //修改state中数据的唯一手段
    // 同步修改 state 都是方法
    // 第一个参数 state 第二个参数是需要修改的值
    mutations: {},

    // actions是异步操作，可以用来提交mutation  定时器、发送请求
    // 第一个参数是 store 第二个参数是修改的值
    //actions中不能直接修改state中的数据，需要通过 commit提交mutation 调用mutation中的方法
    // 例： store.commit('mutation中的方法名',params) 第二个参数是调用方法需要的值
    actions: {},
    /* 以上三个 state定义数据，mutations定义方法修改state中的数据，
    然后用actions去调用mutations中定义的方法修改state中的数据
     不懂可以看看todolist3中的使用*/

    //getters:理解为计算属性，用于简化仓库数据，让组件获取仓库数据更加方便
    getters: {},

    //如果开发的页面过多，需要用到modules的模块化开发
    //实现Vuex仓库模块式开发存储数据
    modules: {
        home, search,detail,shopcart,user,trade
    }
})
