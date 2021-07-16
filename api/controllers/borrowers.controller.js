const borrowerModel = require('../models/borrower.model');
let BorrowersController = {};

BorrowersController.addBorrower = async (req, res, next) => {
    const borrowerInfo = req.body;
    try {
        let borrower = await borrowerModel.findOne({
            student_code: borrowerInfo.student_code
        });
        console.log(borrower);
        if (borrower) {
            return res.status(200).json({
                error: true,
                message: "Borrower exists"
            });
        }
        let newBorrower = await borrowerModel.create(borrowerInfo);
        console.log(newBorrower);
        return res.status(200).json({
            error: false,
            message: "Created borrower"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BorrowersController.getAllBorrowers = async (req, res, next) => {
    try {
        let borrowers = await borrowerModel.find({}).populate("responsible_person").populate("current_borrowed_books.responsible_person");
        console.log(borrowers);
        return res.status(200).json({
            error: false,
            message: "Successfully get all borrowers",
            data: {
                list_borrowers: borrowers
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BorrowersController.getBorrowerInfo = async (req, res, next) => {
    const borrowerCode = req.params.borrowerCode;

    try {
        let borrowerInfo = await borrowerModel.findOne({
            student_code: borrowerCode
        }).populate("responsible_person").populate("current_borrowed_books.responsible_person");
        console.log(borrowerInfo);
        if (!borrowerInfo) {
            return res.status(200).json({
                error: true,
                message: "Borrower not found"
            });
        }
        return res.status(200).json({
            error: false,
            message: "Successfully get borrower info",
            data: {
                borrower_info: borrowerInfo
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BorrowersController.editBorrowerInfo = async (req, res, next) => {
    const borrowerCode = req.params.borrowerCode;
    const updateData = req.body.update_data;
    console.log(updateData);

    try {
        let book = await borrowerModel.findOneAndUpdate({
            student_code: borrowerCode
        }, updateData);
        if (book) {
            return res.status(200).json({
                error: false,
                message: "Successfully edited"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Borrower not found"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BorrowersController.deleteBorrower = async (req, res, next) => {
    const borrowerCode = req.params.borrowerCode;
    try {
        let borrower = await borrowerModel.findOneAndDelete({
            student_code: borrowerCode
        });
        if (borrower) {
            return res.status(200).json({
                error: false,
                message: "Successfully deleted"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Borrower not found"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

module.exports = BorrowersController;