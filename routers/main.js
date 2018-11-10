var express = require('express')
var router = express.Router()

router.get('/', function (req, res) {

  // console.log(req.userInfo._id)

  res.render('main/index.html', {
    userInfo: req.userInfo
  })
})

module.exports = router
