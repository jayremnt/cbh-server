const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 8080;
// routes
const usersRoutes = require('./api/routes/users.route');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port);

console.log('Server is running on port ' + port);

app.use('/users', usersRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});