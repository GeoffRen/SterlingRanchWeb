/* Copyright G. Hemingway, @2017 */
'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    session         = require('express-session');

let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

let app = express();
app.use(express.static(path.join(__dirname, '../../public')));
if (env !== 'test') app.use(logger('dev'));
app.engine('pug', require('pug').__express);
app.set('views', __dirname);

app.use(session({
    name: 'session',
    secret: 'ohhellyes',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('*', (req, res) => {
    let preloadedState = req.session.user ? {
            username: req.session.user.username,
            primary_email: req.session.user.primary_email
        } : {};
    preloadedState = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
    res.render('base.pug', {
        state: preloadedState
    });
});

let server = app.listen(port, () => {
    console.log('Assignment 5 app listening on ' + server.address().port);
});
