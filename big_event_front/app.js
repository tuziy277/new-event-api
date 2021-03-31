const express = require('express')
const app = express()
// 跨域
const cors = require('cors');

app.use(cors())

// 注册路由
const user = require('./router/user_router.js');
const userinfo = require('./router/user_info_router.js');
const article = require('./router/article_router.js');

app.use('/api', user);
app.use('/my', userinfo);
app.use('/my/article', article);

app.listen(3002, () => {
    console.log('服务器在3002启动');
})