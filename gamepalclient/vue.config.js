const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target:
          'http://127.0.0.1:9000/api', // 目标代理接口地址
        // secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        // ws: true, // 是否启用websockets
        pathRewrite: {
          '^/api': ''
        }
      },
      '/websocket': {
        target:
          'http://127.0.0.1:9000/websocket', // 目标代理接口地址
        // secure: false,
        changeOrigin: true, // 开启代理，在本地创建一个虚拟服务端
        ws: true, // 是否启用websockets
        pathRewrite: {
          '^/websocket': ''
        }
      }
    }
	}
})
