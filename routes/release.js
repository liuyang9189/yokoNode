var mysql         = require('mysql')
  , TEST_DATABASE = "nodecms"
  , session       = require('./common').session;

var connection = mysql.createConnection({
    host : 'localhost',
    port : 3306,
    user : 'root',
    password : '111111',
    database : TEST_DATABASE
});

connection.connect();

//发布页
exports.release = function(req, res){
    res.render('release', {
        title: "发布",
        user: req.session.user,
        message: req.flash('message')
    });
};


//发布接口
exports.fb = function(req, res){
    if(req.param("content","") == "" || req.param("title","") == "" ){
        req.flash('message','标题或内容不可为空');
        res.redirect('/admin/release');
    }else{
        var sql = "INSERT INTO content SET userId=?, createTime=?, content=?, type=?, createName=?, title=?",
            values = [ req.session.user.id, new Date(), req.param("content",""), "1", req.session.user.username, req.param("title","")];
        connection.query(sql, values,
            function(err, results){
                if (err) {
                    throw err;
                }else{
                    req.flash('message','发布成功！');
                    res.redirect('/index.do');
                }
            }
        );
    }
};