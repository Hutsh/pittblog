var fs = require('fs');
var express = require('express');
var router = express.Router();

var Category = require('../models/Category');
var Content = require('../models/Content');
var User = require('../models/User')

var multer  = require('multer')
var upload = multer({ dest: 'public/upload/' });


var responseData

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})


var data;
router.use(function(req, res, next) {
    data = {
        userInfo: req.userInfo,
        categories: []
    }

    Category.find().then(function(categories) {
        data.categories = categories;
        next();
    });
});

router.get('(/page/)?:page?', function(req, res, next) {

    data.count = 0;
    data.page = Number(req.params.page || 1);
    data.limit = 10;
    data.pages = 0;
    Content.count().then(function(count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Content.find().limit(data.limit).skip(skip).populate(['user']).sort({
            addTime: -1
        });

    }).then(function(contents) {
        data.contents = contents;
        console.log(contents);
        res.render('main/index', data);
    })
});


//mod for router.get('/view', chage /view to /post and RESTFUL
router.get('/post/:id', function(req, res) {
    console.log('Calling: GET /post/:id=' + req.params.id);

    var contentId = req.params.id || '';
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(contentId);

    Content.findOne({
        _id: contentId
    }).populate(['user']).then(function(content) {
        data.content = content;
        content.views++;
        content.save();
        // console.log(content.user.username);

        res.render('main/view', data);
    });

});

router.get('/archive', function(req, res) {

    const monthNames = ["Jan.", "Feb.", "Mar,", "Apr,", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

    var postsByMonth = [];

    Content.find().populate(['user']).sort({
        addTime: -1
    }).then(function(posts) {
        var mark = ""
        for (var i = 0; i < posts.length; i++) {
            newmark = monthNames[posts[i].addTime.getMonth()] + " " + posts[i].addTime.getFullYear()
            console.log('newmark=' + newmark + " mark=" + mark);
            if (newmark != mark) { // new month
                if (mark != "") {
                    postsByMonth.push(monthPost)
                }
                mark = newmark;
                var monthPost = {
                    month: "",
                    posts: []
                }
                monthPost.month = newmark
                monthPost.posts.push(posts[i])
                if (i == posts.length - 1) {
                    postsByMonth.push(monthPost)
                }
            } else {
                monthPost.posts.push(posts[i])
            }
        }

        return postsByMonth
    }).then(function(postsByMonth) {
        console.log("--------------------------------------------");
        for (var i = 0; i < postsByMonth.length; i++) {
            console.log(postsByMonth[i]);
            console.log("--------------------------------------------");
        }
        data.postByMonth = postsByMonth
        res.render('main/archive', data);
    })

})

// upload file
router.post('/upload', upload.single('file'), function(req, res, next){
    uploaded = req.file.filename
    console.log('uploaded:', uploaded);
    responseData.code = 0
    responseData.message = 'Updated'
    responseData.uploadedFile = uploaded
    res.json(responseData)
    return
});

router.get('/upload', function(req, res, next){
    res.render('main/upload', data);
});

//category list
router.get('/category', function(req, res) {
    Category.find().then(function(categories) {
        data.categories = categories;
        res.render('main/categories', data);
    });
})

//category
router.get('/category/:category', function(req, res) {
    console.log("loading category:"+req.params.category);
    Content.where('category').eq(req.params.category).populate(['user']).sort({ 
        addTime: -1 
    }).then(function(posts){
        data.contents = posts;
        data.showcat = req.params.category;
        console.log(posts);
        res.render('main/index', data);
    })
    


})


module.exports = router