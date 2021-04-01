const express = require('express')
const app = express()
// 跨域
const cors = require('cors');
app.use(cors())

// 静态资源托管
app.use('/uploads', express.static('uploads'))

// 注册路由
// 后台接口
const user = require('./router/sever-api/user_router.js');
const userinfo = require('./router/sever-api/user_info_router.js');
const cate = require('./router/sever-api/article_router.js');
const article = require('./router/sever-api/myarticle_router')
app.use('/api', user);
app.use('/my', userinfo);
app.use('/my/article', cate);
app.use('/my/article', article)

// 前台接口
const category = require('./router/front-api/category_router.js')

app.use('/index', category);


// //token验证
// const jwt = require('express-jwt');
// // app.use(jwt().unless());
// // jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// // unless() 约定某个接口不需要身份认证
// app.use(jwt({
//     secret: 'bigevent', // 生成token时的 钥匙，必须统一
//     algorithms: ['HS256'] // 必填，加密算法，无需了解
// }).unless({
//     path: ['/api/reguser', '/api/login'] // 除了这两个接口，其他都需要认证
// }));

// 错误中间件处理
app.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});

app.listen(3002, () => {
    console.log('服务器在3002启动');
})