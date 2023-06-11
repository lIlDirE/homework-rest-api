const express = require("express");
const router = express.Router();

const {	userRegisterSchema } = require("../../models/users")
const {validateContactsBody} = require("../../middlewares/validateContactsBody");


router.post("/signup", validateContactsBody(userRegisterSchema	))

module.exports = router;