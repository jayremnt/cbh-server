const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		// const token = req.headers.authorization.split(" ")[1];
		const token = req.body.token;
		console.log(token);
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