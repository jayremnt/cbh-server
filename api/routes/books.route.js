const express = require('express');
const router = express.Router();

const BookController = require('../controllers/books.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt, BookController.addBook);
router.post('/all', authJwt, BookController.getAllBooks);
router.post('/available', authJwt, BookController.getAvailableBooks);
router.post('/:bookCode/', authJwt, BookController.getBookDetails);
router.post('/:bookCode/delete', authJwt, BookController.deleteBook);
router.post('/:bookCode/edit', authJwt, BookController.editBook);

module.exports = router;
