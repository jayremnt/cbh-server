const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
const authJwt = require('./api/middlewares/auth-jwt');
// routes
const usersRoutes = require('./api/routes/users.route');
const booksRoutes = require('./api/routes/books.route');
const borrowersRoutes = require('./api/routes/borrowers.route');

// mongoose connect
mongoose.connect(`mongodb+srv://JayremntB:${process.env.DB_PW}@cluster0.nx3tc.mongodb.net/test`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen(port);

console.log('Server is running on port ' + port);

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "POST, GET");
		return res.status(200).json({});
	}
	next();
});
// routes
app.use('/users', usersRoutes);
app.use('/books', booksRoutes);
app.use('/borrowers', borrowersRoutes);
app.use('/alive', authJwt);


app.use((req, res, next) => {
	const error = new Error("Route not found");
	error.status = 404;
	next(error);
});

app.use((error, req, res, next) => {
	res.status(error.status || 500);
	res.json({
		error: true,
		message: error.message
	});
});