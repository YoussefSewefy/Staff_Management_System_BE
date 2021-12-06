var mongoose = require('mongoose')
var { requestStatus, day, scheduleType } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var scheduleRequest = new Schema({
  staffId: { type: String },
  slotId: { type: String },
  type: { type: String, enum: [scheduleType.LINKING, scheduleType.CHANGEDAY] },
  dayOff: {
    type: String,
    enum: [
      day.MONDAY,
      day.TUESDAY,
      day.WEDNESDAY,
      day.THURSDAY,
      day.SATURDAY,
      day.SUNDAY,
    ],
  },
  status: {
    type: String,
    enum: [
      requestStatus.ACCEPTED,
      requestStatus.REJECTED,
      requestStatus.PENDING,
      requestStatus.CANCELED,
    ],
  },
  reason: { type: String },
  message: { type: String },
})

var scheduleModel = mongoose.model('schedule', scheduleRequest)

module.exports = scheduleModel
