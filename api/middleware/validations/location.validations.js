const Joi = require('joi')
const { validation } = require('../../constants/statusCodes')
const { requestStatus, locationType } = require('../../constants/enums')

const validateAddLocation = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.object({
      type: Joi.string()
        .valid(locationType.OFFICE, locationType.ROOM, locationType.HALL)
        .required(),
      name: Joi.string().required(),
      capacity: Joi.number().required(),
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

const validateUpdateLocation = (req, res, next) => {
  const schema = Joi.object({
    locationId: Joi.string().length(24).required(),
    location: Joi.object({
      name: Joi.string(),
      type: Joi.string().valid(
        locationType.OFFICE,
        locationType.ROOM,
        locationType.HALL
      ),
      capacity: Joi.number(),
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

const validateDeleteLocation = (req, res, next) => {
  const schema = Joi.object({
    locationId: Joi.string().length(24).required(),
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
const validateAssignOffice = (req, res, next) => {
  const schema = Joi.object({
    locationId: Joi.string().length(24).required(),
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
  validateAddLocation,
  validateAssignOffice,
  validateDeleteLocation,
  validateUpdateLocation,
}
