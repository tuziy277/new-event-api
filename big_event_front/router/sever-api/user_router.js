// 用户登录注册 接口
const express = require('express')

const router = express.Router();
// token
const jwt = require('jsonwebtoken');

// 键值对解析到req.body
router.use(express.urlencoded())

// 引入数据库
const conn = require('../../util/sql.js')

// 用户注册接口
router.post('/reguser', (req, res) => {
    // 1 获取数据
    const { username, password } = req.body

    // 2 拼接sql
    let sqlStr = `select * from users where username="${username}"`
    console.log(sqlStr);
    // 3 操作sql  查询是否有数据
    conn.query(sqlStr, (err, result) => {
        // console.log('错误是', err);
        console.log(result);
        if (result != '') {
            res.json({
                "status": 1,
                "message": "注册失败,用户名被占用"
            })
            return
        } else {
            let userSql = `insert into users (username,password) values("${username}","${password}")`

            conn.query(userSql, (err, result) => {
                console.log(userSql);
                console.log(err);
                console.log(result);
                if (err) {
                    res.json({
                        "status": 500,
                        "message": "服务器处理失败"
                    })
                    return
                }
                res.json({
                    "status": 0,
                    "message": "注册成功"
                })

            })


        }

    })



})


// 用户登录
router.post('/login', (req, res) => {
    const { username, password } = req.body
    //  生成token 
    const tokenStr = jwt.sign({ name: username }, 'bigevent', {
        expiresIn: 20 * 60 * 60
    })
    // token 前面 'Bearer'

    const token = 'Bearer ' + tokenStr;
    // 拼接spl
    let splStr = `select * from users where username="${username}" and password="${password}"`

    // 查询sql
    conn.query(splStr, (err, result) => {

        if (err) res.json({
            "status": 500,
            "message": "服务器错误"
        })
        console.log(result);
        if (result != '') {

            res.json({
                "status": 200,
                "message": "登录成功",
                "token": token
            })

        } else {
            res.json({
                "status": 401,
                "message": "用户名密码错误"
            })
        }
    })

})



// 导出路由
module.exports = router;