var express = require('express'),
    app = express(),
    fs = require('fs'),
    path = require('path'),
    post = require('./routes/post');

app.set('views', __dirname + '/asset/views');
app.set('view engine', 'ejs');

// middleware
var connect = require('connect');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//app.use(express.methodOverride());
var methodOverride = require('method-override');
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

var session = require('express-session');
app.use(session({secret: '2356D&FDSQD'}));

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var serveStatic = require('serve-static')
app.use(serveStatic(__dirname + '/asset/img'));
console.log(__dirname);
// app.use(serveStatic(__dirname + '/asset/css', {hidden: true}));
/*
var csurf = require('csurf');
app.use(csurf());
app.use(function(req, res, next){
  res.locals.csrftoken = req.csrfToken();
  next();
});
*/
app.use(function(err, req, res, next) {
  res.send(err.message);
});

// routing

// staticなCSS, JSファイル
app.get(/^\/(?:css|js)\/.+/, function(req, res) {
    var contentType = undefined,
        filePath = __dirname + req.url;

    // ファイルタイプでcontentTypeを切り替え
    switch( path.extname(req.url) ) {
    // extname(hoge)はURLの最後の.以降を返す
    // hoge.css => .css
    case '.css':
        contentType = 'text/css';
        break;
    case '.js':
        contentType = 'text/javascript';
        break;
    default:
        contentType = 'text/html';
    }

     path.exists(filePath, function(exists) {
        console.log(exists);
        if ( exists ) {
            fs.readFile(filePath, function(error, content) {
                if ( error ) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': contentType});
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});

app.get('/', post.index);
app.post('/menu/', post.menu);
//app.post('/menu/:id', post.menu);

app.listen(3000);
console.log("server starting ...");
