var express = require('express');
//var request = require('request');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res) {
    res.render('login', { title: 'Login page' });
});

/* POST login page. */
router.post('/login', function(req, res) {
    console.log('Log : ' + req.body.login + ' - ' + req.body.password);
    if (req.body.login.toString() == 'quentin' && req.body.password.toString() == 'quentin') {
        res.render('index', { title : 'Techno', login : req.body.login });
    } else {
        res.render('login', { title: 'Login page' });
    }
});

module.exports = router;
