const User = require("../models/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const {
    nanoid
} = require("nanoid");
const otp = require("otp-generator");
const nodemailer = require("nodemailer");

exports.signIn = async (req, res) => {
    const validateResult = validate({
        action: "sign-in",
        data: req.body,
    });
    if (!validateResult.success) return res.status(400).json(validateResult);
    const {
        email,
        password
    } = req.body;
    await User.findOne({
            email,
        })
        .then((user) => {
            if (!compareHashedPassword(password, user.password)) {
                if (!user)
                    return res.status(400).json({
                        success: false,
                        error: "email or password is wrong",
                    });
                res.status(400).json({
                    success: false,
                    error: "password is wrong",
                });
            } else {
                res.json({
                    success: true,
                    payload: user,
                });
            }
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                error: "email or password is wrong",
            });
        });
};

exports.signUp = async (req, res) => {
    const validateResult = validate({
        action: "sign-up",
        data: req.body,
    });
    if (!validateResult.success) return res.status(400).json(validateResult);
    const {
        email,
        password,
        name
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        name,
        password: hashedPassword,
    });
    if (!user)
        return res.status(400).json({
            success: false,
            error: "email or password is wrong",
        });
    res.json({
        success: true,
        payload: user,
    });
};

exports.emailSend = async (req, res) => {
    const validateResult = validate({
        action: "emailSend",
        data: req.body,
    });
    //nodemailer
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    if (!validateResult.success) return res.status(400).json(validateResult);
    const {
        email
    } = req.body;
    await User.findOne({
            email,
        })
        .then(async (user) => {
            if (!user)
                return res.status(400).json({
                    success: false,
                    error: "email or password is wrong",
                });
            const code = Math.floor(Math.random() * 10000 + 1);
            const generatedPassword = otp.generate(6, {
                digits: true,
                alphabets: true,
                upperCase: true,
                specialChars: true,
            });
            let info = await transporter.sendMail({
                from: "jhasanov944@gmail.com", // sender address
                to: "hasanovj682@gmail.com", // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });
            console.log(info)
        })
        .catch((err) => {
            res.status(400).json({
                success: false,
                error: "email or password is wrong",
            });
        });
};

exports.resetPassword = async (req, res) => {
    const validateResult = validate({
        action: "resetPassword",
        data: req.body,
    });
    if (!validateResult.success) return res.status(400).json(validateResult);
    const {
        id
    } = req.params;
};

function validate({
    action,
    data
}) {
    let schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(6).required(),
    });

    if (action === "sign-up")
        schema = Joi.object({
            email: Joi.string().required(),
            password: Joi.string().min(6).required(),
            name: Joi.string().required(),
        });

    if (action === "resetPassword")
        schema = Joi.object({
            password: Joi.string().min(6).required(),
        });

    if (action === "emailSend")
        schema = Joi.object({
            email: Joi.string().required(),
        });

    const {
        error
    } = schema.validate(data);
    if (error)
        return {
            success: false,
            error: error.details[0].message,
        };
    return {
        success: true,
    };
}

async function compareHashedPassword(sendedPassword, receivedPassword) {
    const hashedPasswordResult = await bcrypt.compare(sendedPassword, receivedPassword);
    return hashedPasswordResult;
}