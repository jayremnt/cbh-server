const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
	code: String,
	name: String,
	author: String,
	location: String,
	cost: Number,
	imported_time: Number,
	responsible_person: String,
	is_borrowed: Boolean,
	borrowed_times: Number,
	borrower: String
});

module.exports = mongoose.model('Book', bookSchema);