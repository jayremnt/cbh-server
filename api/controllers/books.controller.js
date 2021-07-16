const BookModel = require("../models/book.model");
const BorrowerModel = require("../models/borrower.model");

let BooksController = {};

BooksController.addBook = async (req, res, next) => {
    const bookInfo = req.body;
    console.log(bookInfo);
    try {
        let book = BookModel.findOne({
            code: bookInfo.code
        });
        console.log(book);
        if (book) {
            return res.status(200).json({
                error: true,
                message: "Book exists"
            });
        }
        let newBook = await BookModel.create(bookInfo);
        console.log(newBook);
        return res.status(200).json({
            error: false,
            message: "Added book"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BooksController.getAvailableBooks = async (req, res, next) => {
    try {
        let availableBooks = await BookModel.find({
            is_borrowed: false
        }).populate("responsible_person");
        console.log(availableBooks);
        return res.status(200).json({
            error: false,
            message: "Successfully get all available books",
            data: {
                list_available_books: availableBooks
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

BooksController.getAllBooks = async (req, res, next) => {
    try {
        let books = await BookModel.find({}).populate("responsible_person");
        console.log(books);
        return res.status(200).json({
            error: false,
            message: "Successfully get all books",
            data: {
                list_books: books
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

BooksController.getBookDetails = async (req, res, next) => {
    const bookCode = req.params.bookCode;
    try {
        let bookDetails = await BookModel.findOne({
            code: bookCode
        }).populate("responsible_person");
        console.log(bookDetails);
        return res.status(200).json({
            error: false,
            message: "Successfully get book details",
            data: {
                book_details: bookDetails
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

BooksController.borrowing = async (req, res, next) => {
    const bookCode = req.params.bookCode;
    const is_borrowed = true;
    const borrower = req.body.borrowerCode;
    const borrowed_time = req.body.borrowedTime;
    const expired_time = req.body.expiredTime;

    try {
        let book = await BookModel.findOneAndUpdate({
            code: bookCode
        }, {
            is_borrowed,
            borrower,
            borrowed_time,
            expired_time,
            $inc: {
                'borrowed_times': 1
            }
        })
        console.log(book);
        if (book) {
            let borrower = await BorrowerModel.findOneAndUpdate({
                code: borrower
            }, {
                $push: {
                    current_borrowed_books: book._id
                }
            });

            if (borrower) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully updated borrowed info"
                })
            }

            return res.status(200).json({
                error: false,
                message: "Borrower not found"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Book not found"
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            error: true,
            message: "Error occurred",
            data: e
        });
    }
}

BooksController.returnBook = async (req, res, next) => {
    const bookCode = req.params.bookCode;
    const borrower = req.body.borrowerCode;
    console.log(borrower);

    try {
        let book = await BookModel.findOneAndUpdate({
            code: bookCode
        }, {
            is_borrowed: false,
            borrower: "",
            borrowed_time: 0,
            expired_time: 0
        });
        if (book) {
            let updatedBorrower = await BorrowerModel.findOneAndUpdate({
                student_code: borrower
            }, {
                $pull: {
                    current_borrowed_books: {
                        _id: book._id
                    }
                }
            });
            if (updatedBorrower) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully updated borrowed info"
                })
            }

            return res.status(200).json({
                error: false,
                message: "Borrower not found"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Book not found"
        });
    } catch (e) {
        console.log(e);
        res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BooksController.editBook = async (req, res, next) => {
    const bookCode = req.params.bookCode;
    const updateData = req.body.update_data;
    console.log(updateData);
    try {
        let book = await BookModel.findOneAndUpdate({
            code: bookCode
        }, updateData);
        if (book) {
            return res.status(200).json({
                error: false,
                message: "Successfully edited"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Book not found"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

BooksController.deleteBook = async (req, res, next) => {
    const bookCode = req.params.bookCode;
    try {
        let book = await BookModel.findOneAndDelete({
            code: bookCode
        });
        console.log(book);
        if (book) {
            return res.status(200).json({
                error: false,
                message: "Successfully deleted"
            });
        }
        return res.status(200).json({
            error: true,
            message: "Book not found"
        });
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            error: true,
            message: "Error occurred"
        });
    }
}

module.exports = BooksController;