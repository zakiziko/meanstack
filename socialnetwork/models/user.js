const express = require('express');
const mongoose = require('mongoose');
const Publication = require('./publication')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    login:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    actif:{
        type:Boolean,
        default:false
    },
    publications:[{type:mongoose.Schema.Types.ObjectId , ref:'Publication'}],
    friend:[{type:mongoose.Schema.Types.ObjectId , ref:'User'}]
    
    
});

const User = module.exports = mongoose.model('User',userSchema);

module.exports.getUserByLogin = function(login, callback){
    const query = {login: login};
    User.findOne(query , callback);
}

module.exports.getfriends=function(id,callback){
    User.findOne({_id:id})
    .populate("friend")
    .exec(callback);
}

module.exports.getpubs=function(id,callback){
    this.getfriends(id,(err,users)=>{
        users.friend.forEach(function(element) {
            Publication.find({user:element._id},(callback))
        }, this);
    });
}
