var mongoose = require('mongoose')
var { locationType } = require('../api/constants/enums')
mongoose.set('useCreateIndex', true)
//Define a schema
var Schema = mongoose.Schema

var location = new Schema({
  type: {
    type: String,
    enum: [locationType.HALL, locationType.OFFICE, locationType.ROOM],
  },
  name: { type: String },
  capacity: { type: Number },
})

var locationModel = mongoose.model('location', location)

module.exports = locationModel
