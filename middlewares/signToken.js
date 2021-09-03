const jwt = require('jsonwebtoken');


module.exports = function (req,res) {
    console.log(req)
    if(!req.user.success)
        return res.status(400).json({...req.user});
    
    const {_id} = req.user;
    const token = jwt.sign({_id},process.env.JWTKEY);
    const user = req.user;
    res.json({success: true,payload: {token,...user.payload}});
}







