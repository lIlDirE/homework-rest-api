const Joi = require("joi");

const userRegisterSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const userEmailSchema = Joi.object({
    email: Joi.string().required(),
})

module.exports = {
    userRegisterSchema,
    userLoginSchema,
	userEmailSchema,
}