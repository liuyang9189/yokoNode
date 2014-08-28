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

//注册页
exports.articles = function(req, res){
    console.log(connection.escape(req.param("id","")))
    connection.query(
            'SELECT * FROM content WHERE id ='+req.param("id","") ,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }else{
                console.log(results)
                res.render('articles', {
                    title: "文章页",
                    user: req.session.user,
                    message: req.flash('message'),
                    results:results[0]
                });
            }
        }
    );

};