const express = require('express');
const router = express.Router();

const BooksController = require('../controllers/books.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt, BooksController.addBook);
router.post('/all', authJwt, BooksController.getAllBooks);
router.post('/available', authJwt, BooksController.getAvailableBooks);
router.post('/:bookCode/', authJwt, BooksController.getBookDetails);
router.post('/:bookCode/delete', authJwt, BooksController.deleteBook);
router.post('/:bookCode/edit', authJwt, BooksController.editBook);
router.post('/:bookCode/borrowing', authJwt, BooksController.borrowing);
router.post('/:bookCode/returnBook', authJwt, BooksController.returnBook);

module.exports = router;
