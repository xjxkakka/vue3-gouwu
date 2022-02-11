#### 1.vue-cli脚手架初始化项目。

node + webpack +淘宝镜像

node_modules文件夹:项目依赖文件夹

public文件夹: 一般放置一些静态资源（图片)，需要注意，放在public文件夹中的静态资源， webpack进行打包的时候，会原封不动打包到dist文件夹中。

src文件夹(程序员源代码文件夹):
assets文件夹:一般也是放置静态资源（一般放置多个组件共用的静态资源)，需要注意，放置在assets文件夹里面静态资源， 在webpack打包的时候，webpack会把静态资源当做一个模块，打包JS文件里面。

    components文件夹:一般放置的是非路由组件（全局组件)

    App.vue:唯一的根组件，Vue当中的组件（.vue)
    main.ts:程序入口文件，也是整个程序当中最先执行的文件

babel.config.js:配置文件（babel相关)

package.json文件:认为项目‘身份证'，记录项目叫做什么、项目当中有哪些依赖、项目怎么运行。I

package-lock.json:缓存性文件

#### 2.项目的其他配置
2.1项目运行起来的时候，让浏览器自动打开  加上--open
--package.json
"scripts": {
"serve": "vue-cli-service serve --open",
"build": "vue-cli-service build"
},

2.2 eslint校验功能关闭
---在根目录下，创建一个 vue.config.js
比如：声明变量但是没有使用eslint校验工具报错。
加入这段代码
```
module.exports={
    //关闭eslint
    lintOnSave:false
}
```
！！但是这个项目没开启eslint

2.3 src文件夹简写方法，配置别名
jsconfig.json配置别名@提示 【@代表的是src文件夹，这样将来文件过多，找的时候也方便】
这段在ws这里可以不用配置，vscode需要配置下
```
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": [
        "src/*"
      ]
    }
  },
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

####3.项目路由的分析
vue-router
前端所谓路由：KV键值对
key:URL (地址栏中的路径)
value:相对应的路由组件
注意：项目上中下结构

路由组件：
Home首页路由组件、search路由组件、login登录路由、Refister注册路由
非路由组件：
Header【首页、搜索页】
Footer【在首页、搜索页】，但是在登录|注册页面是没有

####4.完成非路由组件Header与Footer业务
在咱们项目当中，不在以HTML +CSS为主，主要搞业务、逻辑在开发项目的时候:
1:书写静态页面（HTML + CSS)
2:拆分组件
3:获取服务器的数据动态展示
4:完成相应的动态业务逻辑

注意1:创建组件的时候，组件结构＋组件的样式＋图片资源

注意2:咱们项目采用的less样式，浏览器不识别less样式，需要通过less、less-loader【安装五版本的】进行处理less，
```npm install --save less less-loader@5```
把1ess样式变为css样式，浏览器才可以识别。I

注意3:如果想让组件识别less样式，需要在style标签的身上加上lang=less

4.1使用组件的步骤(非路由组件）
-创建或者定义

#####5.路由组件的搭建
vue-router
在上面分析的时候，路由组件应该有四个:Home、Search、Login、Register
-components文件夹:经常放置的非路由组件（共用全局组件>
-pages |views文件夹:经常放置路由组件
5.1配置路由
项目当中配置的路由一般放置在router文件夹中

5.2总结
路由组件与非路由组件的区别?
1:路由组件一般放置在pages|views文件夹，非路由组件一般放置components文件夹中
2:路由组件一般需要在router文件夹中进行注册（使用的即为组件的名字)，非路由组件在使用的时候，一般都是以标签的形式使用
3:注册完路由，不管路由路由组件、还是非路由组件身上都有route、router属性
route:一般获取路由信息【路径、query、params等等】
router:一般进行编程式导航进行路由跳转【push|replace】

####6.Footer组件显示与隐藏
显示或者隐藏组件：v-if|v-show
Footer组件：在Home、Search显示Footer组件
Footer组件：在登录、注册时候隐藏

6.1我们可以根据组件身上路由的 全局路由导航守卫 ,通过路由路径判断Footer显示与隐藏
6.2配置的路由的时候，可以给路由添加路由元信息【meta】，路由需要配置对象，它的key不能瞎写、胡写、乱写
```
router.beforeEach((to, from) => {
      isShow.value = to.meta.show
    })
