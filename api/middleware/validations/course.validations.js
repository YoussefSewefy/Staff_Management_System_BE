const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { requestStatus } = require('../../constants/enums')

const validateAddCourse = (req, res, next) => {
  const schema = Joi.object({
    course: Joi.object({
      departmentId: Joi.string().length(24).required(),
      name: Joi.string().required(),
      courseCoordinatorId: Joi.string().length(24),
      numberOfSlots: Joi.number().required(),
    }).required(),
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

const validateUpdateCourse = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
    course: Joi.object({
      departmentId: Joi.string().length(24),
      name: Joi.string(),
      courseCoordinatorId: Joi.string().length(24),
      numberOfSlots: Joi.number(),
    }).required(),
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
const validateUpdateCourseINS = (req, res, next) => {
  const schema = Joi.object({
    courseId: Joi.string().length(24).required(),
    course: Joi.object({
      courseCoordinatorId: Joi.string().length(24).required(),
    }).required(),
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
const validateDeleteCourse = (req, res, next) => {
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
const validateCoursesInDepartment = (req, res, next) => {
  const schema = Joi.object({
    departmentId: Joi.string().length(24).required(),
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
const validateViewCourseCoverage = (req, res, next) => {
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

module.exports = {
  validateAddCourse,
  validateUpdateCourse,
  validateDeleteCourse,
  validateViewCourseCoverage,
  validateCoursesInDepartment,
  validateUpdateCourseINS,
}
