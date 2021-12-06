const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')

const validateAddFaculty = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    numberOfStudents: Joi.number(),
    building: Joi.string(),
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
const validateupdateFaculty = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    name: Joi.string(),
    numberOfStudents: Joi.number(),
    building: Joi.string(),
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
const validateDeleteFaculty = (req, res, next) => {
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
  validateAddFaculty,
  validateupdateFaculty,
  validateDeleteFaculty,
}
