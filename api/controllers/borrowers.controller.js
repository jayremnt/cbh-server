const borrowerModel = require('../models/borrower.model');

exports.addBorrower = (req, res, next) => {
	const borrowerInfo = req.body;
	borrowerModel.findOne({
		student_code: borrowerInfo.student_code
	}).exec().then(borrower => {
		console.log(borrower);
		if (borrower) {
			return res.status(200).json({
				error: true,
				message: "Borrower exists"
			});
		}
		borrowerModel.create(borrowerInfo, (err, result) => {
			if (err) {
				console.log(err);
				return res.status(200).json({
					error: true,
					message: err
				});
			}
			console.log(result);
			return res.status(200).json({
				error: false,
				message: "Added borrower"
			});
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

exports.getAllBorrowers = (req, res, next) => {
	borrowerModel.find({}).populate("responsible_person").populate("current_borrowed_books.responsible_person").then(borrowers => {
		console.log(borrowers);
		return res.status(200).json({
			error: false,
			message: "Successfully get all borrowers",
			data: {
				list_borrowers: borrowers
			}
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

exports.getBorrowerInfo = (req, res, next) => {
	const borrowerCode = req.params.borrowerCode;

	borrowerModel.findOne({
		student_code: borrowerCode
	}).populate("responsible_person").populate("current_borrowed_books.responsible_person").then(borrowerInfo => {
		console.log(borrowerInfo);
		if (!borrowerInfo) {
			return res.status(200).json({
				error: true,
				message: "Borrower not found"
			});
		}
		return res.status(200).json({
			error: false,
			message: "Successfully get borrower info",
			data: {
				borrower_info: borrowerInfo
			}
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

exports.editBorrowerInfo = (req, res, next) => {
	const borrowerCode = req.params.borrowerCode;
	const updateData = req.body.update_data;
	console.log(updateData);
	borrowerModel.findOneAndUpdate({
		student_code: borrowerCode
	}, updateData).then(book => {
		if(book) {
			return res.status(200).json({
				error: false,
				message: "Successfully edited"
			});
		}
		return res.status(200).json({
			error: true,
			message: "Borrower not found"
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}

exports.deleteBorrower = (req, res, next) => {
	const borrowerCode = req.params.borrowerCode;
	borrowerModel.findOneAndDelete({
		student_code: borrowerCode
	}).then(borrower => {
		if(borrower) {
			return res.status(200).json({
				error: false,
				message: "Successfully deleted"
			});
		}
		return res.status(200).json({
			error: true,
			message: "Borrower not found"
		});
	}).catch(err => {
		console.log(err);
		return res.status(200).json({
			error: true,
			message: err
		});
	});
}