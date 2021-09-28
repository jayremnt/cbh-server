const express = require('express');
const router = express.Router();

const BorrowersController = require('../controllers/borrowers.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt.authenticate, BorrowersController.addBorrower);
router.post('/all', authJwt.authenticate, BorrowersController.getAllBorrowers);
router.post('/borrowing', authJwt.authenticate, BorrowersController.getBorrowingBorrowers);
router.post('/:borrowerId/', authJwt.authenticate, BorrowersController.getBorrowerInfo);
router.post('/:borrowerId/delete', authJwt.authenticate, BorrowersController.deleteBorrower);
router.post('/:borrowerId/edit', authJwt.authenticate, BorrowersController.editBorrowerInfo);
router.post('/:borrowerId/trace', authJwt.authenticate, BorrowersController.getBorrowerTrace);

module.exports = router;
