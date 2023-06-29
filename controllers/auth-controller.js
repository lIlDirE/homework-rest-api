require("dotenv").config();

const gravatar = require("gravatar");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jimp = require("jimp");
const fs = require("fs");
const { nanoid } = require("nanoid");
const path = require("path");
const destination = path.resolve("public/avatars");
const { HttpError, ctrlWrapper, emailSender } = require("../helpers");
const { SECRET_KEY, BASE_URL } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const imgLink = gravatar.url(email);
  const modifiedUrl = `https://${imgLink.slice(imgLink.indexOf(".") + 1)}`;

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: modifiedUrl,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
  };

  await emailSender(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: modifiedUrl,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
	throw HttpError(401, "Email not verified");
   }
  
  const { _id: id } = user;
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(id, { token });
  res.status(200).json({
    token: token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const avatarUpdate = async (req, res) => {
  const { _id } = req.user;
  const image = await jimp.read(req.file.path);
  image.resize(250, 250);

  fs.unlinkSync(req.file.path);

  const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const { originalname } = req.file;
  const filename = `${uniquePrefix}_${originalname}`;

  const newFilePath = path.join(destination, filename);
  await image.writeAsync(newFilePath);

  const newAvatarUrl = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL: newAvatarUrl });
  console.log(newAvatarUrl);

  res.json({
    newAvatarUrl,
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.status(200).json({ message: "Verification successful" });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await emailSender(verifyEmail);

  res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  avatarUpdate: ctrlWrapper(avatarUpdate),
  verify: ctrlWrapper(verify),
  resendEmail: ctrlWrapper(resendEmail),
};
