
const express = require('express')
const sql = require('../../util/sql.js')

const router = express.Router()

router.use(express.urlencoded())
const conn = require('../../util/sql.js')

// 文章类型
router.get('/category', (req, res) => {
    let sqlStr = `select * from categories`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 热点图
router.get('/hotpic', (req, res) => {
    let sqlStr = `select id,cover,title from articles`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 热门排行
router.get('/rank', (req, res) => {
    let sqlStr = `select id,title from articles`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})


// 最新资讯
router.get('/latest', (req, res) => {
    let sqlStr = `select id,title from articles limit 5`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 最新评论
router.get('/latest_comment', (req, res) => {
    let sqlStr = `select author,date,content from comments limit 6`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 焦点关注
router.get('/attention', (req, res) => {
    let sqlStr = `select content from articles limit 7`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 文章详细内容
router.get('/artitle', (req, res) => {
    let { id } = req.query;
    // let id2 = +id + 1;
    // console.log(id2);
    // let id3 = +id - 1;
    let sqlStr = `select * from articles where id in((select max(id) from articles where id< ${id}), ${id},
    (select min(id) from articles where id> ${id}))`
    //console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        //console.log(err);
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        let prev = [{ "id": result[0].id }, { "title": result[0].title }]
        let next = [{ "id": result[2].id }, { "title": result[2].title }]

        result[1].prev = prev;
        result[1].next = next;
        //console.log(result[1]);
        //console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result[1]
        })
    })
})


// 发表评论
router.post('/post_comment', (req, res) => {

    let { author, content, articleId } = req.body;
    let d = new Date()
    let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    let time = d.toLocaleTimeString().slice(2);
    console.log(date, time);
    // sql语句
    let sqlStr = `insert into comments (author, content, articleId, date, time, state) values("${author}", "${content}", ${articleId}, "${date}", "${time}", "")`

    conn.query(sqlStr, (err, result) => {
        console.log('错误', err);
        console.log("结果", result);

        res.json({
            "code": 200,
            "msg": "发表成功"

        })
    })


})

// 评论列表
router.get('/get_comment', (req, res) => {

    let { articleId } = req.query

    let sqlStr = `select author,date,content from comments where articleId=${articleId}`
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "code": 500,
                "msg": "服务器处理失败"
            })
            return
        }

        console.log(result);
        res.json({
            "code": 200,
            "msg": "获取成功",
            "data": result
        })
    })
})

// 文章搜索
router.get('/search', (req, res) => {
    let { key, type, page, perpage } = req.query;
    let sqlStr = ``

    // 总页数
    let pages = '';
    // 当前页数
    page ? page : page = 0;


    let countsql = `select count(*) as id from articles`
    conn.query(countsql, (err, result) => {
        if (err) console.log(err);

        //console.log(result[0]);
        // 总页数
        pages = perpage ? Math.ceil(result[0].id / perpage) : Math.ceil(result[0].id / 6);

        //console.log(pages);
    })

    // 查询页数 以及 页面
    let limit = '';
    perpage ? limit = page ? page * perpage - perpage + ',' + page * perpage : 0 + ',' + perpage : limit = page ? page * 6 - 6 + ',' + page * 6 : 0 + ',' + 6
    console.log(limit);
    if (key) {

        sqlStr = `select * from articles where title like "%${key}%" limit ${limit}`
        conn.query(sqlStr, (err, result) => {
            if (err) console.log(err);

            console.log(result);
            res.json({
                "pages": pages,
                "page": +page,
                "data": result
            })
        })
    }
    if (type) {
        sqlStr = `select * from articles where categoryId=${type}`;
        conn.query(sqlStr, (err, result) => {
            if (err) console.log(err);

            res.json({
                "pages": pages,
                "page": +page,
                "data": result
            })
        })
    }


})



module.exports = router;