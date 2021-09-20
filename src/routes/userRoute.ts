import { json } from "body-parser";
import express, { Request, Response } from "express";
import { Post, postArray } from "../models/post";
import { User, userArray } from "../models/user";

const userRouter = express.Router();


/*
    Responds to a Get request received at /Users
    returns an array of all available users. Password is 
    not shared
    TODO specs dont ask for JWT, but rubric does? Confirm..
*/    
userRouter.get("/",(_req, res, next) =>
{
    let resultJson: Object[] = [];
    userArray.forEach(e => {
        // every thing except email id
        resultJson.push({"userId":e.userId, "firstName": e.firstName, 
                         "lastName": e.lastName, "emailAddress": e.emailAddress});
    });
    res.status(200).send(resultJson);
});

/*
    Responds to a Get requests received at /Users/:userId where the userId portion is dynamic
    this returns a user if the user is found within the userArray matching the given :userId
    otherwise this returns status 404 user not found.
    Password is not shared
*/
userRouter.get("/:userId",(req,res,next)=>
{
    let e = findAndReturnUser(req,res);
    if (e) {
        res.status(200).send({"userId":e.userId, "firstName": e.firstName, 
                              "lastName": e.lastName, "emailAddress": e.emailAddress
            });
    }
});


/*
    Responds to a Post request recieved at /Users 
    creates a new user record with the information provided if the userId provided
    isn't already in the system.
    If the userId provided already exists it returns an error 409 (Conflict)
    If all the required properties for a given user object aren't privided it returns status 406 UnAcceptable
*/    
userRouter.post("/", (req,res,next)=>{
    
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
    Responds to a Patch Request at /Users/:userId
    It looksup a user in the userArray given the dynamic userId passed in the url.
    If user is found updates are made according to the payload.
    If user isn't found status 404 (not Found) is returned.

    // TODO handle auth (401 Not authorized - JWT)
*/
userRouter.patch("/:userId", (req,res,next)=>{
    let foundUser = findAndReturnUser(req,res);
    if(foundUser!==undefined)
    {
        if(req.body.firstName)
        {
            foundUser.firstName = req.body.firstName;
        }
        if(req.body.lastName)
        {
            foundUser.lastName = req.body.lastName;
        }
        if(req.body.emailAddress)
        {
            foundUser.emailAddress = req.body.emailAddress;
        }
        if(req.body.password)
        {
            // TODO patch password?
        }
        res.status(200).send(foundUser);
    }
});

/*
    Responds to a Delete Request at endpoint /Users/:userId
    It looks for and removes the given userId (from the dynamic url segment) from the userArray
    If the user isn't found 404 (Not Found) status is returned.
    Additionally, delete all posts by this user
    // TODO Auth + valid JWT
*/
userRouter.delete("/:userId", (req,res,next)=>{
    let foundUser = findAndReturnUser(req,res);
    if (foundUser !== undefined)
    {
        let i = foundUser.userId;
        userArray.splice(userArray.findIndex(u=>u.userId===i), 1);

        let newArray = postArray.filter(function(e) {
            if (e.userId == i) return true;
            else return false;
        });
        Post.updatePostArray(newArray);

        res.status(204).send({message:'no content', status:'204'});
    }
});

/*
    Respond to login request: validate a username and password
    If valid, return a valid JSON Web Token
    // TODO
*/
userRouter.get("/:userId/:password", (req, res, next) => {
    let user = findAndReturnUser(req, res);
    if (user !== undefined) {
        if (user.ValidatePassword(req.params.password)) {
            res.status(200).send({message:"OK", status:200});
        }
        res.status(401).send({message:"Unauthorized", status:401});
    }
});

/*
    Return all posts for the passed user
*/
userRouter.get("/Posts/:userId", (req, res, next) => {
    let user = findAndReturnUser(req, res);
    if (user !== undefined) {
        let posts = postArray.find(p => p.userId.toLowerCase() === req.params.userId.toLowerCase());
        res.status(200).send(posts);
    }
});

function findAndReturnUser(req:Request,res:Response): User|undefined
{
    let foundUser = userArray.find(u=>u.userId.toLowerCase()===req.params.userId.toLowerCase());
    if( foundUser == undefined)
    {
        res.status(404).send({message:'User Not Found', status:404});
    }

    return foundUser;
}

export {userRouter};
