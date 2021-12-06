const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const validateRemoveNotification = (req, res, next) => {
  const schema = Joi.object({
    notificationId: Joi.string().length(24).required(),
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

const validateSetSeen = (req, res, next) => {
  const schema = Joi.object({
    notificationId: Joi.string().length(24).required(),
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
  validateRemoveNotification,
  validateSetSeen,
}
