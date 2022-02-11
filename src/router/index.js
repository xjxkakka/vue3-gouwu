import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import Login from "@/views/Login/Login.vue";
import Register from "@/views/Register/Register.vue";
import Search from "@/views/Search/Search.vue";
import Detail from '@/views/Detail/Detail'
import AddCartSuccess from '@/views/AddCartSuccess'
import ShopCart from '@/views/ShopCart'
import Trade from '@/views/Trade'
import Pay from '@/views/Pay'
import PaySuccess from '@/views/PaySuccess'
import Center from '@/views/Center'
import Test from '@/views/Test.vue'
//二级路由组件
import myOrder from '@/views/Center/myOrder'
import groupOrder from '@/views/Center/groupOrder'

const routes = [
    {
        path:'/test',
        name:'Test',
        component: Test
    },
    {
        path: '/center',
        name: 'Center',
        component: Center,
        meta: {
            show: true,
            go: false
        },
        children: [
            {
                path: 'myOrder',
                component: myOrder
            },
            {
                path: 'groupOrder',
                component: groupOrder
            },
            //路由重定向
            {
                path: '/center',
                redirect: '/center/myOrder'
            },
        ]
    },

    {
        path: '/pay',
        name: 'Pay',
        component: Pay,
        meta: {
            show: true,
            go: false
        },
        beforeEnter:(to,from, next)=>{
            if (from.path=='/trade'){
                next();
            }else{
                next(false)
            }
        }
    },
    {
        path: '/PaySuccess',
        name: 'PaySuccess',
        component: PaySuccess,
        meta: {
            show: true,
            go: false
        },
    },
    {
        path: '/ShopCart',
        name: 'ShopCart',
        component: ShopCart,
        meta: {
            show: true,
            go: false
        },
    },
    {
        path: '/trade',
        name: 'Trade',
        component: Trade,
        meta: {
            show: true,
            go: false
        },
        //路由独享守卫
        beforeEnter:(to,from,next)=>{
            //去交易页面，必须是从购物车而来
            if (from.path=='/ShopCart'){
                next();
            }else{
                //其他的路由组件而来，停留在当前
                next(false)
            }

        }
    },
    {
        path: '/detail/:skuId',
        name: 'Detail',
        component: Detail,
        meta: {
            show: true,
            go: true
        },
    },
    {
        path: '/AddCartSuccess',
        name: 'AddCartSuccess',
        component: AddCartSuccess,
        meta: {
            go: false
        }
    },
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            show: true,
            go: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            show: false,
            go: true
        }
    },
    {
        path: '/register',
        name: 'Register',
        component: Register,
        meta: {
            show: false,
            go: true
        }
    },
    {
        //如果要params可传可不传需要加上问号
        path: '/search/:keyword?',
        name: 'Search',
        component: Search,
        meta: {
            show: true,
            go: true
        },
        //路由组件能不能传递props数据？
        //布尔值写法：params 只能接收params传过来的
        props: true
        //对象写法：额外的给路由组件传递一些props
        //props:{a:1,b:2}那边可以直接接收 a 和 b
        //比较少用：函数写法：可以params参数、query参数，通过props传递给路由组件
        /*props: (router) => {
            return {keyword: router.params.keyword, k: router.query.k}
        }*/
    },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    //滚动行为
    scrollBehavior(to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        return {top: 0}
    }
})
//全局守卫:前置守卫(在路由跳转之间进行判断)
router.beforeEach((to, from, next) => {
    //to:可以获取到你要跳转到那个路由信息
    //from:可以获取到你从哪个路由而来的信息
    //next:放行函数 next()放行    next(path)放行到指令路由           next(false)百度怎么使用
    //用户登录了，才会有token，未登录一定不会有
    if (localStorage.getItem('TOKEN')) {
        //登录进来后全部放行
        return next();
    } else {
        if (to.meta.go) {
            next();
        } else {
            next('/login')
        }

    }


})
export default router
