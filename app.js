var path = require('path');
var express = require('express');
var session = require('express-session');
var _ = require('lodash');
var bodyParser = require('body-parser');
var compression = require('compression');
require('./models/mysql');
var webRouter = require('./web_router');
require('./api/adv');
var app = express();
var logger = require('./common/logger');
var config = require('./config');

// 静态文件目录
var staticDir = path.join(__dirname, 'public');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('.html', require('ejs').__express);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());

app.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.session_timeout
    }
}));

app.use('/public', express.static(staticDir));
app.use('/', webRouter);

if (!module.parent) {
    app.listen(3000, function() {
        logger.info('Server listening on port', config.port);
        logger.info('You can debug your app with http://' + config.host + ':' + config.port);
        logger.info('');
    });
}
global._ = _;
module.exports = app;