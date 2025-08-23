const exp=require('express');
const userApp=exp.Router();
const UserAuthor=require("../models/userAuthorModel");
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const article=require('../models/articleModel');
//create new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor));
//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    //add comment obj to comments array of article
    const articleWithComments=await article.findOneAndUpdate(
        {articleId:req.params.articleId},
        {$push:{comments:commentObj}},
        {returnOriginal:false})
        //send res
        res.send({message:"comment added",payload:articleWithComments})
}))
module.exports=userApp;