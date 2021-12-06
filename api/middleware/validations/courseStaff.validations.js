const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { requestStatus } = require('../../constants/enums')

const validateViewCourseStaff = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
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

const validateAssignInstructor = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
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

const validateDeleteInstructor = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
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
const validateUpdateInstructor = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
    staffId: Joi.string().length(24).required(),
    newStaffId: Joi.string().length(24).required(),
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
const validateAssignStaff = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
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
const validateDeleteStaff = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
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
module.exports = {
  validateViewCourseStaff,
  validateUpdateInstructor,
  validateDeleteStaff,
  validateDeleteInstructor,
  validateAssignStaff,
  validateAssignInstructor,
}
