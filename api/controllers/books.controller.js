const BookModel = require("../models/book.model");
const BorrowerModel = require("../models/borrower.model");

let BooksController = {};

BooksController.addBook = async (req, res, next) => {
	const bookInfo = req.body;
	try {
		let book = await BookModel.findOne({
			code: bookInfo.code
		});
		console.log(book);
		if (book) {
			return res.status(200).json({
				error: true,
				message: "Book exists"
			});
		}
		let newBook = await BookModel.create({
			author: bookInfo.author,
			code: bookInfo.code,
			cost: bookInfo.cost,
			imported_time: bookInfo.imported_time,
			location: bookInfo.location,
			name: bookInfo.name,
			responsible_person: bookInfo.responsible_person,
			borrowed_info: {
				is_borrowed: false,
				borrowed_times: 0,
				borrowed_time: 0,
				expired_time: 0,
				borrower: "",
				responsible_person: ""
			}
		});
		console.log(newBook);
		return res.status(200).json({
			error: false,
			message: "Added book",
			data: {
				book: newBook
			}
		});
	}
	catch (e) {
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
	}
	catch (e) {
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
	}
	catch (e) {
		console.log(e);
		return res.status(200).json({
			error: true,
			message: "Error occurred"
		});
	}
}

BooksController.isBorrowed = async (req, res, next) => {
	const bookCode = req.params.bookCode;
	try {
		let book = await BookModel.findOne({
			code: bookCode
		});
		console.log(book);
		if (book) {
			return res.status(200).json({
				error: false,
				message: "Found book",
				data: {
					is_borrowed: book.borrowed_info.is_borrowed
				}
			});
		}
		return res.status(200).json({
			error: true,
			message: "Book not found"
		});
	}
	catch (e) {
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
		});
		console.log(bookDetails);
		if (bookDetails) {
			if (bookDetails.borrowed_info.is_borrowed) {
				bookDetails = await BookModel.findOne({
					code: bookCode
				}).populate("borrowed_info.borrower").populate("borrowed_info.responsible_person");
			}
			return res.status(200).json({
				error: false,
				message: "Successfully get book details",
				data: {
					book_details: bookDetails
				}
			});
		}
		return res.status(200).json({
			error: true,
			message: "Book not found"
		});
	}
	catch (e) {
		console.log(e);
		return res.status(200).json({
			error: true,
			message: "Error occurred"
		});
	}
}

BooksController.borrowing = async (req, res, next) => {
	const bookCode = req.params.bookCode;
	const bookId = req.body.bookId;
	const isBorrowed = true;
	const borrowerId = req.body.borrowerId;
	const borrowedTime = req.body.borrowedTime;
	const expiredTime = req.body.expiredTime;
	const responsiblePerson = req.body.responsiblePerson;

	try {
		let updatedBorrower = await BorrowerModel.findOneAndUpdate({
			_id: borrowerId
		}, {
			$push: {
				current_borrowed_books: {
					book: bookId,
					responsible_person: responsiblePerson
				}
			}
		});
		console.log(updatedBorrower);

		if (!updatedBorrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}

		let book = await BookModel.findOneAndUpdate({
			_id: bookId
		}, {
			borrowed_info: {
				is_borrowed: isBorrowed,
				borrower: borrowerId,
				borrowed_time: borrowedTime,
				expired_time: expiredTime,
				$inc: {
					'borrowed_times': 1
				}
			}
		})
		console.log(book);
		if (!book) {
			return res.status(200).json({
				error: true,
				message: "Book not found"
			});
		}
		return res.status(200).json({
			error: false,
			message: "Successfully updated",
			data: {
				book: book
			}
		});
	}
	catch (e) {
		console.log(e);
		res.status(200).json({
			error: true,
			message: "Error occurred"
		});
	}
}

BooksController.returnBook = async (req, res, next) => {
	const bookCode = req.params.bookCode;
	const bookId = req.body.bookId;
	const borrowerId = req.body.borrowerId;

	try {
		let book = await BookModel.findOneAndUpdate({
			_id: bookId
		}, {
			is_borrowed: false,
			borrower: "",
			borrowed_time: 0,
			expired_time: 0
		});
		if (book) {
			let updatedBorrower = await BorrowerModel.findOneAndUpdate({
				_id: borrowerId
			}, {
				$pull: {
					current_borrowed_books: {
						_id: bookId
					}
				},
				$push: {
					previous_borrowed_books: bookId
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
	}
	catch (e) {
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
	}
	catch (e) {
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
	}
	catch (e) {
		console.log(e);
		return res.status(200).json({
			error: true,
			message: "Error occurred"
		});
	}
}

module.exports = BooksController;