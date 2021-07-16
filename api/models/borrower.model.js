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
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            },
            responsible_person: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
        require: false
    },
    current_borrowed_books: {
        type: [{
            book: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book"
            },
            responsible_person: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }],
        require: true
    }
});

module.exports = mongoose.model('Borrower', borrowerSchema);