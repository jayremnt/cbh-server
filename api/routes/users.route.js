const express = require('express');
const router = express.Router();

const UsersController = require('../controllers/users.controller');
const usersController = new UsersController();

router.post('/register', usersController.register);
router.post('/login', usersController.login);

module.exports = router;
