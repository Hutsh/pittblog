var express = require('express')
var router = express.Router()
var Category = require('../models/Category')

router.get('/', function (req, res) {

  // console.log(req.userInfo._id)

  Category.find().then(function(categories) {
  	res.render('main/index.html', {
  	  userInfo: req.userInfo,
  	  categories: categories
  	})

  })


})

module.exports = router
