
console.log('vue.config.js loaded');
module.exports = {
    devServer: {
      proxy: {
        // 配置代理规则
        '/api': {
          target: 'http://192.168.2.91:8080', // 目标接口域名
          changeOrigin: true, // 是否跨域
          pathRewrite: {
            '^/api': 'zjw', // 重写路径，去掉 `/api` 前缀
          },
        },
      },
    },
  };