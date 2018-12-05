// load
var path = require('path')
var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var Cookies = require('cookies')

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

// 设置cookie
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)

  // 解析登录用户的cookie信息
  req.userInfo = {}
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'))
      // console.log("req.userInfo type:" + typeof(req.userInfo));
      // 获取当前登录用户的类型，是否是管理员
      // console.log("req.userInfo:" + req.userInfo.username);
      User.findById(req.userInfo._id).then(function (userInfo) {
      	// console.log("userInfo" + userInfo);
      	if(!userInfo){
      		req.userInfo.isAdmin = false
      	}else{
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

// // 设置cookie
// app.use(function (req, res, next) {
//   req.cookies = new Cookies(req, res)

//   console.log(req.cookies)
//   // 解析登录用户的cookie信息

//   try{
//   	req.userInfo = req.cookies.get('userInfo')
//   } catch(e) {

//   }

// })

// models
app.use('/admin', require('./routers/admin'))
app.use('/api', require('./routers/api'))
app.use('/', require('./routers/main'))

mongoose.connect('mongodb://localhost:27017/pittblogdb', { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log('Failed connect')
  } else {
    console.log('DB connect success')
    // listen port
    app.listen(8081)
  }
})
