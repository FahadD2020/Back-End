import { json } from "body-parser";
import express, { Request, Response } from "express";
import { Post, postArray } from "../models/post";
import { User, userArray } from "../models/user";

const postRouter = express.Router();


/*
    Return all posts, sorted by createdDate (latest post first)
*/
postRouter.get("/",(_req, res, next) =>
{
    let sortedArray = postArray.sort((a:Post, b:Post) => {
        return b.createdDate.getTime() - a.createdDate.getTime();
    });
    res.status(200).send(sortedArray);
});

/*
    Return a specific post (200) or 404 if not found
*/
postRouter.get("/:postId",(req,res,next)=>
{
    let post = findAndReturnPost(req,res);
    if (post) {
        res.status(200).send(post);
    }
});


/*
    Create a new post for the currently authenticated user.
    Needs a valid JWT. Respond 401 if not authorized.
    201 if okay.

    // TODO auth
*/    
postRouter.post("/", (req,res,next)=>{
    
    let newUser = userArray.find(u=>u.userId.toLowerCase()===req.body.userId.toLowerCase());
    if (newUser != undefined)
    {
        res.status(409).send({Message:'Duplicate userId', Status:409});
    }
    else if(req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress && req.body.password)
    {
        newUser = new User(req.body.userId, req.body.firstName, req.body.lastName,req.body.emailAddress, req.body.password);
        userArray.push(newUser);
        res.status(201).send(newUser);
    }
    else
        res.status(406).send({message:'userId,firstName,lastName,emailAddress and password are all required fields!', status:'406'});
})


/*
    // TODO handle auth (401 Not authorized - JWT)
*/
postRouter.patch("/:postId", (req,res,next)=>{
    let foundPost = findAndReturnPost(req,res);
    if(foundPost!==undefined)
    {
        if(req.body.headerImage)
        {
            foundPost.headerImage = req.body.headerImage;
        }
        if(req.body.content)
        {
            foundPost.content = req.body.content;
        }
        // TODO rest
        res.status(200).send(foundPost);
    }
});

/*
    // TODO Auth + valid JWT
*/
postRouter.delete("/:postId", (req,res,next)=>{
    let foundPost = findAndReturnPost(req,res);
    if (foundPost !== undefined)
    {
        let i = foundPost.postId;
        userArray.splice(postArray.findIndex(u=>u.postId===i), 1);

        let newArray = postArray.filter(function(e) {
            if (e.postId == i) return true;
            else return false;
        });
        Post.updatePostArray(newArray);

        res.status(204).send({message:'no content', status:'204'});
    }
});



function findAndReturnPost(req:Request,res:Response): Post|undefined
{
    let foundPost = postArray.find(p=>p.postId === Number.parseInt(req.params.postId));
    if (foundPost == undefined)
    {
        res.status(404).send({message:'Post Not Found', status:404});
    }

    return foundPost;
}

export {postRouter};
