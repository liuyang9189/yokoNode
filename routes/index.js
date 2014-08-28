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

//登陆页
exports.login = function(req, res){
    connection.query(
            'SELECT * FROM user',
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                res.render('index', {
                    title : "登陆",
                    message : req.flash('message')
                });
            }
        );
};
//登陆接口
exports.loginSuccessful = function (req, res) {
    if( req.method === 'GET' ){
        if( req.session.user ){
            res.redirect('/index.do');
        }else{
            res.render('/', {
                title: "登录",
                message: req.flash('message')
            });
        }
    }
    else if( req.method === 'POST' ){
        connection.query(
            'SELECT * FROM user WHERE email ='+ connection.escape(req.param("email","")) ,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                if( results == "" ){
                    //用户不存在
                    req.flash('message','请输入正确的用户名和密码');
                    res.redirect('/');
                }
                else if(results[0].password != req.param("password","")){
                    //密码错误
                    req.flash('message','您输入的密码有误!');
                    res.redirect('/');
                }
                else{
                    req.session.user = results[0];
                    res.redirect('/index.do');
                }
            }
        );
    }
};



//登陆成功-首页
exports.index = function(req, res){
    if(req.param("starting","") != ""){
        var starting = req.param("starting","");
        var end = req.param("end","");
        connection.query(
                'SELECT * FROM content ORDER BY createTime desc limit '+starting+','+end ,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                else{
                    for(var i=0;i<results.length;i++){
                        var min_content = results[i].content.substr(0,120);
                        results[i].min_content = min_content+"...";
                    }
                    res.jsonp(results);//返回JSON
                }
            }
        );
    }else{
        var starting = 0;
        var end = 10;
        connection.query(
                'SELECT * FROM content ORDER BY createTime desc limit '+starting+','+end ,
            function selectCb(err, results, fields) {
                if (err) {
                    throw err;
                }
                else{
                    for(var i=0;i<results.length;i++){
                        var min_content = results[i].content.substr(0,120);
                        results[i].min_content = min_content+"...";
                    }
                    res.render('loginSuccessful', {
                        title: "首页",
                        user: req.session.user,
                        message: req.flash('message'),
                        results:results
                    });

                }
            }
        );
    }
};

//注册页
exports.zc = function(req, res){
    res.render('register', {
        title: "注册",
        user: req.session.user,
        message: req.flash('message')
    });
};

//注册接口
exports.register = function(req, res){
    connection.query(
        'SELECT * FROM user WHERE email ='+ connection.escape(req.param("email","")) ,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if( results !="" ){
                req.flash('message','邮箱已被注册');
                res.redirect('/register');
            }else{
                var sql = "INSERT INTO user SET email=?, username=?, password=?, createTime=?",
                    values = [ req.param("email",""), req.param("username",""), req.param("password",""), new Date()];
                connection.query(sql, values, 
                    function(err, results){
                        if (err) {
                            throw err;
                        }else{
                            var sessions = {email : req.param("email",""),username : req.param("username",""),password : req.param("password","")};
                            req.flash('message','新用户添加成功！');
                            req.session.user = sessions;
                            res.redirect('/index.do');
                        }
                    }
                );

            }
        }
    );
};


//退出
exports.logout = function(req, res){
    session(req, res, function(){
        req.session.user = false;
        res.redirect('/');
    });
}





