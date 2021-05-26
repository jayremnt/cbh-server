const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

exports.register = function (req, res, next) {
	console.log(req.body);
	UserModel.find({
		email: req.body.email
	}).exec().then(user => {
		if (user.length >= 1) {
			return res.status(200).json({
				error: true,
				message: "Mail exists"
			});
		}
		else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					console.log(err);
					return res.status(200).json({
						error: true,
						message: err
					});
				}
				else {
					console.log(hash);
					UserModel.create({
						email: req.body.email,
						password: hash,
						role: req.body.role,
						name: req.body.name,
					}, (err, result) => {
						if (err) {
							console.log(err);
							return res.status(200).json({
								error: true,
								message: err
							});
						}
						console.log(result);
						res.status(200).json({
							error: false,
							message: "User created"
						});
					});
				}
			});
		}
	}).catch(err => {
		console.log(err);
		res.status(200).json({
			error: true,
			message: err
		});
	});
}

exports.login = function (req, res, next) {
	UserModel.find({
		email: req.body.email
	}).exec().then(user => {
		if (user.length < 1) {
			return res.status(200).json({
				error: true,
				message: "Auth failed"
			});
		}
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(200).json({
					error: true,
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
					error: false,
					message: "Auth successful",
					token: token
				});
			}
			res.status(200).json({
				error: true,
				message: "Auth failed"
			});
		});
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: true,
			message: err
		});
	});
}

exports.delete = function (req, res, next) {
	UserModel.remove({_id: req.params.userId})
	.exec()
	.then(result => {
		res.status(200).json({
			error: false,
			message: "User deleted"
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: true,
			message: err
		});
	});
}