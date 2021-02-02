
const express = require('express');

const app = express();

require('./models/connections');

const todoRouter = require('./routers/todo');
const userRouter = require('./routers/user');

app.use(express.json())

app.use(express.static('public'));

//base path /api/todo/
app.use('/api/todo',todoRouter);

app.use('/api/user',userRouter);

  app.listen(3000,()=>{
    console.log("success server on port 3000");
})
 