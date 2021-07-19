const BookModel = require("../models/book.model");
const BorrowerModel = require("../models/borrower.model");
const TraceController = require("./trace.controller");

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
			borrowed_times: 0,
			borrowed_info: [{
				is_borrowed: false,
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
			$or: [{
				"borrowed_info": []
			}, {
				"borrowed_info.0.is_borrowed": false
			}]
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
					is_borrowed: book.borrowed_info[0] ? book.borrowed_info[0].is_borrowed : false
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
		}).populate("responsible_person");
		console.log(bookDetails);
		if (bookDetails) {
			if (bookDetails.borrowed_info[0] && bookDetails.borrowed_info[0].is_borrowed) {
				bookDetails = await BookModel.findOne({
					code: bookCode
				}).populate("responsible_person").populate("borrowed_info.borrower").populate("borrowed_info.responsible_person");
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

BooksController.getBookTrace = async (req, res, next) => {
    const bookCode = req.params.bookCode;

    try {
        let bookInfo = await BookModel.findOne({
            code: bookCode
        }).populate({
            path: "borrowed_history",
            populate: {
                path: "borrower"
            }
        }).populate({
            path: "borrowed_history",
            populate: {
                path: "responsible_person"
            }
        });

        if (!bookInfo) {
            return res.status(200).json({
                error: true,
                message: "Book not found"
            });
        }
        return res.status(200).json({
            error: false,
            message: "Successfully get book trace",
            data: {
                trace: bookInfo.borrowed_history
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
	const borrowerId = req.body.borrowerId;
	const borrowedTime = req.body.borrowedTime;
	const expiredTime = req.body.expiredTime;
	const responsiblePerson = req.body.responsiblePerson;

	const isBorrowed = true;

	try {
		let book = await BookModel.findOne({
			code: bookCode
		});

		if (!book) {
			return res.status(200).json({
				error: true,
				message: "Book not found"
			});
		}

		if (book.borrowed_info[0] && book.borrowed_info[0].is_borrowed) {
			return res.status(200).json({
				error: true,
				message: "Book was borrowed"
			})
		}

		let trace = await TraceController.createTrace({
			bookId: book._id,
			isBorrowing: true,
			extendedTimes: 0,
			borrowedTime: borrowedTime,
			expiredTime: expiredTime,
			borrower: borrowerId,
			responsiblePerson: responsiblePerson
		});

		if (!trace) {
			return res.status(200).json({
				error: true,
				message: "Could not create trace"
			})
		}

		let updatedBorrower = await BorrowerModel.findOneAndUpdate({
			_id: borrowerId
		}, {
			$inc: {
				borrowed_books_amount: 1
			},
			$push: {
				current_borrowed_books: trace._id,
				previous_borrowed_books: trace._id
			}
		});

		if (!updatedBorrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}

		let updatedBook = await BookModel.findOneAndUpdate({
			code: bookCode
		}, {
			"borrowed_info.0.is_borrowed": isBorrowed,
			"borrowed_info.0.borrowed_time": borrowedTime,
			"borrowed_info.0.expired_time": expiredTime,
			"borrowed_info.0.extended_times": 0,
			"borrowed_info.0.borrower": borrowerId,
			"borrowed_info.0.responsible_person": responsiblePerson,
			$inc: {
				borrowed_times: 1
			},
			$push: {
				borrowed_history: trace._id,
			}
		});

		return res.status(200).json({
			error: false,
			message: "Successfully updated",
			data: {
				book: updatedBook
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

		if (!returnBook) {
			return res.status(200).json({
				error: true,
				message: "Book not found"
			});
		}

		if (!returnBook.borrowed_info[0] || !returnBook.borrowed_info[0].is_borrowed) {
			return res.status(200).json({
				error: true,
				message: "Book is not borrowed"
			});
		}

		let borrower = await BorrowerModel.findOne({
			_id: returnBook.borrowed_info[0].borrower
		}).populate("current_borrowed_books");

		if (!borrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}
		// console.log(book._id);
		// console.log(borrower.current_borrowed_books[2].book);

		const returnedBookIndex = borrower.current_borrowed_books.findIndex(currentBook => currentBook.book.toString() === returnBook._id.toString());
		console.log(returnedBookIndex);
		console.log(returnBook.borrowed_info[0]);

		let trace = await TraceController.createTrace({
			bookId: returnBook._id,
			isReturn: true,
			extendedTimes: returnBook.borrowed_info[0].extended_times,
			borrowedTime: returnBook.borrowed_info[0].borrowed_time,
			expiredTime: returnBook.borrowed_info[0].expired_time,
			borrower: borrower._id,
			responsiblePerson: responsiblePerson
		});

		if (!trace) {
			return res.status(200).json({
				error: true,
				message: "Could not create trace"
			});
		}

		await BookModel.updateOne({
			code: bookCode
		}, {
			$push: {
				borrowed_history: trace._id,
			},
			borrowed_info: []
		});

		let updatedBorrower = await BorrowerModel.updateOne({
			_id: returnBook.borrowed_info[0].borrower
		}, {
			$pull: {
				current_borrowed_books: borrower.current_borrowed_books[returnedBookIndex]._id
			},
			$push: {
				previous_borrowed_books: trace._id
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
	catch (e) {
		console.log(e);
		res.status(200).json({
			error: true,
			message: "Error occurred"
		});
	}
}

BooksController.extendBook = async (req, res, next) => {
	const bookCode = req.params.bookCode;
	const isBorrowed = true;
	const borrowedTime = req.body.borrowedTime;
	const expiredTime = req.body.expiredTime;
	const responsiblePerson = req.body.responsiblePerson;

	try {
		let book = await BookModel.findOne({
			code: bookCode
		});

		if (!book) {
			return res.status(200).json({
				error: true,
				message: "Book not found"
			});
		}

		if (!book.borrowed_info[0] || !book.borrowed_info[0].is_borrowed) {
			return res.status(200).json({
				error: true,
				message: "Book is not borrowed"
			});
		}

		let borrower = await BorrowerModel.findOne({
			_id: book.borrowed_info[0].borrower
		}).populate("current_borrowed_books");

		console.log(borrower);

		if (!borrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}
		// console.log(book._id);
		// console.log(borrower.current_borrowed_books[2].book);

		const extendedBookIndex = borrower.current_borrowed_books.findIndex(currentBook => currentBook.book.toString() === book._id.toString());
		console.log(extendedBookIndex);

		let trace = await TraceController.createTrace({
			bookId: book._id,
			isExtend: true,
			extendedTimes: borrower.current_borrowed_books[extendedBookIndex].extended_times + 1,
			borrowedTime: borrowedTime,
			expiredTime: expiredTime,
			borrower: borrower._id,
			responsiblePerson: responsiblePerson
		});

		if (!trace) {
			return res.status(200).json({
				error: true,
				message: "Could not create trace"
			})
		}

		console.log(trace);
		console.log(borrower.current_borrowed_books[extendedBookIndex]._id);

		await BorrowerModel.updateOne({
			_id: borrower._id
		}, {
			$inc: {
				borrowed_books_amount: 1
			},
			$pull: {
				current_borrowed_books: borrower.current_borrowed_books[extendedBookIndex]._id
			},
			$push: {
				previous_borrowed_books: borrower.current_borrowed_books[extendedBookIndex]._id
			}
		});

		await BorrowerModel.updateOne({
			_id: borrower._id
		}, {
			$push: {
				current_borrowed_books: trace._id
			}
		});

		await BookModel.findOneAndUpdate({
			code: bookCode
		}, {
			"borrowed_info.0.is_borrowed": isBorrowed,
			"borrowed_info.0.borrower": borrower._id,
			"borrowed_info.0.borrowed_time": borrowedTime,
			"borrowed_info.0.expired_time": expiredTime,
			"borrowed_info.0.responsible_person": responsiblePerson,
			$inc: {
				borrowed_times: 1,
				"borrowed_info.0.extended_times": 1
			},
			$push: {
				borrowed_history: trace._id
			}
		});

		return res.status(200).json({
			error: false,
			message: "Successfully extended"
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