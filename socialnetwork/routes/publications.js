const express = require('express');
const router = express.Router();
const Publication = require('../models/publication');
const User = require('../models/user');
const bodyParser = require('body-parser');

//get all publications
router.get('/publications',(req,res)=>{
    Publication.find({},(err , publications)=>{
        if(err) throw err
        res.json(publications);
    });
});

//get pub by id
router.get('/publication/:id',(req,res)=>{
    Publication.findById(req.params.id,function(err,publication){
        if(err) throw err
        res.json(publication);
    });
});

//get all pub by a user id
router.get('/pub/:id',(req,res)=>{
    Publication.find({user : req.params.id},function(err,pub){
        res.json(pub);
    });
});

//create a new publication
router.post('/publication',(req,res)=>{
    let publication = new Publication();
    publication.content = req.body.content;
    publication.user = req.body.user;
    publication.save(function(err){
        if(err) throw err
        res.json(publication);   
    });
    
});

//delete pub by id
router.delete('/publication/:id',(req,res)=>{
    var id = req.params.id;
    Publication.remove({_id: id},function(err){
        if(err)throw err
    });
});

//update a publication
router.put('/publication',(req,res)=>{
    Publication.findOneAndUpdate({_id: req.body.id},{ $set:{content : req.body.content}},{new:true},function(err,publication){
                if(err)throw err
                res.json(publication); 
            });
});

// pub by user and his friends
router.get('/publVisible/:id',(req,res)=>{
    var list = [];
    var mdl={
        name:"",
        list:[]
    }
    Publication.find({user:req.params.id},function(err,publications){
        if(err)throw err
       // list.push(...publications);
    });
    User.findOne({_id:req.params.id},(err,user)=>{
        Publication.find({user: { $in: user.friend}},function(err,pubs){
            res.json(pubs);
        });
    });
});
module.exports = router;