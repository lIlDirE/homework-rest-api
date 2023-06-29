const multer = require("multer");
const path = require("path");

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
	destination,
	filename:  (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({
	storage
})

module.exports = {upload}