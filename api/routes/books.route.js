const express = require('express');
const router = express.Router();

const BooksController = require('../controllers/books.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt.authenticate, BooksController.addBook);
router.post('/all', authJwt.authenticate, BooksController.getAllBooks);
router.post('/available', authJwt.authenticate, BooksController.getAvailableBooks);
router.post('/:bookId/', authJwt.authenticate, BooksController.getBookDetails);
router.post('/:bookId/delete', authJwt.authenticate, BooksController.deleteBook);
router.post('/:bookId/edit', authJwt.authenticate, BooksController.editBook);
router.post('/:bookId/borrowing', authJwt.authenticate, BooksController.borrowing);
router.post('/:bookId/trace', authJwt.authenticate, BooksController.getBookTrace);
router.post('/:bookId/returnBook', authJwt.authenticate, BooksController.returnBook);
router.post('/:bookId/extendBook', authJwt.authenticate, BooksController.extendBook);
router.post('/:bookId/isBorrowed', authJwt.authenticate, BooksController.isBorrowed);

module.exports = router;
