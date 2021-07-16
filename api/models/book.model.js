const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
	code: String,
	name: String,
	author: String,
	location: String,
	cost: Number,
	imported_time: Number,
	borrowed_history: {
		type: [{
			borrowed_time: Number,
			expired_time: Number,
			borrower: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Borrower"
			},
			responsible_person: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User"
			}
		}]
	},
	responsible_person: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	is_borrowed: Boolean,
	borrowed_times: Number,
	borrowed_time: Number,
	expired_time: Number,
	borrower: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Borrower"
	}
});

module.exports = mongoose.model('Book', bookSchema);