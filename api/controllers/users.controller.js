const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");
let UsersController = {};

UsersController.register = (req, res, next) => {
	console.log(req.body);
	const registerInfo = req.body;
	UserModel.find({
		email: registerInfo.email
	}).exec().then(user => {
		if (user.length >= 1) {
			return res.status(200).json({
				error: true,
				message: "Mail exists"
			});
		}
		else {
			bcrypt.hash(registerInfo.password, 10, (err, hash) => {
				if (err) {
					console.log(err);
					return res.status(200).json({
						error: true,
						message: err
					});
				}
				console.log(hash);
				UserModel.create({
					email: registerInfo.email,
					password: hash,
					role: registerInfo.role,
					name: registerInfo.name,
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

UsersController.login = (req, res, next) => {
	const loginInfo = req.body;
	UserModel.find({
		email: loginInfo.email
	}).exec().then(user => {
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
	}).catch(err => {
		console.log(err);
		res.status(500).json({
			error: true,
			message: err
		});
	});
}

UsersController.delete = (req, res, next) => {
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

module.exports = UsersController;