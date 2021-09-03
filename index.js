const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
require('./startup/routes')(app);
require('./startup/db')();
app.listen(process.env.PORT,() => console.log(`server running on ${process.env.PORT}`));