var path = require('path');
var express = require('express');
var session = require('express-session');
var _ = require('lodash');
var bodyParser = require('body-parser');
var compression = require('compression');
require('./models/mysql');

var webRouter = require('./web_router');
var apiRouterV1 = require('./api_router_v1');
require('./api/adv');
var csurf = require('csurf');
var errorhandler = require('errorhandler');
var cors = require('cors');
var app = express();
var logger = require('./common/logger');
var config = require('./config');
var schedule = require('node-schedule');

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

if (!config.debug) {
    app.use(function(req, res, next) {
        if (req.path === '/api' || req.path.indexOf('/api') === -1) {
            csurf()(req, res, next);
            return;
        }
        next();
    });
    app.set('view cache', true);
}

app.use('/public', express.static(staticDir));

app.use('/api/v1', cors(), apiRouterV1);
app.use('/', webRouter);

if (config.debug) {
    app.use(errorhandler());
} else {
    app.use(function(err, req, res, next) {
        logger.error(err);
        return res.status(500).send('500 status');
    });
}

if (!module.parent) {
    app.listen(3000, function() {
        logger.info('Server listening on port', config.port);
        logger.info('You can debug your app with http://' + config.host + ':' + config.port);
        logger.info('');
    });
}
global._ = _;
module.exports = app;
