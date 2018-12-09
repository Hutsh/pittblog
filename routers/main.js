var fs = require('fs');
var express = require('express');
var hljs = require('highlight.js')
var md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});
var router = express.Router();

var Category = require('../models/Category');
var Post = require('../models/Post');
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
    Post.count().then(function(count) {
        data.count = count;
        data.pages = Math.ceil(data.count / data.limit);
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);

        var skip = (data.page - 1) * data.limit;

        return Post.find().limit(data.limit).skip(skip).populate(['user']).sort({
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

    Post.findOne({
        _id: contentId
    }, function(err, post){
        if(err){
            console.log("404");
            res.render('main/404', data);
            return
        }else{
            return post;
        }
    }).populate(['user']).then(function(content) {
        console.log("----------------------------------------------");
        console.log(content);
        console.log("----------------------------------------------");
        data.content = content;
        data.markedcontent = md.render(content.content)
        content.views++;
        content.save();
        // console.log(content.user.username);

        res.render('main/view', data);
    }).catch(err => function(err){
        console.log(err);
    });

});

router.get('/archive', function(req, res) {

    const monthNames = ["Jan.", "Feb.", "Mar,", "Apr,", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];

    var postsByMonth = [];

    Post.find().populate(['user']).sort({
        addTime: -1
    }).then(function(posts) {

        // var mark = ""
        // var monthPost = {
        //     month: mark,
        //     posts: []
        // }
        // for (var i = 0; i < posts.length; i++) {
        //     newmark = monthNames[posts[i].addTime.getMonth()] + " " + posts[i].addTime.getFullYear()
        //     if(newmark != mark){ // new month
        //         if (mark != "") { // not first item, push previous
        //             postsByMonth.push(monthPost)
        //             mark = newmark;
        //             monthPost = {
        //                 month: mark,
        //                 posts: []
        //             }
        //         }
        //         monthPost.posts.push(posts[i])
        //     }else{ // same as previous
        //         monthPost.posts.push(posts[i])
        //         if(i == posts.length-1){ //is last item
        //             postsByMonth.push(monthPost)
        //         }
        //     }
        // }


        // OK -->
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
                if(i == posts.length-1){ //is last item
                    postsByMonth.push(monthPost)
                }

            }
        }
        // OK<-

        return postsByMonth
    }).then(function(postsByMonth) {
        console.log("--------------------------------------------");
        for (var i = 0; i < postsByMonth.length; i++) {
            console.log("Month:" + i + "<<<");
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
        data.hidePage = true;
        res.render('main/categories', data);
    });
})

//category
router.get('/category/:category', function(req, res) {
    console.log("loading category:"+req.params.category);
    Post.where('category').eq(req.params.category).populate(['user']).sort({ 
        addTime: -1 
    }).then(function(posts){
        data.contents = posts;
        data.showcat = req.params.category;
        data.hidePage = true;
        console.log(posts);
        res.render('main/index', data);
    })
    


})



router.get('/about', function(req, res) {

    var contentId = req.params.id || '';

    Post.findOne({
        "title" : "About",
    }, function(err, post){
        if(err){
            console.log("404");
            res.render('main/404', data);
            return
        }else{
            return post;
        }
    }).populate(['user']).then(function(content) {
        console.log("----------------------------------------------");
        console.log(content);
        console.log("----------------------------------------------");
        data.content = content;
        data.markedcontent = md.render(content.content)
        content.views++;
        content.save();
        // console.log(content.user.username);

        res.render('main/view', data);
    }).catch(err => function(err){
        console.log(err);
    });

});



module.exports = router