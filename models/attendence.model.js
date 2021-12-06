var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var attendance = new Schema({
  signIn: { type: Date },
  signOut: { type: Date },
  staffId: { type: String },
})

var attendanceModel = mongoose.model('attendance', attendance)

module.exports = attendanceModel
