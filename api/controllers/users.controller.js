const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UsersModel = require("../models/users.model");

class UsersController {
	constructor() {
	}

	register(req, res, next) {
		UsersModel.find({
			email: req.body.email
		}).exec().then(user => {
			if (user.length >= 1) {
				return res.status(200).json({
					message: "Mail exists"
				});
			}
			else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(200).json({
							error: err
						});
					}
					else {
						UsersModel.create({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							name: req.body.name
						}, (err, result) => {
							if (err) {
								console.log(err);
								res.status(200).json({
									error: err
								});
							}
							console.log(result);
							res.status(200).json({
								message: "User created"
							});
						});
					}
				});
			}
		});
	}

	login(req, res, next) {
		UsersModel.find({
			email: req.body.email
		}).exec().then(user => {
			if (user.length < 1) {
				return res.status(200).json({
					message: "Auth failed"
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(200).json({
						message: "Auth failed"
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
							expiresIn: "1h"
						}
					);
					return res.status(200).json({
						message: "Auth successful",
						token: token
					});
				}
				res.status(200).json({
					message: "Auth failed"
				});
			});
		}).catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	}

	delete(req, res, next) {
		UsersModel.remove({_id: req.params.userId})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "User deleted"
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	}
}

module.exports = UsersController;