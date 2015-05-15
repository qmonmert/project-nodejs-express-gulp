var express = require('express');
var router = express.Router();

// Session
var session;

/* GET login page. */
router.get('/', function(req, res) {
    session = req.session;
    session.login;
    res.render('login');
});

/* GET home page. */
router.get('/index', function(req, res) {
    res.render('index', { login : session.login });
});

/* GET nodeJS page. */
router.get('/nodejs', function(req, res) {
    res.render('nodejs');
});

/* GET gulp page. */
router.get('/gulp', function(req, res) {
    res.render('gulp');
});

/* GET bower page. */
router.get('/bower', function(req, res) {
    res.render('bower');
});

/* POST login page. */
router.post('/login', function(req, res) {
    console.log('Log : ' + req.body.login + ' - ' + req.body.password);
    if (req.body.login.toString() == 'quentin' && req.body.password.toString() == 'quentin') {
        session.login = req.body.login;
        res.render('index', { login : session.login });
    } else {
        res.render('login');
    }
});

module.exports = router;
