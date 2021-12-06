const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { requestStatus } = require('../../constants/enums')

const validateCreateReplacementRequest = (req, res, next) => {
  const schema = Joi.object({
    targetDate: Joi.date().required(),
    receiverId: Joi.string().required(),
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

const validateCancelReplacementRequest = (req, res, next) => {
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
const validateAcceptReplacementRequest = (req, res, next) => {
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
const validateRejectReplacementRequest = (req, res, next) => {
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
  validateCreateReplacementRequest,
  validateCancelReplacementRequest,
  validateAcceptReplacementRequest,
  validateRejectReplacementRequest,
}
