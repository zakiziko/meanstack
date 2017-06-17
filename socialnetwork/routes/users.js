const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Friendship = require('../models/friendship');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

router.get('/users',(req,res)=>{
    User.find({},(err,users)=>{
        if(err)throw err
        res.json(users);
    });
});

router.post('/register',(req,res)=>{
    let user = new User();
    user.name= req.body.name;
    user.login = req.body.login;
    user.password= req.body.password;
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(user.password ,salt, (err, hash)=>{
            if(err) throw err;
            user.password = hash;
            user.save(function(err){
                if(err){
                    res.json({success:false ,message:"Register Failed"});
                }else{
                    res.json({success:true ,message:"U are registred"});
                }
            });
        });
    });
});

router.get('/user/:id',(req,res)=>{
    User.findById(req.params.id,(err,user)=>{
        if(err) throw err
        res.json(user);
    });
});

router.post('/authentification',(req,res)=>{
   const login = req.body.login;
   const password = req.body.password;

  User.getUserByLogin(login, (err, user)=>{
    //const user = utilisateur;
    if(err) throw err;
    if(!user){
        return res.json({success:false, msg:'USER DONT EXISTE!!'});
    }else{
        bcrypt.compare(password, user.password, (err, isMatch)=>{
         if(err) throw err;
         if(isMatch){
            const token = jwt.sign(user ,"mySecret", {
                expiresIn: 500000
            });
            User.findByIdAndUpdate(user._id,{ $set:{actif : true}},{new:true},function(err,user){
                if(err) throw err
            });
            res.json({
                success : true,
                token: "JWT "+token,
                user:{
                    id: user._id,
                    login: user.login,
                    name:user.name,
                    actif:user.actif
                }
            });
        } else {
            return res.json({success:false, msg:'Retype your password Please!!'});
        }
      });

    }
  });
});

//logout
router.put('/logout',(req,res)=>{
    //console.log("the logout req: "+req.body.id);
     User.findByIdAndUpdate(req.body.id,{ $set:{actif : false}},{new:true},function(err,user){
                if(err) throw err
                //console.log(user._id+" "+user.actif);
            });
});

router.get('/friend/:id',(req,res)=>{
    User 
    .findOne({ _id: req.params.id })
    .populate("friend")
    .exec(function (err, user) {
        if (err) throw err
        res.json(user.friend);
    });
});

//friend to add  
router.get('/pfriendtest/:id',(req,res)=>{
    var list = [];
    list.push(req.params.id);
    User
    .findOne({ _id: req.params.id })
    .populate("friend")
    .exec(function (err, user) {
        if (err) {
            res.json({success:false,message:"error"});   
        }else{
            user.friend.forEach(function(element) {
                list.push(element._id);
            }, this);
            Friendship.find({creator:req.params.id},function(err,friendships){
                if(err){
                    console.log("friendship err")
                }else{
                    friendships.forEach(function(element) {
                        //console.log("reserver : "+element.resever);
                        list.push(element.resever);
                    }, this);
                    User.find({_id: {$nin: list}},function(err,users){
                         if(err){
                             res.json({success:false,message:"error"});
                            }else{
                            res.json(users);
                        }
            });
                }
            });
        }

     });
});

//send a frinedship request
router.post('/sendFriendrequest',(req,res)=>{
    let friendship = new Friendship();
    friendship.creator = req.body.creator;
    friendship.resever = req.body.resever;
    friendship.statue = false;
    friendship.save(function(err){
        if(err) throw err
        res.json({success:true,message:"friend ship request"});
    });
});

//look for friendship request
router.get('/freindshirequest/:id',(req,res)=>{
    var list = [];
    Friendship.find({resever:req.params.id},function(err, freindships){
        if(err){
            console.log("error 1")
        }else{
            freindships.forEach(function(element) {
                list.push(element.creator);
            }, this);
             
             User.find({_id : { $in: list} },(err,users)=>{
                  if(err) throw err
                  res.json(users);
    });
        }

    });
});

//accept the friendRequest & update friend list
router.put('/update',(req,res)=>{
    User.findById(req.body.creator,function(err,user){
        if(err){throw err}
        else{
            user.friend.push(req.body.resever);
            User.findByIdAndUpdate(req.body.creator,{ $set:{friend : user.friend}},{new:true},function(err,user){
                if(err) throw err
            });
        }
    });
    User.findById(req.body.resever,function(err,user){
        if(err){throw err}
        else{
            user.friend.push(req.body.creator);
            User.findByIdAndUpdate(req.body.resever,{ $set:{friend : user.friend}},{new:true},function(err,user){
                if(err) throw err
                Friendship.findOneAndRemove({resever:req.body.creator},function(err){
                    if(err) console.log("err in remove");
                    res.json({success:true});
                });
            });
        }
    });
   
    
});

//delete the friendship request
router.post('/refuse',(req,res)=>{
    //console.log("the creator"+req.body.resever);
    Friendship.findOneAndRemove({$and :[{resever:req.body.creator},{creator:req.body.resever}]},function(err){
     if(err){
          console.log("error"+err);
     }else{
         console.log("u removed the friendship request");
     }
    
 });
});

//publications


module.exports = router;