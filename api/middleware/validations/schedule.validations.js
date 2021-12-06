const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { requestStatus, day } = require('../../constants/enums')

const validateViewCourseLinkingRequest = (req, res, next) => {
  const schema = Joi.object({})
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}

const validateAcceptLinkingRequest = (req, res, next) => {
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

const validateRejectLinkingRequest = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    message: Joi.string(),
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
const validateSendLinkingRequest = (req, res, next) => {
  const schema = Joi.object({
    slotId: Joi.string().length(24).required(),
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
///
const validateRequestChangeDayOff = (req, res, next) => {
  const schema = Joi.object({
    dayOff: Joi.string()
      .required()
      .valid(
        day.SATURDAY,
        day.SUNDAY,
        day.MONDAY,
        day.TUESDAY,
        day.WEDNESDAY,
        day.THURSDAY
      ),
    reason: Joi.string(),
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

const validateViewChangeDayOff = (req, res, next) => {
  const schema = Joi.object({})
  const { error, value } = schema.validate(req.body)
  if (error) {
    return res.json({
      statusCode: validation,
      error: error.details[0].message,
    })
  }
  return next()
}

const validateAcceptChangeDayOff = (req, res, next) => {
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

const validateRejectChangeDayOff = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().length(24).required(),
    message: Joi.string(),
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

const validateCancelRequest = (req, res, next) => {
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
  validateRejectLinkingRequest,
  validateAcceptLinkingRequest,
  validateViewCourseLinkingRequest,
  validateSendLinkingRequest,
  validateRequestChangeDayOff,
  validateViewChangeDayOff,
  validateAcceptChangeDayOff,
  validateRejectChangeDayOff,
  validateCancelRequest,
}
