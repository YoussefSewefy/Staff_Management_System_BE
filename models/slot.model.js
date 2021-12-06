var mongoose = require('mongoose')
var { slotType, day } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var slot = new Schema({
  type: {
    type: String,
    enum: [slotType.LAB, slotType.TUTORIAL, slotType.LECTURE],
  },
  staffId: { type: String },
  courseId: { type: String },
  time: { type: Number },
  locationId: { type: String },
  day: {
    type: String,
    enum: [
      day.SUNDAY,
      day.MONDAY,
      day.TUESDAY,
      day.WEDNESDAY,
      day.THURSDAY,
      day.SATURDAY,
    ],
  },
})

var slotModel = mongoose.model('slot', slot)

module.exports = slotModel
