const express = require('express');
const router = express.Router();
const authJwt = require("../middlewares/auth-jwt");

const UsersController = require('../controllers/users.controller');

router.post('/register', UsersController.register);
router.post('/login', UsersController.login);
router.post('/all', authJwt.authenticate, authJwt.isAdmin, UsersController.getAll);
router.post('/info', authJwt.authenticate, authJwt.isAdmin, UsersController.getUserInfo);
router.post('/register', authJwt.authenticate, authJwt.isAdmin, UsersController.register);
router.post('/delete', authJwt.authenticate, authJwt.isAdmin, UsersController.delete);
router.post('/edit', authJwt.authenticate, authJwt.isAdmin, UsersController.edit);

module.exports = router;
