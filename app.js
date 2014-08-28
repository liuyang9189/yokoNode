var express     = require('express')
  , path        = require('path')
  , flash       = require('connect-flash')
  , config      = require('./config').config
  , app         = express()
  , routes      = require('./routes/index')
  , release      = require('./routes/release')
  , articles      = require('./routes/articles');

// Configuration
app.configure(function(){
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'html');
    app.engine('.html', require('ejs').__express);
    app.use(flash());
    app.use(express.favicon());
    app.use(express.cookieParser());
    app.use(express.session({
    secret: config.session_secret
    }));
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(app.router);
});
//以.do结尾的url，为后台的url，需要登录以后才可以访问
app.all("*",function(req, res, next){
    var user = req.session.user;
    if (user || ! req.path.match(/\.do$/g)){
        next();
    } else {
        res.redirect("/");
    }
});
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/',routes.login);//登录页
app.post('/login',routes.loginSuccessful);//登录接口
app.get('/index.do',routes.index);//登录成功页
app.get('/register',routes.zc);//注册页
app.post('/admin/register',routes.register);//注册接口
app.get('/admin/logout',routes.logout);//退出
app.get('/admin/release.do',release.release);//发布页
app.get('/admin/fb.do',release.fb);//发布接口
app.get('/admin/:id.do',articles.articles);//文章页


//config 渲染到模板
app.locals({
  config:config
});

app.listen(config.port, function(){
  console.log("Express server listening on port 1000");
});
