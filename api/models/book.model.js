const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
	code: {
		type: String,
		require: true
	},
	name: {
		type: String,
		require: true
	},
	author: {
		type: String,
		require: true
	},
	location: {
		type: String,
		require: true
	},
	cost: {
		type: Number,
		require: true
	},
	imported_date: {
		type: Date,
		require: true
	},
	responsible_person: {
		type: String,
		require: true
	},
	is_borrowed: {
		type: Boolean,
		require: true
	}
});

module.exports = mongoose.model('Book', bookSchema);