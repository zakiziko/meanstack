const mongoose = require('mongoose');

const publicationSchema = mongoose.Schema({
    content:{
        type:String,
        require:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
    //add visibility
});

const Publication = module.exports = mongoose.model('Publication',publicationSchema);