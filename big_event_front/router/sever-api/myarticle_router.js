const express = require('express');

const router = express.Router()
// formdata格式
const multer = require('multer')
// 精细化去设置，如何去保存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        // console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})

// 引入sql
const conn = require('../../util/sql.js')

const upload = multer({ storage })
// 发布新文章
router.post('/add', upload.single('cover_img'), (req, res) => {

    //console.log('文本字段', req.body);

    //console.log('文件', req.file);
    // 参数
    let { title, cate_id, content, state } = req.body;
    let img = "http://127.0.0.1:3002/uploads/" + req.file.filename
    let d = new Date();
    let date = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    console.log(date);
    let author = '管理员'

    // sql 语句
    let sqlStr = `insert into articles (categoryId,title,cover,date,content,isDelete,state,author) values(${cate_id},"${title}","${img}",${date},"${content}",0,"${state}","${author}")`
    conn.query(sqlStr, (err, result) => {
        //console.log(err);
        // console.log(result);
        if (err) {
            res.json({
                status: 500,
                message: '服务器处理失败'
            })
            return
        }
        if (result.affectedRows == 1) {
            res.json({
                status: 200,
                message: '发布文章成功！'
            })

        }
    })

})





module.exports = router;