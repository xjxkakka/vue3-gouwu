const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
module.exports={
    devServer:{
        //开启代理
        proxy:{
            //代理设置，我们不可能所以请求都找代理
            //当访问/api地址的时候都使用代理操作
            '/api':{
                //写真正的服务器
                target:'http://39.98.123.211',
                ws:true,
                changeOrigin:true,
                //因为没有访问api，所以要把路径重写，把 /api去掉
                //重写路径，可以理解原本端口号就没/api但是这里设置了/api才找代理，
                // 所以写上了/api，找到代理后，通过pathRewrite 把/api删除掉
                /*pathRewrite:{
                    '^/api':''
                }*/
            }
        }

    },
    configureWebpack:{
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
    }
}