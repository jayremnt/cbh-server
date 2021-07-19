const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  code: String,
  name: String,
  author: String,
  location: String,
  cost: Number,
  imported_time: Number,
  borrowed_times: Number,
  borrowed_history: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Trace"
  },
  responsible_person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  borrowed_info: {
    type: [{
      is_borrowed: Boolean,
      borrowed_time: Number,
      expired_time: Number,
      extended_times: Number,
      borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Borrower"
      },
      responsible_person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }]
  }
});

module.exports = mongoose.model('Book', bookSchema);