const mongoose = require('mongoose');

const TraceSchema = mongoose.Schema({
  is_extend: Boolean,
  is_return: Boolean,
  is_borrowing: Boolean,
  extended_times: Number,
  borrowed_time: Number,
  expired_time: Number,
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Borrower"
  },
  responsible_person: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model('Trace', TraceSchema);