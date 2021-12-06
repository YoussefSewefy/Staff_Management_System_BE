//Require Mongoose
const { bool, boolean } = require('joi')
var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
var {
  gender,
  staffType,
  passwordStatus,
  day,
} = require('../api/constants/enums')

//Define a schema
var Schema = mongoose.Schema

var staff = new Schema({
  email: { type: String },
  password: { type: String },
  gender: {
    type: String,
    enum: [gender.MALE, gender.FEMALE],
  },
  id: { type: String },
  officeLocation: { type: String },
  salary: { type: Number },
  type: {
    type: String,
    enum: [staffType.HOD, staffType.HR, staffType.INSTRUCTOR, staffType.TA],
  },
  passwordStatus: {
    type: String,
    enum: [passwordStatus.DEFAULT, passwordStatus.CHANGED],
  },
  department: { type: String },
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
  totalHrs: { type: Number },
  missingDays: { type: Number },
  leaveBalance: { type: Number },
  accidentalBalance: { type: Number },
  compensatedDays: { type: Number },
  daysToBeCompensatedDays: { type: Number },
  name: { type: String },
  token: { type: String },
})

var staffmodel = mongoose.model('staff', staff)

module.exports = staffmodel
