const mongoose = require('mongoose');
const frinedshipSchema = mongoose.Schema({
    statue:{
        type:Boolean,
        default:false
    },
    creator:{
       type:mongoose.Schema.Types.ObjectId,
       ref:'User'
    },
    resever:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
});

const Freindship = module.exports = mongoose.model('Freindship',frinedshipSchema);