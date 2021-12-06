var mongoose = require('mongoose')
var { roleInCourse } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var courseStaff = new Schema({
  courseId: { type: String },
  staffId: { type: String },
  role: {
    type: String,
    enum: [
      roleInCourse.COURSECOORDINATOR,
      roleInCourse.INSTRUCTOR,
      roleInCourse.TA,
    ],
  },
})

var courseStaffModel = mongoose.model('courseStaff', courseStaff)

module.exports = courseStaffModel
