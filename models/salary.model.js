var mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var salary = new Schema({
  salary: { type: Number },
  staffId: { type: String },
  month: { type: Number },
  year: { type: Number },
})

var courseModel = mongoose.model('salary', salary)

module.exports = courseModel
