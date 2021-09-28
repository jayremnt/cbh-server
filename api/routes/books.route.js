const express = require('express');
const router = express.Router();

const BooksController = require('../controllers/books.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt.authenticate, BooksController.addBook);
router.post('/all', authJwt.authenticate, BooksController.getAllBooks);
router.post('/available', authJwt.authenticate, BooksController.getAvailableBooks);
router.post('/:bookCode/', authJwt.authenticate, BooksController.getBookDetails);
router.post('/:bookCode/delete', authJwt.authenticate, BooksController.deleteBook);
router.post('/:bookCode/edit', authJwt.authenticate, BooksController.editBook);
router.post('/:bookCode/borrowing', authJwt.authenticate, BooksController.borrowing);
router.post('/:bookCode/trace', authJwt.authenticate, BooksController.getBookTrace);
router.post('/:bookCode/returnBook', authJwt.authenticate, BooksController.returnBook);
router.post('/:bookCode/extendBook', authJwt.authenticate, BooksController.extendBook);
router.post('/:bookCode/isBorrowed', authJwt.authenticate, BooksController.isBorrowed);

module.exports = router;
