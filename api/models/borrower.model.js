const mongoose = require('mongoose');

const borrowedBookSchema = mongoose.Schema({
	book_code: String,
	borrowed_start_date: Date,
	borrowed_expired_date: Date,
	extended_times: Number,
	responsible_person: String,
});

const borrowerSchema = mongoose.Schema({
	name: String,
	class: String,
	student_code: String,
	phone_number: String,
	email: String,
	borrow_times: Number,
	previous_borrowed_books: {
		type: [borrowedBookSchema],
		require: false
	},
	current_borrowed_books: {
		type: [borrowedBookSchema],
		require: true
	}
});

module.exports = mongoose.model('Borrower', borrowerSchema);