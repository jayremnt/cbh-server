const BookModel = require("../models/book.model");

let BooksController = {};

BooksController.addBook = (req, res, next) => {
	const bookInfo = req.body;
	console.log(bookInfo);
	BookModel.findOne({
		code: bookInfo.code
	}).exec().then(book => {
		console.log(book);
		if (book) {
			return res.status(200).json({
				error: true,
				message: "Book exists"
			});
		}
		BookModel.create(bookInfo, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(200).json({
					error: true,
					message: err
				});
			}
			console.log(result);
			return res.status(200).json({
				error: false,
				message: "Added book"
			});
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

BooksController.getAvailableBooks = (req, res, next) => {
	BookModel.find({
		is_borrowed: false
	}).populate("responsible_person").then(availableBooks => {
		console.log(availableBooks);
		return res.status(200).json({
			error: false,
			message: "Successfully get all available books",
			data: {
				list_available_books: availableBooks
			}
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

BooksController.getAllBooks = (req, res, next) => {
	BookModel.find({}).populate("responsible_person").then(books => {
		console.log(books);
		return res.status(200).json({
			error: false,
			message: "Successfully get all books",
			data: {
				list_books: books
			}
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

BooksController.getBookDetails = (req, res, next) => {
	const bookCode = req.params.bookCode;
	BookModel.findOne({
		code: bookCode
	}).populate("responsible_person").then(bookDetails => {
		console.log(bookDetails);
		return res.status(200).json({
			error: false,
			message: "Successfully get book details",
			data: {
				book_details: bookDetails
			}
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

BooksController.borrowing = (req, res, next) => {
	const bookCode = req.params.bookCode;
	const borrower = req.params.borrowerCode;
	const borrowed_time = req.params.borrowedTime;

	BookModel.findOneAndUpdate({
		code: bookCode
	}, {

	})
}

BooksController.editBook = (req, res, next) => {
	const bookCode = req.params.bookCode;
	const updateData = req.body.update_data;
	console.log(updateData);
	BookModel.findOneAndUpdate({
		code: bookCode
	}, updateData).then(book => {
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
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

BooksController.deleteBook = (req, res, next) => {
	const bookCode = req.params.bookCode;
	BookModel.findOneAndDelete({
		code: bookCode
	}).then(book => {
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
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

module.exports = BooksController;