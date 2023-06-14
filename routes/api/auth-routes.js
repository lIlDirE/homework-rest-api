const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth-controller")
const schemas = require("../../schemas/users");
const {authenticate} = require("../../middlewares")

const {validateContactsBody} = require("../../middlewares/validateContactsBody");

router.post("/register", validateContactsBody(schemas.userRegisterSchema), authController.register);
router.post("/login", validateContactsBody(schemas.userLoginSchema), authController.login);
router.post("/logout", authenticate, authController.logout)
router.get("/current", authenticate, authController.getCurrent);
module.exports = router;