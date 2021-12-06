var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var department = new Schema({
  name: { type: String },
  HODId: { type: String },
  facultyId: { type: String },
})

var departmentModel = mongoose.model('department', department)

module.exports = departmentModel
