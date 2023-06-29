const handleMongooseError = (error, date, next) => {
	const {code, name} = error;
	error.status = (code === 11000 && name === "MongoServerError") ? 409 : 400;
	next();
}

module.exports = {
	handleMongooseError,
}