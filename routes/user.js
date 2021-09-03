const express = require('express');
const router = express.Router();
const {resetPassword,signIn,signUp,emailSend} = require('../controllers/user');
const signToken = require('../middlewares/signToken');

router.post('/sign-in',signIn);
router.post('/sign-up',signUp);
router.post('/send-email',emailSend);
router.post('/reset-password/:id',resetPassword);


module.exports = router;



