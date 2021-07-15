const mongoose = require('mongoose');

const borrowedBookSchema = mongoose.Schema({
	code: String,
	name: String,
	author: String,
	location: String,
	borrowed_time: Number,
	expired_time: Number,
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
	},
	responsible_person: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model('Borrower', borrowerSchema);