const express = require('express');
const userRouter = require('../routes/user');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api',userRouter);
}





