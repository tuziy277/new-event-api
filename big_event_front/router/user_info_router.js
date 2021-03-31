const express = require('express');

const router = express.Router()

const multer = require('multer');

// 上传头像中间件 保存的地址
const storage = multer.diskStorage(
    // 保存在哪里
    {
        destination: function (req, file, cb) {
            cb(null, 'uploads');
        },
        // 保存时,文件名叫什么
        filename: function (req, file, cb) {
            // 目标 新名字是时间戳和后缀名
            const filenameArr = file.originalname.split('.');
            // filenameArr,length-1是找到最后一个元素的下标
            const fileName = Date.now() + '.' + filenameArr[filenameArr.length - 1]
            cb(null, fileName)
        }
    }
)



// 连接sql
const conn = require('../util/sql.js')

// 键值对解析到req.body
router.use(express.urlencoded())

// 获取用户的基本信息
router.get('/userinfo', (req, res) => {

    let { username } = req.query

    let sqlStr = `select id,username,nickname,email,userPic from users where username="${username}"`
    //console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        //console.log(result);
        //console.log(result[0].username);
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器错误",
            })
            return
        }

        if (result != '') {
            const { id, username, nickname, email, userPic } = result[0]
            res.json({
                "status": 200,
                "message": "获取用户基本信息成功！",
                "data": {
                    "id": id,
                    "username": username,
                    "nickname": nickname,
                    "email": email,
                    "user_pic": userPic
                }
            })
        } else {
            res.json({
                "status": 401,
                "message": "查不到此用户",
            })
        }



    })

})


// 更新用户的基本信息
router.post('/userinfo', (req, res) => {
    let { id, nickname, email, userPic } = req.body

    let condition = [];
    if (nickname) {
        condition.push(`nickname="${nickname}"`)
    }
    if (email) {
        condition.push(`email="${email}"`)
    }
    if (userPic) {
        condition.push(`userPic="${userPic}"`)
    }
    condition = condition.join();

    // sql语句
    let sqlStr = `update users set ${condition} where id=${id}`
    console.log(sqlStr);
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log(result);
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器错误！"
            })
            return
        }
        if (result.changedRows == 1) {
            res.json({
                "status": 200,
                "message": "修改用户信息成功！"
            })
        } else {
            res.json({
                "status": 400,
                "message": "修改用户信息失败！,请重新设置信息"
            })
        }

    })

    // console.log(condition);



    //res.json('ok')
})


// 上传头像
const upload = multer({ storage })
router.post('/uploadPic', upload.single('file_data'), (req, res) => {

    res.json({
        "status": 200,
        "message": "http://127.0.0.1:3000/uploads/" + req.file.filename
    })
})


// 修改密码
router.post('/updatepwd', (req, res) => {

    let { oldPwd, newPwd, id } = req.body;
    // sql语句
    let sqlStr = `select * from users where password="${oldPwd}" and id=${id}`
    conn.query(sqlStr, (err, result) => {
        console.log(err);
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器错误"
            })
            return
        }
        if (result != '') {
            let pwdStr = `update users set password="${newPwd}" where id=${id}`
            conn.query(pwdStr, (err, result) => {
                if (err) {
                    res.json({
                        "status": 500,
                        "message": "服务器错误"
                    })
                    return
                }
                res.json({
                    "status": 200,
                    "message": "更新密码成功！"
                })

            })

        }

    })
})




module.exports = router;