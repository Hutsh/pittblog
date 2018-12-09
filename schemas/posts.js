var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    // category: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Category'
    // },// todo: change catgories to lables array
    //todo : support multiple catetories lables array
    category: {
        type: String,
        defalt: 'DefaltCategory'
    },
    
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    addTime: {
        type: Date,
        default: new Date()
    },
    views: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: ''
    },
    content: {
        type: String,
        default: ''
    },
    location:{
        type: String,
        default: ''
    },
    comments: {
        type: Array,
        default: []
    }

});