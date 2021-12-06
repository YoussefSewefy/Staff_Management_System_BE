//Import the mongoose module
const mongoose = require('mongoose')
const { mongoURI } = require('./keys')
const staffModel = require('../models/staff.model')
const bcrypt = require('bcryptjs')
const { salt } = require('./keys')
const {
  staffType,
  day,
  gender,
  passwordStatus,
} = require('../api/constants/enums')
const { daySchedule } = require('../api/helpers/scheduler')
const { monthScheduler } = require('../api/helpers/monthScheduler')
const { yearScheduler } = require('../api/helpers/yearScheduler')
const connectDB = async () => {
  const uri = mongoURI
  mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(async () => {
      console.log('MongoDB Connected…')

      daySchedule()
      monthScheduler()
      yearScheduler()
      const staffMem = await staffModel.find()
      const saltKey = bcrypt.genSaltSync(salt)
      const hashed_pass = bcrypt.hashSync('12345678', saltKey)
      if (staffMem.length === 0) {
        try {
          let staffN = {
            name: 'Mostafa Hatem',
            email: 'mostafa@gmail.com',
            type: staffType.HR,
            salary: 5000,
            id: 'hr-1',
            dayOff: day.SATURDAY,
            totalHrs: 0,
            missingDays: 0,
            leaveBalance: 0,
            accidentalBalance: 6,
            gender: gender.MALE,
            compensatedDays: 0,
            passwordStatus: passwordStatus.CHANGED,
            password: hashed_pass,
          }
          const newStaff = await staffModel.create(staffN)
          return
        } catch (exception) {
          console.log('Something went wrong while setting the DB')
        }
      }
    })
    .catch((err) => console.log(err))
}

module.exports = { connectDB }
