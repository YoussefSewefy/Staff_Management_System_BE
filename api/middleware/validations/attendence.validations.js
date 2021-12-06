const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const validManualSignIn = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24).required(),
    date: Joi.date().required(),
    time: Joi.string()
      .regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    attendenceId: Joi.string(),
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
const validManualSignOut = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24).required(),
    date: Joi.date().required(),
    time: Joi.string()
      .regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      .required(),
    attendenceId: Joi.string().required(),
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
const validateViewAll = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24),
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
module.exports = { validManualSignIn, validManualSignOut, validateViewAll }
