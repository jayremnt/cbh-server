const mongoose = require('mongoose');

const borrowerSchema = mongoose.Schema({
	name: String,
	class: String,
	student_code: String,
	phone_number: String,
	email: String,
	borrow_times: Number,
	previous_borrowed_books: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book"
		}],
		require: false
	},
	current_borrowed_books: {
		type: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Book"
		}],
		require: true
	}
});

module.exports = mongoose.model('Borrower', borrowerSchema);