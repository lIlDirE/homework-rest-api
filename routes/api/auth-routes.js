const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth-controller")
const schemas = require("../../schemas/users");
const {authenticate, validateContactsBody} = require("../../middlewares") 
const {upload} = require("../../helpers")

router.post("/register", validateContactsBody(schemas.userRegisterSchema), authController.register);
router.post("/login", validateContactsBody(schemas.userLoginSchema), authController.login);
router.post("/logout", authenticate, authController.logout)
router.get("/current", authenticate, authController.getCurrent);
router.patch("/avatars", upload.single("avatar"), authenticate, authController.avatarUpdate)
module.exports = router;