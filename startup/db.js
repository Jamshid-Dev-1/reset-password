const mongoose = require('mongoose');


module.exports = function () {
    mongoose.connect('mongodb://localhost/reset-password-users',{})
        .then(() => console.log('connected to database'))
        .catch(err => console.log("Connection error: ",err))
}