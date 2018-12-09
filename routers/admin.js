var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('../models/User');
var Category = require('../models/Category');
var Post = require('../models/Post');

var responseData

router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})

router.use(function(req, res, next) {
    if (!req.userInfo.isAdmin) {
        res.render('main/403');
        return;
    }
    next();
});

// admin index
//todo : pass site information
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

// user
router.get('/user', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    User.count().then(function(count) { // total number of users

        pages = Math.ceil(count / limit); // total page number todo: logic
        page = Math.min( page, pages );        //max page number
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/admin_user', {
                userInfo: req.userInfo,
                users: users,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});

// category index
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min( page, pages );
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/admin_category', {
                userInfo: req.userInfo,
                categories: categories,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});


// add cat page
// router.get('/category/add', function(req, res) {
//     console.log(req.body);
//     res.render('admin/category_add', {
//         userInfo: req.userInfo
//     });
// });



// add a cat
//before : router.post('/category/add', function(req, res) {
router.post('/category', function(req, res) {

    console.log(req.body);

    var name = req.body.name || '';
    var imgPath = req.body.imgPath || '';

    if (name == '') {
        responseData.code = 1
        responseData.message = 'Category name can not be empty'
        res.json(responseData)
        return
    }

    if (imgPath == '') {
        responseData.code = 1
        responseData.message = 'Category Image can not be empty'
        res.json(responseData)
        return
    }

    // find same name
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            responseData.code = 2
            responseData.message = 'Category exists'
            res.json(responseData)
            return
        } else {
            // save cat
            return new Category({
                name: name,
                imgPath: imgPath
            }).save();
        }
    }).then(function(newCategory) {

        responseData.code = 0
        responseData.message = 'save success' // todo redirect to cat page after delay
        res.json(responseData)
    })

});

// edit cat page
// /post/edit/:id
// router.get('/category/edit/:id', function(req, res) {

//     var id = req.params.id || '';

//     Category.findOne({
//         _id: id
//     }).then(function(category) {
//         if (!category) {
//             res.send('category not exist')
//         } else {
//             res.render('admin/category_edit', {
//                 userInfo: req.userInfo,
//                 category: category
//             });
//         }
//     })

// });

// save cat change
router.put('/category', function(req, res) {

    var id = req.body.id || ''; //oldid
    var name = req.body.name || ''; //newname
    var imgPath = req.body.imgPath || '';
    // console.log('run here');

    console.log('submitted id='+id+' ; newname='+name);

      // empty name
    if(name === ''){
      responseData.code = 1
      responseData.message = 'Empty name'
      res.json(responseData)
      return
    }

    if (imgPath == '') {
        responseData.code = 1
        responseData.message = 'Category Image can not be empty'
        res.json(responseData)
        return
    }

    //update
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
           responseData.code = 4
           responseData.message = 'Category does not exist'
           res.json(responseData) 
           return
        } else {
            if (name == category.name) {
                responseData.code = 0
                responseData.message = 'Category did not change.'
                res.json(responseData) 
                return
            } else {
                return Category.findOne({
                    _id: {$ne: id},
                    name: name,
                    imgPath: imgPath
                });
            }
        }
    }).then(function(sameCategory) {
        if (sameCategory) {
                responseData.code = 1
                responseData.message = 'Category name already exist'
                res.json(responseData) 
                return
        } else {
            return Category.updateOne({
                _id: id
            }, {
                name: name,
                imgPath: imgPath
            });
        }
    }).then(function() {
        responseData.code = 0
        responseData.message = 'Success'
        res.json(responseData) 
        return
    })


    // if(!isExist){
    //    console.log('zou zhe le');
    //    findcat.name = newname;
    //    findcat.save();
    //    responseData.code = 0
    //    responseData.message = 'Success'
    //    res.json(responseData) 
    //    return
    // }

});

