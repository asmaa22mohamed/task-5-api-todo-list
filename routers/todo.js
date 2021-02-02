const express = require('express');


const todo = require('../models/todo');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const todoRouter = new express.Router();

const authenticationMiddleWares = require('../middlewares/Authentication')

todoRouter.use(authenticationMiddleWares);

//using todos
todoRouter.post('/', async(req, res, next) => {
    
    const {body, title, tags } = req.body;
    req.body['createdAt'] = Date.now();

    const Todo=await todo.create({ userId: req.signedData.id, body: body, title: title, tags: tags })
       res.send(Todo)

})
//get todos by userId
todoRouter.get('/', async(req, res, next) => {

        const Todo= await todo.find({userId:req.signedData.id})
        res.send(Todo)
   
    
})
//get todos by skip and limit
todoRouter.get('/:limit/:skip', async (req, res, next) => {
    
        const todos = await todo.find({}).skip(parseInt(req.params.skip)).limit(parseInt(req.params.limit)).exec()
        res.send(todos)

})
//patch todo By Id
todoRouter.patch('/:id',async (req, res, next) => {
    
        const id = req.params.id;
        req.body['updatedAt'] = Date.now();
        const Todo =await todo.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        res.send(Todo)
   
})
//delete todo by id
todoRouter.delete('/:id',async (req, res, next) => {

   
        const Todo=await todo.findByIdAndRemove(req.params.id);
        res.send(Todo);
    
})


module.exports = todoRouter;