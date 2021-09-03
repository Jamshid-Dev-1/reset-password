const {Schema,model} = require('mongoose');





const schema = new Schema({
    email: String,
    password: {
        type: String,
        min: 6,
        required: true
    },
    resetPasswordCode: String
});


const User = model('Users',schema);



module.exports = User;









