var mongoose = require('mongoose')
var { notificationType } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var notification = new Schema({
  type: {
    type: String,
    enum: [
      notificationType.LEAVE,
      notificationType.REPLACEMENT,
      notificationType.SCHEDULE,
      notificationType.ASSIGNMENT,
    ],
  },
  description: { type: String },
  seen: { type: Boolean },
  staffId: { type: String },
  redId: { type: String },
})

var notificationModel = mongoose.model('notification', notification)

module.exports = notificationModel
