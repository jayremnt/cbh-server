const BorrowerModel = require('../models/borrower.model');
const TraceController = require("./trace.controller");

let BorrowersController = {};

BorrowersController.addBorrower = async (req, res, next) => {
  const borrowerInfo = req.body;
  try {
    let borrower = await BorrowerModel.findOne({
      student_code: borrowerInfo.student_code
    });
    console.log(borrower);
    if (borrower) {
      return res.status(200).json({
        error: true,
        message: "Borrower exists"
      });
    }
    let newBorrower = await BorrowerModel.create({
      name: borrowerInfo.name,
      class: borrowerInfo.class,
      student_code: borrowerInfo.student_code,
      phone_number: borrowerInfo.phone_number,
      email: borrowerInfo.email,
    });
    console.log(newBorrower);
    return res.status(200).json({
      error: false,
      message: "Created borrower",
      data: {
        borrower: newBorrower
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

BorrowersController.getAllBorrowers = async (req, res, next) => {
  try {
    let borrowers = await BorrowerModel.find({}).populate({
      path: "current_borrowed_books"
    });
    let newBorrowers = JSON.parse(JSON.stringify(borrowers));

    borrowers.forEach((borrower, i) => {
      let listExpiredTimes = [];
      borrower.current_borrowed_books.forEach(book => {
        listExpiredTimes = book.expired_time;
      });
      newBorrowers[i].current_borrowed_books = borrower.current_borrowed_books.map(book => book._id);
      newBorrowers[i].min_expired_time = Math.min(listExpiredTimes);
    });

    console.log('borrowers....', newBorrowers);

    return res.status(200).json({
      error: false,
      message: "Successfully get all borrowers",
      data: {
        list_borrowers: newBorrowers
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

BorrowersController.getBorrowingBorrowers = async (req, res, next) => {
  try {
    let borrowers = await BorrowerModel.find({
      "current_borrowed_books.0": {
        $exists: true
      }
    }).populate({
      path: "current_borrowed_books"
    });
    console.log(borrowers);

    let newBorrowers = JSON.parse(JSON.stringify(borrowers));

    borrowers.forEach((borrower, i) => {
      let listExpiredTimes = [];
      borrower.current_borrowed_books.forEach(book => {
        listExpiredTimes = book.expired_time;
      });
      newBorrowers[i].current_borrowed_books = borrower.current_borrowed_books.map(book => book._id);
      newBorrowers[i].min_expired_time = Math.min(listExpiredTimes);
    });

    console.log('borrowers....', newBorrowers);

    return res.status(200).json({
      error: false,
      message: "Successfully get all borrowing borrowers",
      data: {
        list_borrowers: newBorrowers
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
    let borrowerInfo = await BorrowerModel.findOne({
      student_code: borrowerCode
    }).populate({
      path: "current_borrowed_books",
      populate: {
        path: "book"
      }
    }).populate({
      path: "current_borrowed_books",
      populate: {
        path: "responsible_person"
      }
    });
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

BorrowersController.getBorrowerTrace = async (req, res, next) => {
  const borrowerCode = req.params.borrowerCode;

  try {
    let borrowerInfo = await BorrowerModel.findOne({
      student_code: borrowerCode
    }).populate({
      path: "previous_borrowed_books",
      populate: {
        path: "book"
      }
    }).populate({
      path: "previous_borrowed_books",
      populate: {
        path: "responsible_person"
      }
    });
    // console.log(borrowerInfo);
    if (!borrowerInfo) {
      return res.status(200).json({
        error: true,
        message: "Borrower not found"
      });
    }
    return res.status(200).json({
      error: false,
      message: "Successfully get borrower trace",
      data: {
        trace: borrowerInfo.previous_borrowed_books
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
  const updateData = JSON.parse(req.body.update_data);
  console.log(updateData);

  try {
    let book = await BorrowerModel.findOneAndUpdate({
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
    let borrower = await BorrowerModel.findOneAndDelete({
      student_code: borrowerCode
    });
    if (borrower) {
      let isTraceDeleted = await TraceController.deleteBorrowerTraces(borrower._id);

      if (isTraceDeleted) {
        return res.status(200).json({
          error: false,
          message: "Successfully deleted"
        });
      }
      return res.status(200).json({
        error: true,
        message: "Borrower deleted but failed to delete borrower traces"
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
