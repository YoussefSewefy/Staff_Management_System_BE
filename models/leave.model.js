var mongoose = require('mongoose')
var { leaveRequestType, requestStatus } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var leaveRequest = new Schema({
  type: {
    type: String,
    enum: [
      leaveRequestType.ACCIDENTAL,
      leaveRequestType.ANNUAL,
      leaveRequestType.MATERNITY,
      leaveRequestType.SICK,
      leaveRequestType.COMPENSATION,
    ],
  },
  senderId: { type: String },
  receiverId: { type: String },
  status: {
    type: String,
    enum: [
      requestStatus.PENDING,
      requestStatus.REJECTED,
      requestStatus.ACCEPTED,
      requestStatus.CANCELED,
    ],
  },
  replacementRequestId: { type: [String] },
  dateSent: { type: Date },
  targetStartDate: { type: Date },
  targetEndDate: { type: Date },
  //could be changed later to file
  documentUrl: { type: String },
  reason: { type: String },
  message: { type: String },
})

var leaveRequestModel = mongoose.model('leave', leaveRequest)

module.exports = leaveRequestModel
