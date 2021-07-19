const express = require('express');
const router = express.Router();

const BorrowersController = require('../controllers/borrowers.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt.authenticate, BorrowersController.addBorrower);
router.post('/all', authJwt.authenticate, BorrowersController.getAllBorrowers);
router.post('/borrowing', authJwt.authenticate, BorrowersController.getBorrowingBorrowers);
router.post('/:borrowerCode/', authJwt.authenticate, BorrowersController.getBorrowerInfo);
router.post('/:borrowerCode/delete', authJwt.authenticate, BorrowersController.deleteBorrower);
router.post('/:borrowerCode/edit', authJwt.authenticate, BorrowersController.editBorrowerInfo);

module.exports = router;
