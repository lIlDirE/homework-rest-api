const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth-controller")
const schemas = require("../../schemas/users");

const {validateContactsBody} = require("../../middlewares/validateContactsBody");

router.post("/signup", validateContactsBody(schemas.userRegisterSchema), authController.signup);

// router.post("/signin", validateContactsBody(schemas.userLoginSchema), authController.signin)

module.exports = router;