const Trace = require("../models/trace.model");

let TraceController = {};

TraceController.createTrace = async (traceInfo) => {
	try {
		let newTrace = await Trace.create({
			is_extend: traceInfo.isExtend,
			is_borrowing: traceInfo.isBorrowing,
			is_return: traceInfo.isReturn,
			extended_times: traceInfo.extendedTimes,
			borrowed_time: traceInfo.borrowedTime,
			expired_time: traceInfo.expiredTime,
			book: traceInfo.bookId,
			borrower: traceInfo.borrower,
			responsible_person: traceInfo.responsiblePerson,
			created_time: new Date().getTime()
		});
		return newTrace;
	}
	catch (e) {
		console.log(e);
		return false;
	}
}

TraceController.deleteBookTraces = async (bookId) => {
	try {
		let newTrace = await Trace.deleteMany({
			book: bookId
		});
		console.log(newTrace);
		return true;
	}
	catch (e) {
		console.log(e);
		return false;
	}
}

TraceController.deleteBorrowerTraces = async (borrowerId) => {
	try {
		let newTrace = await Trace.deleteMany({
			borrower: borrowerId
		});
		console.log(newTrace);
		return true;
	}
	catch (e) {
		console.log(e);
		return false;
	}
}

module.exports = TraceController;
