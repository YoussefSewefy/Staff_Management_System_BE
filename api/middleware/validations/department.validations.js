const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')

const validateAddDepartment = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    HODId: Joi.string().length(24),
    facultyId: Joi.string().length(24).required(),
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
const validateupdateDepartment = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string(),
    HODId: Joi.string().length(24),
    facultyId: Joi.string().length(24),
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
const validateDeleteDepartment = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
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
  validateAddDepartment,
  validateupdateDepartment,
  validateDeleteDepartment,
}
