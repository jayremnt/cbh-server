const mongoose = require('mongoose');

const borrowerSchema = mongoose.Schema({
	name: String,
	class: String,
	student_code: String,
	phone_number: String,
	email: String,
	borrow_times: Number,
	borrowed_books_amount: Number,
	previous_borrowed_books: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Trace",
		require: true
	},
	current_borrowed_books: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Trace",
		require: true
	}
});

module.exports = mongoose.model('Borrower', borrowerSchema);