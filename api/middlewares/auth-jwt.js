const jwt = require('jsonwebtoken');

let authJwt = {};

authJwt.authenticate = (req, res, next) => {
	try {
		// const token = req.headers.authorization.split(" ")[1];
		const token = req.body.token;
		let userData = jwt.verify(token, process.env.JWT_KEY);
		console.log(userData);
		next();
	}
	catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			message: err,
			data: {
				is_expired: true
			}
		});
	}
}

authJwt.isAdmin = (req, res, next) => {
	try {
		const token = req.body.token;
		let userData = jwt.verify(token, process.env.JWT_KEY);
		if (userData.role === 'admin') {
			next();
		} else {
			res.status(200).json({
			error: true,
			message: "You are not admin",
		});
		}
	}
	catch (err) {
		console.log(err);
		res.status(200).json({
			error: true,
			message: err,
			data: {
				is_expired: true
			}
		});
	}
}

module.exports = authJwt;