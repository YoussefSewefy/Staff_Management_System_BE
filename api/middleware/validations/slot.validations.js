const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { slotType, day } = require('../../constants/enums')

const validateAddSlot = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string()
      .valid(slotType.LAB, slotType.LECTURE, slotType.TUTORIAL)
      .required(),
    staffId: Joi.string().length(24),
    courseId: Joi.string().length(24).required(),
    time: Joi.number().min(1).max(5).required(),
    locationId: Joi.string().required(),
    day: Joi.string()
      .valid(
        day.SUNDAY,
        day.MONDAY,
        day.TUESDAY,
        day.WEDNESDAY,
        day.THURSDAY,
        day.SATURDAY
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
const validateUpdateSlot = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    type: Joi.string().valid(slotType.LAB, slotType.LECTURE, slotType.TUTORIAL),
    courseId: Joi.string().length(24),
    time: Joi.number().min(1).max(5),
    locationId: Joi.string().length(24),
    day: Joi.string().valid(
      day.SUNDAY,
      day.MONDAY,
      day.TUESDAY,
      day.WEDNESDAY,
      day.THURSDAY,
      day.SATURDAY
    ),
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
const validateDeleteSlot = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    courseId: Joi.string().length(24),
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
const validateAandUOfSlot = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
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
const validatedeleteStaffFromSlot = (req, res, next) => {
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
const validateViewSlotsMyDepartment = (req, res, next) => {
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
const validateViewSlotsMyCourses = (req, res, next) => {
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

module.exports = {
  validateAddSlot,
  validateUpdateSlot,
  validateDeleteSlot,
  validateAandUOfSlot,
  validatedeleteStaffFromSlot,
  validateViewSlotsMyCourses,
  validateViewSlotsMyDepartment,
}
