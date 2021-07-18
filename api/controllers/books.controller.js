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
			borrowed_info: [{
				is_borrowed: false,
				borrowed_times: 0,
				borrowed_time: 0,
				expired_time: 0
			}]
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
			"borrowed_info.0.is_borrowed": false
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
					is_borrowed: book.borrowed_info[0].is_borrowed
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
			if (bookDetails.borrowed_info[0].is_borrowed) {
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
					borrowed_time: borrowedTime,
					expired_time: expiredTime,
					responsible_person: responsiblePerson
				}
			}
		});

		if (!updatedBorrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}

		let book = await BookModel.findOneAndUpdate({
			code: bookCode
		}, {
			"borrowed_info.0.is_borrowed": isBorrowed,
			"borrowed_info.0.borrowed_time": borrowedTime,
			"borrowed_info.0.expired_time": expiredTime,
			"borrowed_info.0.borrower": borrowerId,
			"borrowed_info.0.responsible_person": responsiblePerson,
			$inc: {
				"borrowed_info.0.borrowed_times": 1
			}
		});
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
	const responsiblePerson = req.body.responsiblePerson;

	try {
		let returnBook = await BookModel.findOne({
			code: bookCode
		});
		if (returnBook) {
			if (!returnBook.borrowed_info[0].is_borrowed) {
				return res.status(200).json({
					error: true,
					message: "Book is not borrowed"
				});
			}
			console.log(returnBook);
			let book = await BookModel.findOneAndUpdate({
				code: bookCode
			}, {
				$push: {
					borrowed_history: returnBook.borrowed_info[0],
				},
				borrowed_info: []
			});
			let updatedBorrower = await BorrowerModel.findOneAndUpdate({
				_id: returnBook.borrowed_info[0].borrower
			}, {
				$pull: {
					current_borrowed_books: {
						book: returnBook._id
					}
				},
				$push: {
					previous_borrowed_books: {
						book: returnBook._id,
						borrowed_time: returnBook.borrowed_info[0].borrowed_time,
						expired_time: returnBook.borrowed_info[0].expired_time,
						responsible_person: responsiblePerson
					}
				}
			});
			if (updatedBorrower) {
				return res.status(200).json({
					error: false,
					message: "Successfully returned book"
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