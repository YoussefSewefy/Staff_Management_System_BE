const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')

const validateViewAllSalaries = (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().required(),
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

const validateViewSalary = (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().required(),
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
const validateViewStaffSalary = (req, res, next) => {
  const schema = Joi.object({
    staffId: Joi.string().length(24).required(),
    month: Joi.number().min(1).max(12).required(),
    year: Joi.number().required(),
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
  validateViewAllSalaries,
  validateViewSalary,
  validateViewStaffSalary
}
