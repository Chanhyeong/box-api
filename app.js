var bodyParser = require('body-parser');
var http = require('http');
var express = require('express');
var share = require('./modules/share');

var app = express();
var port = 3000;

var server = http.createServer(app);

var passport = require('./modules/passport');
var flash = require('connect-flash'); // session 관련해서 사용됨. 로그인 실패시 session등 클리어하는 기능으로 보임.
var session = require('express-session');

var io = require('socket.io')(server);

// initialize custom module
share.init(server, app, passport);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '@#@$MYSIGN#@$#$',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// TODO: express 라우팅 다시 손보기
app.use('/api', require('./api/'));
app.use('/auth', require('./auth/router'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// 없는 경로로 이동할 시
app.use(function(req, res, next) {
    res.status(404).send('wrong address');
});

app.get('/logout' , function(req, res){
    req.session.destroy();
    req.logout();
    console.log("logout");
    res.redirect('/login');
});

server.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log('Express listening on port', port);
});

// TODO 1: 프로젝트 생성 시 소켓 생성하도록
// TODO 2: 시작 시 모든 포트에 대한 소켓을 열기 or 프로젝트 접속자 파악해서 열고 닫기
var TerminalConnect = require('./modules/terminal-connect');

new TerminalConnect(io, 8001);

var updateSocket = require('./modules/update-socket');
updateSocket.init(io);