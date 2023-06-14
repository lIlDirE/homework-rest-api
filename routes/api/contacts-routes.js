const express = require("express");
const router = express.Router();
const {isValidId, validateContactsBody, authenticate} = require("../../middlewares");

const {schemas} = require("../../models/contact")
const {
	getAll,
	getContactById,
	addContact,
	removeContact,
	updateContact,
	updateFavorite,
 } = require("../../controllers/contacts");

router.use(authenticate);

router.get("/", getAll);
router.get("/:contactId", isValidId, getContactById);
router.post("/", validateContactsBody(schemas.contactsAddSchema), addContact);
router.delete("/:contactId", isValidId, removeContact);
router.put("/:contactId", validateContactsBody(schemas.contactsAddSchema), isValidId, updateContact);
router.patch("/:contactId/favorite", validateContactsBody(schemas.updateFavoriteSchema), updateFavorite)


module.exports = router;
