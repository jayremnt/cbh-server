const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
	code: String,
	name: String,
	author: String,
	location: String,
	cost: Number,
	imported_date: Date,
	responsible_person: String,
	is_borrowed: Boolean
});

module.exports = mongoose.model('Book', bookSchema);