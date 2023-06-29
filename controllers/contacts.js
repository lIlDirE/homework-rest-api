const { ctrlWrapper } = require("../helpers");
const { Contact } = require("../models/contact");
const { HttpError } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt");
  res.status(200).json(result);
};

const addContact = async (req, res) => {
  const { email } = req.body;
  const user = await Contact.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const getContactById = async (req, res) => {
  const id = req.params.contactId;
  const result = await Contact.findById({ _id: id });
  if (!result) {
    return res.status(404).json({ message: "Not Found" });
  }
  res.status(200).json(result);
};

const updateContact = async (req, res) => {
  const id = req.params.contactId;
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "missing fields" });
  }
  const result = await Contact.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!result) {
    throw res.status(404).json({ message: `Not found` });
  }
  res.json(result);
};

const updateFavorite = async (req, res) => {
  const id = req.params.contactId;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  console.log(!result);
  if (!result) {
    return res.status(404).json({ message: `Not found` });
  }
  res.json(result);
};

const removeContact = async (req, res) => {
  const id = req.params.contactId;
  const result = await Contact.findByIdAndDelete(id, req.body, {
    new: true,
  });
  if (!result) {
    throw res.status(404).json({ message: `Not found` });
  }
  res.status(200).json({ message: "contact deleted" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
  updateFavorite: ctrlWrapper(updateFavorite),
};
