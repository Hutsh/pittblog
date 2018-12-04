var express = require('express')
var router = express.Router()
var User = require('../models/User')

var responseData

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

router.post('/user/register', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var repassword = req.body.repassword
  console.log("------------")
  console.log(req.body)

  // 用户是否为空
  if (username == '') {
    responseData.code = 1
    responseData.message = 'Username can not be empty!'
    res.json(responseData)
    return
  }
  // 密码不能为空
  if (password === '') {
    responseData.code = 2
    responseData.message = 'Password can not be empty!'
    res.json(responseData)
  }
  // 两次输入的密码必须一致
  if (password !== repassword) {
    responseData.code = 3
    responseData.message = 'Two passwords didn\'t match, Try again.'
    res.json(responseData)
  }

  // 用户名是否已经被注册了，如果数据库中已经存在和我们要注册的用户名同名的数据，表示该用户名已经被注册了
  User.findOne({
    username: username
  }).then(function (userInfo) {
    if (userInfo) {
      console.log('aaaaaaaaaaaaa')
      console.log(userInfo)
      // 表示数据库中有该记录
      responseData.code = 4
      responseData.message = 'Username already exists!'
      res.json(responseData)
      return
    }
    // 保存用户注册的信息到数据库中
    var user = new User({
      username: username, // wait fix add sha1
      password: password
    })
    return user.save()
  }).then(function (newUserInfo) {
    console.log(newUserInfo)
    responseData.message = 'Register Success!'
    res.json(responseData)
  })

  // flash middlewares: //wait fix
  // 校验参数
  // try {
  //   if (!(name.length >= 1 && name.length <= 10)) {
  //     throw new Error('名字请限制在 1-10 个字符')
  //   }
  //   if (['m', 'f', 'x'].indexOf(gender) === -1) {
  //     throw new Error('性别只能是 m、f 或 x')
  //   }
  //   if (!(bio.length >= 1 && bio.length <= 30)) {
  //     throw new Error('个人简介请限制在 1-30 个字符')
  //   }
  //   if (!req.files.avatar.name) {
  //     throw new Error('缺少头像')
  //   }
  //   if (password.length < 3) {
  //     throw new Error('密码至少 3 个字符')
  //   }
  //   if (password !== repassword) {
  //     throw new Error('两次输入密码不一致')
  //   }
  // } catch (e) {
  //   // 注册失败，异步删除上传的头像
  //   fs.unlink(req.files.avatar.path)
  //   req.flash('error', e.message)
  //   return res.redirect('/signup')
  // }
})

router.post('/user/login', function (req, res) {
  var username = req.body.username
  var password = req.body.password
  console.log(username);
  console.log(password);

  if (username === '' || password === '') {
    responseData.code = 1
    responseData.message = 'Username or Password can not be empty'
    res.json(responseData)
    return
  }

  // 查询数据库中相同用户名和密码的记录是否存在，如果存在则登录成功
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 2
      responseData.message = 'Username and Password does not match!'
      res.json(responseData)
      return
    }
    // 用户名和密码是正确的
    responseData.message = 'Login Success!'
    responseData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }))
    res.json(responseData)
  })
})

// log out
router.get('/user/logout', function (req, res) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})

module.exports = router