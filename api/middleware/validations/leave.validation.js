const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { leaveRequestType } = require('../../constants/enums')

const validateAcceptRequest = (req, res, next) => {
  const schema = Joi.object({
    leaveId: Joi.string().length(24).required(),
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
const validateRejectRequest = (req, res, next) => {
  const schema = Joi.object({
    leaveId: Joi.string().length(24).required(),
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
const validateSendRequest = (req, res, next) => {
  const schema = Joi.object({
    replacementRequestId: Joi.array().items(Joi.string().length(24)),
    targetStartDate: Joi.date().required(),
    targetEndDate: Joi.date().required(),
    type: Joi.string()
      .valid(
        leaveRequestType.ACCIDENTAL,
        leaveRequestType.ANNUAL,
        leaveRequestType.MATERNITY,
        leaveRequestType.SICK,
        leaveRequestType.COMPENSATION
      )
      .required(),
    documentUrl: Joi.string().uri(),
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
const validateCancelRequest = async (req, res, next) => {
  const schema = Joi.object({
    leaveId: Joi.string().length(24).required(),
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
  validateAcceptRequest,
  validateRejectRequest,
  validateSendRequest,
  validateCancelRequest,
}