// del cat
//before: router.get('/category/delete/', function(req, res) {
router.delete('/category/:id', function(req, res) {

    console.log("DELETE: " + req.params.id);

    var id = req.params.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        responseData.code = 0
        responseData.message = 'Deleted'
        res.json(responseData) //todo: front end popup success model
    });

});

// admin post list
//router.get('/content', function(req, res) {
router.get('/post(/page:page?)?', function(req, res) {

    var page = Number(req.params.page) || 1;
    var limit = 10;
    var pages = 0;

    // console.log("_______page:"+page);

    Post.count().then(function(count) {

        pages = Math.ceil(count / limit);
        page = Math.min( page, pages );
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Post.find().limit(limit).skip(skip).populate('user').sort({
            addTime: -1
        }).then(function(contents) {
            res.render('admin/content_index', {
                userInfo: req.userInfo,
                contents: contents,

                count: count,
                pages: pages,
                limit: limit,
                page: page
            });
        });

    });

});


// new post editor
//router.get('/content/add', function(req, res) {
router.get('/post/add', function(req, res) {

    Category.find().sort({_id: -1}).then(function(categories) { // get all cats
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });

});


// add post
//router.post('/content/add', function(req, res) {
router.post('/post', function(req, res) {

    // console.log(req.body)

    if ( req.body.category == '' ) {
      responseData.code = 412
      responseData.message = 'Empty category'
      res.json(responseData)
      return
    }

    if ( req.body.title == '' ) {
      responseData.code = 412
      responseData.message = 'Empty title'
      res.json(responseData)
      return
    }

    if ( req.body.description == '' ) {
      responseData.code = 412
      responseData.message = 'Empty description'
      res.json(responseData)
      return
    }

    if ( req.body.content == '' ) {
      responseData.code = 412
      responseData.message = 'Empty content'
      res.json(responseData)
      return
    }

    //save to db
    new Post({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content,
        addTime: new Date(),
    }).save().then(function(rs) {
      responseData.code = 0
      responseData.message = 'Success'
      res.json(responseData)
      return
    });

});

// edit post page ok
//router.get('/content/edit', function(req, res) {
router.get('/post/edit/:id', function(req, res) {

    var id = req.params.id || '';
    // var id = req.query.id || '';

    console.log('edit id='+id)

    // var categories = Category.find().sort({_id: -1})
    // console.log('edit categories='+categories)

    Category.find().sort({_id: -1}).then(function(categories) { // get all cats
      Post.findOne({ _id: id }).then(function(content){
        res.render('admin/content_edit', {
            userInfo: req.userInfo,
            categories: categories,
            content: content
        })
      })
    });

    // todo: category is string

});

// save post edit
 //router.post('/content/edit', function(req, res) {
router.put('/post/:id', function(req, res) {
    var id = req.params.id || '';

    console.log("get value from front end: id=" + id);
    console.log("des = "+req.body.description);

    if ( req.body.category == '' ) {
        responseData.code = 412
        responseData.message = 'Empty category'
        res.json(responseData)
        return
    }

    if ( req.body.title == '' ) {
        responseData.code = 412
        responseData.message = 'Empty title'
        res.json(responseData)
        return
    }

    if ( req.body.description == '' ) {
        responseData.code = 412
        responseData.message = 'Empty description'
        res.json(responseData)
        return
    }

    if ( req.body.content == '' ) {
        responseData.code = 412
        responseData.message = 'Empty content'
        res.json(responseData)
        return
    }

    Post.updateOne({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function(rs) {
      responseData.code = 0
      responseData.message = 'Success'
      res.json(responseData)
      return
    });

});


//DELETE post
// router.get('/content/delete', function(req, res) {
router.delete('/post/:id', function(req, res) {
    var id = req.params.id || '';

    Post.remove({
        _id: id
    }).then(function(rs) {
      responseData.code = 0
      responseData.message = 'Delete success'
      res.json(responseData)
      return
    });
});


module.exports = router
