const express = require('express');
const { isError } = require('util');


const myUser = require('../models/user')
const todo = require('../models/todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authenticationMiddleWares = require('../middlewares/Authentication')
const userRouter = new express.Router();

//user register
userRouter.post('/', async (req, res, next) => {
    try{
         console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;
    const firstName = req.body.firstName;
              console.log(username)
    const hash = await bcrypt.hash(password, 7);
    const user = await myUser.create({username,password:hash,firstName });
    res.statusCode=201;
    res.send(user);

    }catch(err){
        console.error(err);
        res.statusCode=422;
        res.send(err)
    }
    
})

//user login
userRouter.post('/login', async (req, res, next) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
    
       const user = await  myUser.findOne({ username }).exec();
        if(!user) throw new Error('user not found')
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) throw new Error('username or password is wrong')

        const token = jwt.sign({id:user.id},"my-signing-secret")
        const latestTodo =await todo.find({userId:user.id}).exec();
        res.json({token,latestTodo})

    }catch(err){
        console.error(err);
        res.statusCode=422;
        res.json(err)
    }
    

})


userRouter.use(authenticationMiddleWares);

//get user firstName
userRouter.get('/', async(req, res, next) => {
    
    
    const User=await myUser.find({}, { firstName: 1 });
    res.send(User);

    
})
//delete user by id
userRouter.delete('/',async (req, res, next) => {
        const {authorization} = req.headers;
        const signedData =jwt.verify(authorization,'my-signing-secret');
        const User =await  myUser.findByIdAndRemove(req.signedData.id);
        res.send(User)

    
})
//update users by id
userRouter.patch('/',async(req, res, next) => {
    
        const User=await myUser.findByIdAndUpdate(req.signedData.id, req.body, { useFindAndModify: false })
        res.send(User)
   
})

module.exports = userRouter;