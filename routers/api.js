var express = require('express')
var router = express.Router()
var User = require('../models/User')
var Content = require('../models/Content');
var sha1 = require('sha1')

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

  // empty username
  if (username == '') {
    responseData.code = 1
    responseData.message = 'Username can not be empty!'
    res.json(responseData)
    return
  }
  // empty password
  if (password === '') {
    responseData.code = 2
    responseData.message = 'Password can not be empty!'
    res.json(responseData)
  }
  // different password
  if (password !== repassword) {
    responseData.code = 3
    responseData.message = 'Two passwords didn\'t match, Try again.'
    res.json(responseData)
  }

  // username exist
  User.findOne({
    username: username
  }).then(function (userInfo) {
    if (userInfo) {
      // console.log('aaaaaaaaaaaaa')
      // console.log(userInfo)
      responseData.code = 4
      responseData.message = 'Username already exists!'
      res.json(responseData)
      return
    }
    var user = new User({
      username: username, 
      password: password
    })
    return user.save()
  }).then(function (newUserInfo) {
    responseData.message = 'Register Success!'
    res.json(responseData)
  })

  // flash middlewares: //todo check input
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
  // console.log(username);
  // console.log(password);

  if (username === '' || password === '') {
    responseData.code = 1
    responseData.message = 'Username or Password can not be empty'
    res.json(responseData)
    return
  }

  // search Fdb
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
    // correst
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
router.post('/user/logout', function (req, res) {
  req.cookies.set('userInfo', null)
  res.json(responseData)
})

//get all commnets
router.get('/comment', function(req, res) {
    var contentId = req.query.contentid || '';

    Content.findOne({
        _id: contentId
    }).then(function(content) {
        responseData.data = content.comments;
        res.json(responseData);
    })
});

// submit commnet router.post('/comment/post', function(req, res) {
router.post('/comment', function(req, res) {

    var contentId = req.body.contentid || ''; //todo: contentid ->postid
    var postData = {
        username: req.userInfo.username,
        postTime: new Date(),
        content: req.body.content
    };

    //get the content information
    Content.findOne({
        _id: contentId
    }).then(function(content) {
        content.comments.push(postData);
        return content.save();
    }).then(function(newContent) {
        responseData.message = 'commnet successfull';
        responseData.data = newContent;
        res.json(responseData);
    });
});


module.exports = router
