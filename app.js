var fs = require('fs');
var path = require('path')
var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')
var multer = require('multer')

var app = express()


var User = require('./models/User')

// static files
app.use('/public', express.static(path.join(__dirname, '/public')))

// set engine
app.engine('html', swig.renderFile) //
app.set('views', './views')
app.set('view engine', 'html')
swig.setDefaults({ cache: false }) // disable chche

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' })) // RESTful

// set cookie
app.use(function(req, res, next) {
    req.cookies = new Cookies(req, res)

    // parse cookies
    req.userInfo = {}
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))
            // console.log("req.userInfo type:" + typeof(req.userInfo));
            // is admin
            // console.log("req.userInfo:" + req.userInfo.username);
            User.findById(req.userInfo._id).then(function(userInfo) {
                // console.log("userInfo" + userInfo);
                if (!userInfo) {
                    req.userInfo.isAdmin = false
                } else {
                    req.userInfo.isAdmin = Boolean(userInfo.isAdmin)
                }

                next()
            })
        } catch (e) {
            next()
        }
    } else {
        next()
    }
})


// models
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))
app.get('*', function(req, res) {

    res.render('main/404');
});

mongoose.connect('mongodb://localhost:27017/pittblog', { useNewUrlParser: true }, function(err) {
    if (err) {
        console.log('Failed connect')
    } else {
        console.log('DB connect success')
        // listen port
        app.listen(8081)
    }
})