```

####7.路由传参
7.1:路由跳转有几种方式？
比如：A->B
声明式导航：router-link（务必要有to属性），可以实现路由的跳转
编程式导航：利用的是组件实例的 router.push|replace方法，可以实现路由的跳转。（可以书写自己的一些业务）
replace和push的去呗 replace是跳转过去后是无法返回上一页的，push则是可以

7.2:路由传参，参数有几种写法？
params参数：属于路径当中的一部分，需要注意，在配置路由的时候，需要占位
query参数：不属于路径当中的一部分，类似于ajax种的queryString /home?k=v&kv,不需要占位符

######面试题1:路由传递参数（对象写法）path是否可以结合params参数一起使用？
答：不可以，params只能和name搭配使用，路由跳转传参的时候，对象的写法可以是name、path形式，但是需要注意的是，path这种写法不能与params参数一起使用

######面试题2:如何指定params参数可传可不传？
```
{
     path: '/search/:keyword?',
     name: 'Search',
     component: Search,
     meta: {
         show: true
     },
```
如果路由要求传递params参数，但是你就不传递params参数，发现一件事，URL会有问题
//如何指定params参数可以传递、或者不传递，在配置路由的时候，在占位的后面加上一个 问号【params可以传递或者不传递】
router.push({name:'Search',query:{k:keyword.value}})

######面试题3:params参数可以传递也可以不传递，但是如果传递的是空串，如何解决？
Vue3中空字符串没出现问题，出现问题的话在后面加||undefined
```
 router.push({name:"Search",
        params:{
         keyword:''||undefined
        },
        query:{
          k:keyword.value.toUpperCase()
        }})
    }
