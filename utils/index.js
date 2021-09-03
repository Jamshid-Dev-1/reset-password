const jwt = require('jsonwebtoken');


exports.checkToken = (req,res,next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const {_id} = jwt.verify(token,process.env.JWTKEY);
        next();
    } catch (err) {
        res.status(401).json({success: false,error: 'Unauthorized user'})
    }
}




