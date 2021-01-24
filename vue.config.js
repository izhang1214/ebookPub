module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? './' : "/",
    devServer: {
        open: true
    }
}
// 设置全局变量，开发模式的话 加上 ./ 也就是执行npm run build 之后，会在路径上加 ./