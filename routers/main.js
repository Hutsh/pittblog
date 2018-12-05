var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');
var User = require('../models/User')



var data;
router.use(function (req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

//todo zhe li shi wei le dao hang lan de categories, keyi shanchu?
    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

/*
* 首页
* */
router.get('(/page/)?:page?', function(req, res, next) {

    data.category = req.query.category || '';
    data.count = 0;
    data.page = Number(req.params.page || 1);
    data.limit = 10;
    data.pages = 0;

    var where = {};
    if (data.category) {
        where.category = data.category
    }

    Content.where(where).count().then(function(count) {

        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        //取值不能超过pages
        data.page = Math.min( data.page, data.pages );
        //取值不能小于1
        data.page = Math.max( data.page, 1 );

        var skip = (data.page - 1) * data.limit;

        return Content.where(where).find().limit(data.limit).skip(skip).populate(['user']).sort({
            addTime: -1
        });

    }).then(function(contents) {
        data.contents = contents;
        console.log(contents);
        res.render('main/index', data);
    })
});

//replaced by router.get('/post/:id',
// router.get('/view', function (req, res){

//     var contentId = req.query.contentid || '';

//     Content.findOne({
//         _id: contentId
//     }).then(function (content) {
//         data.content = content;

//         content.views++;
//         content.save();

//         res.render('main/view', data);
//     });

// });


//mod for router.get('/view', chage /view to /post and RESTFUL
router.get('/post/:id', function (req, res){
	console.log('Calling: GET /post/:id='+req.params.id);

    var contentId = req.params.id || '';

    Content.findOne({
        _id: contentId
    }).then(function (content) {
        data.content = content;

        u = User.findOne({ _id: userid = content.user });
        console.log("HEREssssssssssssss");
        console.log(u);

        content.views++;
        content.save();

        res.render('main/view', data);
    });

});




module.exports = router
