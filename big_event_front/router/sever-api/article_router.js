const express = require('express')
const router = express.Router()

// 引入服务器
const conn = require('../../util/sql.js')

// 键值对解析到req.body
router.use(express.urlencoded())

// 获取文章分类列表
router.get('/cates', (req, res) => {
    conn.query(`select * from categories`, (err, result) => {
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器处理错误！"
            })
            return
        }
        // console.log(result);
        res.json({
            "status": 0,
            "message": "获取文章分类列表成功！",
            "data": [
                {
                    result
                }
            ]
        })
    })
})


// 新增文章分类
router.post('/addcates', (req, res) => {
    // 获取参数
    let { name, slug } = req.body;

    // sql语句
    let sqlStr = `insert into categories (name,slug) values("${name}","${slug}")`
    // 操作sql
    conn.query(sqlStr, (err, result) => {
        console.log(result);
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器处理失败"
            })
            return
        }

        res.json({
            "status": 200,
            "message": "新增文章分类成功！"
        })

    })

})

// 根据id删除文章分类
router.get('/deletecate', (req, res) => {
    let { id } = req.query;

    let sqlStr = `delete from categories where id=${id}`

    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器处理失败！"
            })
            return
        }

        console.log(result);
        if (result.affectedRows == 1) {
            res.json({
                "status": 200,
                "message": "删除文章分类成功！"
            })

        } else {
            res.json({
                "status": 400,
                "message": "没有这个文章分类！"
            })
        }
    })
})

// 根据id获取文章分类
router.get('/getCatesById', (req, res) => {

    let { id } = req.query;

    // sql语句
    let sqlStr = `select * from categories where id=${id}`

    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器处理失败"
            })
        }
        //console.log(result);
        res.json({
            "status": 200,
            "message": "获取文章分类数据成功！",
            "data": {
                result
            }
        })
    })


})

// 根据id跟新文章分类
router.post('/updatecate', (req, res) => {
    let { id, name, slug } = req.body;

    let sqlStr = `update categories set name="${name}",slug="${slug}" where id=${id} `

    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 500,
                "message": "服务器处理失败"
            })
        }
        if (result.changedRows == 1) {
            res.json({
                "status": 200,
                "message": "更新分类信息成功！"
            })

        } else {
            res.json({
                "status": 400,
                "message": "修改信息不能与旧信息一致！"
            })
        }

    })
})

module.exports = router