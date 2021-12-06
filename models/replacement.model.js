var mongoose = require('mongoose')
var { requestStatus } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var replacementRequest = new Schema({
  senderId: { type: String },
  receiverId: { type: String },
  slotId: { type: String },
  targetDate: { type: Date },
  dateSent: { type: Date },
  status: {
    type: String,
    enum: [
      requestStatus.ACCEPTED,
      requestStatus.REJECTED,
      requestStatus.PENDING,
      requestStatus.CANCELED,
    ],
  },
})

var replacementRequestModel = mongoose.model('replacement', replacementRequest)

module.exports = replacementRequestModel