```

######面试题4：路由组件能不能传递props数据？
可以，有三种写法 。具体观看 路由组件 和 [Search](src/views/Search/Search.vue)

#####8.axios二次封装
XMLHttpRequest、fetch、JQ、axios
8.1为什么需要进行二次封装axios？
请求拦截、相应拦截器
请求拦截器，可以在发请求前之前可以处理一些业务
相应拦截器：当服务器数据返回以后，可以处理一些事情

8.2在项目中经常存放在 API文件夹【axios】
接口当中：路径都带有/api
baseURL："/api"


8.3 axios基础不好建议参考文档

#####9.接口统一管理
项目很小：完全可以在组件的声明中求函数中发送请求
项目很大：axios.get('xxx')

9.1跨域问题
什么是跨域：协议、域名、端口号不同请求，称之为跨域
解决方案通过：JSONP、CROS、代理

######10.nprogress进度条的使用
start:进度条开始
done:进度条结束
进度条颜色可以修改的，需要找到别人的css样式

#####11.vuex状态管理库
9.1vuex是什么？
vuex式官方提供一个插件，状态管理库，集中式管理项目中组件共用的数据。
切记，并不是全部项目都需要vuex，如果项目很小，完全不需要vuex，如果项目很大，组件很多、数据很多、数据维护很费劲，vuex
state
mutations
actions
getters
modules 

9.2vuex基本使用

9.3vuex实现模块式开发
如果项目过大，组件过多，接口也很多，数据也很多，可以让vuex实现模块式开发
模拟state存储数据
{
    count:1
    search:{a:1},
    detail:{sss},
    pay:{}
}

#####10.完成  TypeNav三级联动展示数据业务
[用编程式导航和委托事件，进行路由跳转，为什么这样写呢，因为直接写for里面会创建很多个函数出来，为了性能优化](src/components/TypeNav/index.vue)

######11.开发Search模块中的TypeNav商品分类菜单(过渡动画效果)
过渡动画:签体组件|元素必要有v-if|v-show指令才可以进行过渡动画

######12.开发Home首页当中的ListContainer组件与Floor组件？
但是这里需要知道一件事情:服务器返回的数据（接口)只有商品分类菜单分类数据，对于ListContainer组件与Floor组件数据服务器没有提供的。
mock数据(模拟):如果你像mock数据，需要用到一个插件mockjs

使用步骤：
1.在项目当中src文件夹中创建mock文件夹
2.第二部准备JSON数据(mock文件夹中创建相应的JSON文件)----格式化一下，别留有空格（跑不起来）
3.把mock数据需要的图片防止在public文件夹中【public文件夹在打包的时候，会把相应的资源原封不动打包到dist文件夹中】

使用步骤:
1.创建mock
2.写banner和floor数据
3.打开mockServe.js看，写完数据引入到main.js中
4.打开API文件的mockAjax.js文件 配置axios需要的东西
5.打开index.js 看mock的使用
```
//mock的使用
import mockRequest from './mockAjax'
//获取banner(Home首页轮播接口)
export const reqGetBannerList = ()=>{
    return mockRequest({url:'/banner',method:'get'})
}
```

#######13.swiper插件的使用
// 7不稳定 建议用5 目前
1.npm install swiper@5
2.在main.js里引入 css
3.[具体使用看 ListContainer.vue](src/views/ListContainer/ListContainer.vue)
4.要和watch+nextTick一起使用不然你从服务器拿的数据会不生效swiper


######14.开发floor组件
切记:仓库当中的state的数据格式，你别瞎写、胡写、乱写，数据格式取决于服务器返回的数据
2.1: getFloorList这个action在哪里触发，是需要在Home路由组件当中发的，不能在Floor组件内部发action
因为我们需要v-for遍历floor组件

2.2 v-for也可以在自定义标签当中使用

2.3组件通信的方式有哪些？面试频率极高
props:用于父子组件通信
自定义事件:@on @emit 可以实现子给父通信
全局事件总线:$bus 全能
pubsub-js:vue当中几乎不用全能
插槽
vuex


#####15.排序操作
1:综合 2:价格 asc:升序，desc:降序
示例:"1:desc"

1.1问题
order属性的属性值最多有多少种写法
1:asc
1:desc
2:desc
2:asc

1.2考虑的问题 类名
谁应该有类名:通过order属性值当中是包含1(综合)|包含2(价格)

1.3考虑的问题 谁应该有箭头
谁有类名，谁就有箭头

1.4箭头用什么制作？

#######16.分页功能实现
分页器展示、需要哪些数据(条件)？
需要知道当前是第几个：pageNo字段代表当前页数
需要知道每一个需要展示多少条数据：pageSize字段进行代表
需要知道每整个分页器一共有多少条数据:total字段进行代表---[获取另一条信息:一共有多少页]
需要知道分页器连续页码的个数:5|7【奇数】，因为奇数对称(好看)
总结:对于分页器而言，自定义前提需要知道四个前提条件。

pageNo:当前第几个
pageSize:代表每一页展示多少条数据
total:代表整个分页一共要展示多少条数据
continues:代表分页连续页码个数

举例子:每一页3条数据     一共91条数据     【一共是31页】


######17.开发一个详情页面
1.静态组件

2.API--->请求接口，然后去vuex发请求
3.vuex --->获取产品详情信息
vuex中还需要在新增一个模块detail
需要回到大仓库进行合并
4.动态展示组件


########18.购物车
3.向服务器发起ajax，获取购物车数据，操作vuex三连环、组件获取数据展示数据
发现:发请求的时候，获取不到你购物车里面数据，因为服务器不知道你是谁

3.1UUID临时游客身份
3.2动态展示购物车

########19.登录与注册
1.登陆与注册惊天组件-（处理共用图片资源问题）
登录与注册功能(git)：必须要会的技能
1.1登录与注册的静态组件
1.2assets文件夹---放置全部组件共用静态资源
1.3在样式当中也可以使用@符号【src别名】，切记在前面加上 ~@/xxx这样写

2.注册的业务
2.1注册业务|登陆业务中表单验证先不处理【最后一天统一处理】
2.2获取验证码的接口 /api/user/passport/sendCode/{phone}  get

3.登录业务
3.1注册 ---- 通过数据库存储用户信息(名字、密码)
3.2登录 ---- 登录成功的时候，后台为了区分你这个用户是谁 - 服务器下发token【令牌:唯一标符】
登录接口:做的不完美，一般登录成功服务器会下发token，前台持久化存储token，【带着token找服务器要用户信息进行展示】

4 token令牌理解

注意:vuex仓库存储数据   不是持久化的

5.统一登录的账号？      订单信息页和结算页只有这个账号有信息
13700000000 111111

6.获取交易页面用户信息？

######20.交易页面(商品清单)
动态展示服务器数据

2.提价订单
2.1先把支付静态组件先搞定
2.2点击提交订单的按钮的时候，还需要向服务器发起一次请求【把支付一些信息传递给服务器】


3.获取支付信息(不再使用vuex)

4.elementUI使用+按需引入

5.二维码生成 qrcode
1.安装 qrcode
```
npm i qrcode
```
2.引入 QRCode
```
import QRCode from 'qrcode'

//使用
QRCode.toDataURL('I am a pony!').then(url=>{
    console.log(url)
}).catch(error =>{
    console.error(err)
})
```

6.支付业务

7.个人中心


####8.图片懒加载
1.下载插件   https://github.com/ustbhuangyi/vue3-lazy
```
npm install vue3-lazy -S
```
2.在main.js引入插件
```
import lazyPlugin from 'vue3-lazy'
```
3.注册
```
//注册插件
app.use(lazyPlugin,{
    //需要懒加载的图片
    loading:require('@/assets/ys.jpg'),
    error:require('@/assets/ys.jpg')
})
```
4.使用:
```
<img v-lazy="good.defaultImg" alt="">
```

#####打包上线
1.打包 npm run build

项目打包后，代码都是经过压缩加密的，如果运行时报错，输出的错误信息无法准确得知是哪里的代码报错。
有了map就可以像未加密的代码一样，准确的输出是哪一行哪一列有错。
所以该文件如果项目不需要是可以去掉的
vue.config.js配置
productionSourceMap:false

