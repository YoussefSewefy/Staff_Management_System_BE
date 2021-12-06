var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var course = new Schema({
  departmentId: { type: String },
  name: { type: String },
  courseCoordinatorId: { type: String },
  numberOfSlots: { type: Number },
})

var courseModel = mongoose.model('course', course)

module.exports = courseModel
