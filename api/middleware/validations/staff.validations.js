const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { staffType, gender, day } = require('../../constants/enums')
const valdiateLogIn = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateAddStaff = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(4).required(),
    officeLocation: Joi.string().required().length(24),
    salary: Joi.number().required(),
    gender: Joi.string().valid(gender.MALE, gender.FEMALE),
    type: Joi.string()
      .valid(staffType.HOD, staffType.HR, staffType.INSTRUCTOR, staffType.TA)
      .required(),
    department: Joi.string().length(24),
    dayOff: Joi.string()
      .valid(
        day.SATURDAY,
        day.SUNDAY,
        day.MONDAY,
        day.TUESDAY,
        day.WEDNESDAY,
        day.THURSDAY
      )
      .required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateDeleteStaff = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24).required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateResetPassword = (req, res, next) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateResetPasswordHR = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24).required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateUpdateSalary = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    salary: Joi.number().required(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateupdateMyProfile = (req, res, next) => {
  const schema = Joi.object({
    gender: Joi.string().valid(gender.MALE, gender.FEMALE),
    email: Joi.string().email(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}
const validateupdateProfile = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().required(),
    gender: Joi.string().valid(gender.MALE, gender.FEMALE),
    email: Joi.string().email(),
    dayOff: Joi.string().valid(
      day.SATURDAY,
      day.SUNDAY,
      day.MONDAY,
      day.TUESDAY,
      day.WEDNESDAY,
      day.THURSDAY
    ),
    salary: Joi.number(),
    department: Joi.string(),
    name: Joi.string(),
  })
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}

module.exports = {
  valdiateLogIn,
  validateAddStaff,
  validateDeleteStaff,
  validateResetPassword,
  validateResetPasswordHR,
  validateUpdateSalary,
  validateupdateMyProfile,
  validateupdateProfile,
}
