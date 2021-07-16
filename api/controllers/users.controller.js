const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");
let UsersController = {};

UsersController.register = async (req, res, next) => {
    console.log(req.body);
    const registerInfo = req.body;
    try {
        let user = await UserModel.find({
            email: registerInfo.email
        });
        if (user.length >= 1) {
            return res.status(200).json({
                error: true,
                message: "Mail exists"
            });
        } else {
            bcrypt.hash(registerInfo.password, 10, async (err, hash) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({
                        error: true,
                        message: err
                    });
                }
                let newUser = await UserModel.create({
                    email: registerInfo.email,
                    password: hash,
                    role: registerInfo.role,
                    name: registerInfo.name,
                });
                console.log(newUser);
                res.status(200).json({
                    error: false,
                    message: "User created"
                });
            });
        }
    } catch (e) {
        console.log(e);
        res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

UsersController.login = async (req, res, next) => {
    const loginInfo = req.body;
    try {
        let user = await UserModel.find({
            email: loginInfo.email
        });
        if (user.length < 1) {
            return res.status(200).json({
                error: true,
                message: "Login failed"
            });
        }
        bcrypt.compare(loginInfo.password, user[0].password, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(200).json({
                    error: true,
                    message: "Login failed"
                });
            }
            if (result) {
                const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1d"
                    }
                );

                return res.status(200).json({
                    error: false,
                    message: "Login successful",
                    data: {
                        account: user,
                        token: token
                    }
                });
            }
            res.status(200).json({
                error: true,
                message: "Login failed"
            });
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

UsersController.delete = async (req, res, next) => {
    try {
        let result = await UserModel.remove({_id: req.params.userId});
        res.status(200).json({
            error: false,
            message: "User deleted"
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

module.exports = UsersController;