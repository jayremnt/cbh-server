const express = require('express');
const router = express.Router();

const BorrowersController = require('../controllers/borrowers.controller');
const authJwt = require('../middlewares/auth-jwt');

router.post('/add', authJwt, BorrowersController.addBorrower);
router.post('/all', authJwt, BorrowersController.getAllBorrowers);
router.post('/:borrowerCode/', authJwt, BorrowersController.getBorrowerInfo);
router.post('/:borrowerCode/delete', authJwt, BorrowersController.deleteBorrower);
router.post('/:borrowerCode/edit', authJwt, BorrowersController.editBorrowerInfo);

module.exports = router;
