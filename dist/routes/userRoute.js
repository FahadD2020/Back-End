"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const userRouter = express_1.default.Router();
exports.userRouter = userRouter;
/*
    Responds to a Get request received at /Users
    returns an array of all available users
*/
userRouter.get("/", (_req, res, next) => {
    res.status(200).send(user_1.userArray);
});
/*
    Responds to a Get requests received at /Users/:userId where the userId portion is dynamic
    this returns a user if the user is found within the userArray matching the given :userId
    otherwise this returns status 404 user not found
*/
userRouter.get("/:userId", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    if (foundUser)
        res.status(200).send(foundUser);
});
/*
    Responds to a Post request recieved at /Users
    creates a new user record with the information provided if the userId provided
    isn't already in the system.
    If the userId provided already exists it returns an error 409 (Conflict)
    If all the required properties for a given user object aren't privided it returns status 406 UnAcceptable
*/
userRouter.post("/", (req, res, next) => {
    let newUser = user_1.userArray.find(u => u.userId.toLowerCase() === req.body.userId.toLowerCase());
    if (newUser != undefined) {
        res.status(409).send({ message: 'Duplicate userId', status: 409 });
    }
    else if (req.body.userId && req.body.firstName && req.body.lastName && req.body.emailAddress) {
        newUser = new user_1.User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress);
        user_1.userArray.push(newUser);
        res.status(201).send(newUser);
    }
    else
        res.status(406).send({ message: 'userId,firstName,lastName and emailAddress are all required fields!' });
});
/*
    Responds to a Patch Request at /Users/:userId
    It looksup a user in the userArray given the dynamic userId passed in the url.
    If user is found updates are made according to the payload.
    If user isn't found status 404 (not Found) is returned.
*/
userRouter.patch("/:userId", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    if (foundUser !== undefined) {
        if (req.body.firstName) {
            foundUser.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
            foundUser.lastName = req.body.lastName;
        }
        if (req.body.emailAddress) {
            foundUser.emailAddress = req.body.emailAddress;
        }
        res.status(202).send(foundUser);
    }
});
/*
    Responds to a Delete Request at endpoint /Users/:userId
    It looks for and removes the given userId (from the dynamic url segment) from the userArray
    If the user isn't found 404 (Not Found) status is returned.
*/
userRouter.delete("/:userId", (req, res, next) => {
    let foundUser = findAndReturnUser(req, res);
    if (foundUser !== undefined) {
        user_1.userArray.splice(user_1.userArray.findIndex(u => u.userId === foundUser.userId), 1);
        res.status(200).send({ message: 'User Deleted' });
    }
});
function findAndReturnUser(req, res) {
    let foundUser = user_1.userArray.find(u => u.userId.toLowerCase() === req.params.userId.toLowerCase());
    if (foundUser == undefined) {
        res.status(404).send({ message: 'User Not Found', status: 404 });
    }
    return foundUser;
}
//# sourceMappingURL=userRoute.js.map