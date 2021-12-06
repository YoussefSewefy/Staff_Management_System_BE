//Require Mongoose
var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var faculty = new Schema({
  name: { type: String },
  numberOfStudents: { type: Number },
  building: { type: String },
})

var facultyModel = mongoose.model('faculty', faculty)

module.exports = facultyModel
