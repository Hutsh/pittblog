var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var User = require('../models/User');
var Category = require('../models/Category');
var Content = require('../models/Content');

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
        //如果当前用户是非管理员
        res.send('对不起，只有管理员才可以进入后台管理');
        return;
    }
    next();
});

/**
 * 首页
 */
router.get('/', function(req, res, next) {
    res.render('admin/index', {
        userInfo: req.userInfo
    });
});

// user
router.get('/user', function(req, res) {

    /*
    * 从数据库中读取所有的用户数据
    *
    * limit(Number) : 限制获取的数据条数
    *
    * skip(2) : 忽略数据的条数
    *
    * 每页显示2条
    * 1 : 1-2 skip:0 -> (当前页-1) * limit
    * 2 : 3-4 skip:2
    * */

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    User.count().then(function(count) { // total number of users

        //计算总页数
        pages = Math.ceil(count / limit); // wait fix logic
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        User.find().limit(limit).skip(skip).then(function(users) {
            res.render('admin/user_index', {
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

/*
* 分类首页
* */
router.get('/category', function(req, res) {

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Category.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        /*
        * 1: 升序
        * -1: 降序
        * */
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories) {
            res.render('admin/category_index', {
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

/*
* 分类的添加
* */
router.get('/category/add', function(req, res) {
    console.log(req.body);
    res.render('admin/category_add', {
        userInfo: req.userInfo
    });
});



/*
* 分类的保存
* */
router.post('/category/add', function(req, res) {

    console.log(req.body);

    var name = req.body.name || '';

    if (name == '') {
        responseData.code = 1
        responseData.message = '名称不能为空'
        res.json(responseData)
        return
    }

    //数据库中是否已经存在同名分类名称
    Category.findOne({
        name: name
    }).then(function(rs) {
        if (rs) {
            //数据库中已经存在该分类了
            responseData.code = 2
            responseData.message = '分类已经存在了'
            res.json(responseData)
            return
            // res.render('admin/error', {
            //     userInfo: req.userInfo,
            //     message: '分类已经存在了'
            // })
            // return Promise.reject();
        } else {
            //数据库中不存在该分类，可以保存
            return new Category({
                name: name
            }).save();
        }
    }).then(function(newCategory) {

        responseData.code = 0
        responseData.message = '分类保存成功'
        res.json(responseData)
        return
        // res.render('admin/success', {
        //     userInfo: req.userInfo,
        //     message: '分类保存成功',
        //     url: '/admin/category'
        // });
    })

});

/*
* 分类修改
* */
router.get('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var id = req.query.id || '';

    //获取要修改的分类信息
    Category.findOne({
        _id: id
    }).then(function(category) {
        if (!category) {
            // res.render('admin/error', {
            //     userInfo: req.userInfo,
            //     message: '分类信息不存在'
            // });
            res.send('category not exist')
        } else {
            res.render('admin/category_edit', {
                userInfo: req.userInfo,
                category: category
            });
        }
    })

});

/*
* 分类的修改保存
* */
router.put('/category/edit', function(req, res) {

    //获取要修改的分类的信息，并且用表单的形式展现出来
    var oldid = req.body.id || ''; //oldid
    //获取post提交过来的名称
    var newname = req.body.name || ''; //newname
    // console.log('run here');

    console.log('submitted id='+oldid+' ; newname='+newname);

      // empty name
    if(newname === ''){
      responseData.code = 1
      responseData.message = 'Empty name'
      res.json(responseData)
      return
    }

    // name exist
    Category.findOne({
      name: newname
    }).then(function(samename){
      if(samename){ // exist samename
        responseData.code = 2
        responseData.message = 'name exist'
        res.json(responseData)
        return
      }
    })

    //update
    Category.findOne({
      _id: oldid
    }, function (err, findcat){
      findcat.name = newname;
      findcat.save();
      responseData.code = 0
      responseData.message = 'Success'
      res.json(responseData)
      return
    });


// if(0){
//     //获取要修改的分类信息
//     Category.findOne({
//         _id: id
//     }).then(function(category) { 
//         if (!category) {
//             responseData.code = 1
//             responseData.message = 'Category dose not exist'
//             res.json(responseData)
//             return
//             // res.render('admin/error', {
//             //     userInfo: req.userInfo,
//             //     message: '分类信息不存在'
//             // });
//             // return Promise.reject();
//         } else { // find same id
//             if (name == category.name) { // no change
//                 responseData.code = 0
//                 responseData.message = 'Success, nothing change'
//                 res.json(responseData)
//                 return
//             } else { // name change
//                 return Category.findOne({ // find same name, diff id
//                     _id: {$ne: id},
//                     name: name
//                 })

//             }
//         }
//     }).then(function (samenamediffid) {

//         if (samenamediffid) { // same name diff id exist
//           responseData.code = 4
//           responseData.message = 'Duplicate Category name'
//           res.json(responseData)
//           return
//         }
//         else{ // no same name
//           console.log("avalible to update");
//           console.log('id='+id + ' name='+ name);

//           Category.findOne
//           Category.update({ _id: id }, { name: 'test' })
//           responseData.code = 0
//           responseData.message = 'Updated'
//           res.json(responseData)
//           return
//         }
//     })


//   }

});

// *
// * 分类删除
// * */
router.get('/category/delete/', function(req, res) {

    //获取要删除的分类的id
    var id = req.query.id || '';

    Category.remove({
        _id: id
    }).then(function() {
        //return success
        // wait fix
        // add ajax to reload
    });

});

/*
* 内容首页
* */
router.get('/content', function(req, res) {

  // res.render('admin/content_index',{
  //   userInfo: req.userInfo
  // })
  // console.log("req:------------------");
  // console.log(req.query.page);


  if(1){

    var page = Number(req.query.page || 1);
    var limit = 10;
    var pages = 0;

    Content.count().then(function(count) {

        //计算总页数
        pages = Math.ceil(count / limit);
        //取值不能超过pages
        page = Math.min( page, pages );
        //取值不能小于1
        page = Math.max( page, 1 );

        var skip = (page - 1) * limit;

        Content.find().limit(limit).skip(skip).populate('user').sort({
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

  }

});


/*
 * 内容添加页面
 * */
router.get('/content/add', function(req, res) {

    Category.find().sort({_id: -1}).then(function(categories) { // get all cats
        res.render('admin/content_add', {
            userInfo: req.userInfo,
            categories: categories
        })
    });

});


/*
* 内容保存
* */
router.post('/content/add', function(req, res) {

    console.log(req.body)

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

    //保存数据到数据库

    new Content({
        category: req.body.category,
        title: req.body.title,
        user: req.userInfo._id.toString(),
        description: req.body.description,
        content: req.body.content
    }).save().then(function(rs) {
      responseData.code = 0
      responseData.message = 'Success'
      res.json(responseData)
      return
    });

});

/*
* 修改内容
* */
router.get('/content/edit', function(req, res) {

    var id = req.query.id || '';

    console.log('edit id='+id)

    // var categories = Category.find().sort({_id: -1})
    // console.log('edit categories='+categories)

    // wait fix front end ajax: content_edit.html add ajax post
    // change frontend choose
    Category.find().sort({_id: -1}).then(function(categories) { // get all cats
      Content.findOne({ _id: id }).then(function(content){
        res.render('admin/content_edit', {
            userInfo: req.userInfo,
            categories: categories,
            content: content
        })
      })
    });

    // wait fix: category is string

    // Category.find().sort({_id: 1}).then(function(rs) {

    //     categories = rs;

    //     return Content.findOne({
    //         _id: id
    //     }).populate('category');
    // }).then(function(content) {

    //     if (!content) {
    //         res.render('admin/error', {
    //             userInfo: req.userInfo,
    //             message: '指定内容不存在'
    //         });
    //         return Promise.reject();
    //     } else {
    //         res.render('admin/content_edit', {
    //             userInfo: req.userInfo,
    //             categories: categories,
    //             content: content
    //         })
    //     }
    // });

});

/*
 * 保存修改内容
 // wait fix
 // change to put
 // add frontend ajax
 * */
router.post('/content/edit', function(req, res) {
    var id = req.query.id || '';

    if ( req.body.category == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容分类不能为空'
        })
        return;
    }

    if ( req.body.title == '' ) {
        res.render('admin/error', {
            userInfo: req.userInfo,
            message: '内容标题不能为空'
        })
        return;
    }

    Content.update({
        _id: id
    }, {
        category: req.body.category,
        title: req.body.title,
        description: req.body.description,
        content: req.body.content
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '内容保存成功',
            url: '/admin/content/edit?id=' + id
        })
    });

});


/*
* 内容删除
//wait fix
// restful DELETE
* */
router.get('/content/delete', function(req, res) {
    var id = req.query.id || '';

    Content.remove({
        _id: id
    }).then(function() {
        res.render('admin/success', {
            userInfo: req.userInfo,
            message: '删除成功',
            url: '/admin/content'
        });
    });
});


module.exports = router
