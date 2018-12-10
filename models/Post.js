var mongoose = require('mongoose');
var postsSchema = require('../schemas/posts');

module.exports = mongoose.model('Post', postsSchema);