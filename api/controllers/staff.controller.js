const staffmodel = require('../../models/staff.model')
const locationmodel = require('../../models/location.model')
const attendencemodel = require('../../models/attendence.model')
const courseStaffModel = require('../../models/courseStaff.model')
const departmentmodel = require('../../models/department.model')
const leavemodel = require('../../models/leave.model')
const notificationModel = require('../../models/notification.model')
const replacementmodel = require('../../models/replacement.model')
const scheduleModel = require('../../models/schedule.model')
const slotModal = require('../../models/slot.model')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { signingKey, salt } = require('../../config/keys')
const {
  entityNotFound,
  wrongCredentials,
  unknown,
  emailshouldbeunique,
  fullCapacity,
  success,
  notRequiredType,
  samePassword,
  wrongType,
  HODExists,
  departmentRequired,
} = require('../constants/statusCodes')
const bcrypt = require('bcryptjs')
const {
  staffType,
  locationType,
  passwordStatus,
  day,
} = require('../constants/enums')
const attendanceModel = require('../../models/attendence.model')
const courseModel = require('../../models/course.model')
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body
    const staff = await staffmodel.findOne({ email })
    if (!staff) {
      return res.json({
        error: 'Email not found',
        statusCode: entityNotFound,
      })
    }

    const match = bcrypt.compareSync(password, staff.password)
    if (!match) {
      return res.json({
        error: 'wrong credentials',
        statusCode: wrongCredentials,
      })
    }

    const payLoad = {
      id: staff._id,
      name: staff.name,
      email: staff.email,
      type: staff.type,
      department: staff.department,
      passwordStatus: staff.passwordStatus,
      gender: staff.gender,
    }

    const token = jwt.sign(payLoad, signingKey)
    await staffmodel.findByIdAndUpdate(
      staff._id,
      {
        token: token,
      },
      { useFindAndModify: false }
    )
    if (staff.passwordStatus === passwordStatus.DEFAULT) {
      return res.json({
        statusCode: success,
        token,
        msg: 'Please reset your password',
        payLoad,
      })
    }
    return res.json({
      statusCode: success,
      token,
      payLoad,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const logOut = async (req, res) => {
  try {
    await staffmodel.findByIdAndUpdate(
      req.data.id,
      {
        token: null,
      },
      { useFindAndModify: false }
    )
    return res.json('logged out successfully')
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const addStaff = async (req, res) => {
  try {
    const staff = req.body
    const staffFound = await staffmodel.findOne({ email: staff.email })
    if (staffFound) {
      return res.json({
        statusCode: emailshouldbeunique,
        error: 'Email should be unique',
      })
    }
    const staffCap = await staffmodel.count({
      officeLocation: staff.officeLocation,
    })
    const loc = await locationmodel.findById(staff.officeLocation)
    if (!loc) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Office location not found',
      })
    }
    if (loc.type !== locationType.OFFICE) {
      return res.json({
        statusCode: notRequiredType,
        error: 'This location is not an office',
      })
    }
    if (staffCap + 1 > loc.capacity) {
      return res.json({
        statusCode: fullCapacity,
        error: 'Office location is full',
      })
    }
    if (staff.department) {
      const department = await departmentmodel.findById(staff.department)
      if (!department) {
        return res.json({
          statusCode: entityNotFound,
          error: 'department not found',
        })
      }
      if (staff.type === staffType.HOD && department.HODId) {
        return res.json({
          statusCode: HODExists,
          error: 'department has a head',
        })
      }
    }
    if (staff.type !== 'hr' && staff.type !== 'hod') {
      if (!staff.department || staff.department === '') {
        return res.json({
          statusCode: departmentRequired,
          error: 'department is required',
        })
      }
    }
    const saltKey = bcrypt.genSaltSync(salt)
    const hashed_pass = bcrypt.hashSync('123456', saltKey)
    staff.password = hashed_pass
    staff.passwordStatus = passwordStatus.DEFAULT
    const file = JSON.parse(fs.readFileSync('./api/helpers/count.json'))
    if (staff.type === staffType.HR) {
      if (staff.dayOff !== day.SATURDAY) {
        return res.json({
          error: `Hr day off must be ${day.SATURDAY}`,
          statusCode: wrongType,
        })
      }
      if (staff.department) {
        return res.json({
          error: `Hr must not have a department`,
          statusCode: wrongType,
        })
      }
      staff.id = `hr-${file.hr}`
      const newfile = {
        ac: file.ac,
        hr: file.hr + 1,
      }
      fs.writeFileSync('./api/helpers/count.json', JSON.stringify(newfile))
    } else {
      staff.id = `ac-${file.ac}`
      const newfile = {
        ac: file.ac + 1,
        hr: file.hr,
      }
      fs.writeFileSync('./api/helpers/count.json', JSON.stringify(newfile))
    }
    staff.totalHrs = 0
    staff.missingDays = 0
    staff.compensatedDays = 0
    staff.accidentalBalance = 6
    staff.leaveBalance = 0
    staff.daysToBeCompensatedDays = 0
    const newStaff = await staffmodel.create(staff)
    if (staff.department && staff.type === staffType.HOD) {
      await departmentmodel.findByIdAndUpdate(
        staff.department,
        {
          HODId: newStaff._id,
        },
        { useFindAndModify: false }
      )
    }
    return res.json({ statusCode: success, staff: newStaff })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const deleteStaff = async (req, res) => {
  try {
    const { staffId } = req.body
    const staffFound = await staffmodel.findById(staffId)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    await courseStaffModel.deleteMany({ staffId: staffId })
    await attendencemodel.deleteMany({ staffId: staffId })
    await scheduleModel.deleteMany({ staffId: staffId })
    await notificationModel.deleteMany({ staffId: staffId })
    await leavemodel.deleteMany({
      $or: [{ senderId: staffId }, { receiverId: staffId }],
    })
    await replacementmodel.deleteMany({
      $or: [{ senderId: staffId }, { receiverId: staffId }],
    })
    if (staffFound.type === staffType.HOD) {
      await departmentmodel.updateMany({ HODId: staffId }, { HODId: null })
    }
    await slotModal.updateMany({ staffId: staffId }, { staffId: null })
    await staffmodel.findByIdAndDelete(staffId)
    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const staffFound = await staffmodel.findById(req.data.id)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    const rightPassword = bcrypt.compareSync(oldPassword, staffFound.password)
    if (!rightPassword) {
      return res.json({
        error: 'wrong credentials',
        statusCode: wrongCredentials,
      })
    }

    // samepassword
    if (oldPassword === newPassword) {
      return res.json({
        statusCode: samePassword,
        error: "Old passowrd and new password can't be the same",
      })
    }
    const saltKey = bcrypt.genSaltSync(salt)
    const hashed_newPass = bcrypt.hashSync(newPassword, saltKey)
    await staffmodel.findByIdAndUpdate(
      req.data.id,
      {
        password: hashed_newPass,
        passwordStatus: passwordStatus.CHANGED,
      },
      { useFindAndModify: false }
    )
    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const resetPasswordHR = async (req, res) => {
  try {
    const { staffId } = req.body
    const staffFound = await staffmodel.findById(staffId)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }

    const saltKey = bcrypt.genSaltSync(salt)
    const hashed_newPass = bcrypt.hashSync('123456', saltKey)
    await staffmodel.findByIdAndUpdate(
      staffId,
      {
        password: hashed_newPass,
        passwordStatus: passwordStatus.DEFAULT,
      },
      { useFindAndModify: false }
    )
    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewMissingDays = async (req, res) => {
  try {
    const staff = await staffmodel.findById(req.data.id)
    let missingDays = 0
    if (staff.missingDays && staff.compensatedDays) {
      missingDays = staff.missingDays - staff.compensatedDays
    }
    return res.json({
      statusCode: success,
      missingDays: missingDays > 0 ? missingDays : 0,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewMembersMissing = async (req, res) => {
  try {
    const allStaff = await staffmodel.find()
    var filteredStaff = []
    var filteredStaff2 = []
    const todayDate = new Date()
    const today = todayDate.getDate()
    const currentMonth = todayDate.getMonth() + 1
    var monthWeLookFor = []

    if (todayDate.getDate() >= 11) {
      monthWeLookFor.push(currentMonth)
    } else {
      if (currentMonth == 1) {
        monthWeLookFor.push(12)
        monthWeLookFor.push(1)
      } else {
        monthWeLookFor.push(currentMonth - 1)
        monthWeLookFor.push(currentMonth)
      }
    }
    const allAttendanceStaff = await attendanceModel.find()
    for (let i = 0; i < allStaff.length; i++) {
      var daysCounter = 0
      if (
        allStaff[i].missingDays > 0 &&
        allStaff[i].compensatedDays < allStaff[i].missingDays
      ) {
        filteredStaff2.push(allStaff[i])
      }
      for (let j = 0; j < allAttendanceStaff.length; j++) {
        const inDate = new Date(allAttendanceStaff[j].signIn)
        const outDate = new Date(allAttendanceStaff[j].signOut)

        if (
          allAttendanceStaff[j].signIn &&
          allAttendanceStaff[j].signOut &&
          allAttendanceStaff[j].staffId == allStaff[i]._id
        ) {
          if (monthWeLookFor.length == 1) {
            if (
              inDate.getDate() >= 11 &&
              inDate.getMonth() + 1 == monthWeLookFor[0] &&
              inDate.getDate() <= today &&
              outDate.getDate() >= 11 &&
              outDate.getMonth() + 1 == monthWeLookFor[0] &&
              outDate.getDate() <= today
            ) {
              daysCounter += 1
            }
          } else if (monthWeLookFor.length == 2) {
            if (
              ((inDate.getDate() >= 11 &&
                inDate.getMonth() + 1 == monthWeLookFor[0]) ||
                (inDate.getDate() <= today &&
                  inDate.getMonth() + 1 == monthWeLookFor[1])) &&
              ((outDate.getDate() >= 11 &&
                outDate.getMonth() + 1 == monthWeLookFor[0]) ||
                (outDate.getDate() <= today &&
                  outDate.getMonth() + 1 == monthWeLookFor[1]))
            ) {
              daysCounter += 1
            }
          }
        }
      }
      if (daysCounter * 8.4 > allStaff[i].totalHrs) {
        filteredStaff.push(allStaff[i])
      }
    }

    return res.json({
      statusCode: success,
      staffWithMissingHours: filteredStaff,
      staffWithMissingDays: filteredStaff2,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const updateSalary = async (req, res) => {
  try {
    const staffFound = await staffmodel.findById(req.body.id)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    await staffmodel.findByIdAndUpdate(
      req.body.id,
      {
        salary: req.body.salary,
      },
      { useFindAndModify: false }
    )
    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewStaffPerDepartment = async (req, res) => {
  try {
    const staffFound = await staffmodel.findById(req.body.id)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    const staffPerDepartment = await staffmodel.find(
      {
        department: staffFound.department,
      },
      '_id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays'
    )
    return res.json({ statusCode: success, staff: staffPerDepartment })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewStaffPerDepartment2 = async (req, res) => {
  try {
    const staffFound = await staffmodel.findById(req.data.id)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    const staffPerDepartment = await staffmodel.find(
      {
        department: staffFound.department,
      },
      '_id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays'
    )
    return res.json({ statusCode: success, staff: staffPerDepartment })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewDaysOff = async (req, res) => {
  try {
    if (req.body.id) {
      const staff = await staffmodel.findById(req.body.id)
      if (!staff) {
        return res.json({
          statusCode: entityNotFound,
          error: 'Staff not found',
        })
      }
      const staffName = staff.name
      const dayOff = staff.dayOff
      const id = staff._id
      return res.json({
        statusCode: success,
        staff: { id: id, staffName: staffName, dayOff: dayOff },
      })
    } else {
      const HOD = await staffmodel.findById(req.data.id)
      const allStaff = await staffmodel.find({
        department: HOD.department,
      })
      var returnData = []
      for (let i = 0; i < allStaff.length; i++) {
        const staff = {
          Staff: {
            id: allStaff[i]._id,
            staffName: allStaff[i].name,
            dayOff: allStaff[i].dayOff,
          },
        }
        returnData.push(staff)
      }
      return res.json({
        statusCode: success,
        returnData,
      })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewDifferenceHours = async (req, res) => {
  try {
    const staff = await staffmodel.findById(req.data.id)
    const sHrs = staff.totalHrs ? staff.totalHrs : 0
    const hrs = sHrs - 168
    if (hrs < 0) {
      const mHrs = hrs * -1
      return res.json({ statusCode: success, hours: `Missing hours ${mHrs}` })
    }
    return res.json({ statusCode: success, hours: `Extra hours ${hrs}` })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllProfiles = async (req, res) => {
  try {
    if (req.data.type === 'instructor' || req.data.type === 'hod') {
      const profiles = await staffmodel.find(
        { _id: { $ne: req.data.id }, department: req.data.department },
        '_id id name email type dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays officeLocation department'
      )
      return res.json({ statusCode: success, profiles })
    } else {
      const profiles = await staffmodel.find(
        { _id: { $ne: req.data.id } },
        '_id id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays officeLocation department'
      )
      return res.json({ statusCode: success, profiles })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewMyProfile = async (req, res) => {
  try {
    const profile = await staffmodel.findById(
      req.data.id,
      '_id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays id'
    )

    return res.json({ statusCode: success, profile })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const updateMyProfile = async (req, res) => {
  try {
    const { email, gender } = req.body
    if (email && gender)
      await staffmodel.findByIdAndUpdate(
        req.data.id,
        {
          email,
          gender,
        },
        { useFindAndModify: false }
      )
    else if (email)
      await staffmodel.findByIdAndUpdate(
        req.data.id,
        {
          email,
        },
        { useFindAndModify: false }
      )
    else if (gender)
      await staffmodel.findByIdAndUpdate(
        req.data.id,
        {
          gender,
        },
        { useFindAndModify: false }
      )
    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const updateProfile = async (req, res) => {
  try {
    const {
      email,
      gender,
      dayOff,
      department,
      name,
      staffId,
      salary,
    } = req.body
    if (email)
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          email,
        },
        { useFindAndModify: false }
      )
    if (gender)
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          gender,
        },
        { useFindAndModify: false }
      )
    if (dayOff) {
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          dayOff,
        },
        { useFindAndModify: false }
      )
    }
    if (department)
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          department,
        },
        { useFindAndModify: false }
      )
    if (name)
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          name,
        },
        { useFindAndModify: false }
      )
    if (salary)
      await staffmodel.findByIdAndUpdate(
        staffId,
        {
          salary,
        },
        { useFindAndModify: false }
      )
    const staff = await staffmodel.findById(staffId)
    return res.json({ statusCode: success, staff })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const checkSalarySoFar = async (req, res) => {
  try {
    const staffFound = await staffmodel.findById(req.data.id)
    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Staff not found',
      })
    }
    const salary = staffFound.salary
    const hourRate = salary / 168
    const salarySoFar = hourRate * staffFound.totalHrs
    return res.json({ statusCode: success, salarySoFar: salarySoFar })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

module.exports = {
  logIn,
  logOut,
  addStaff,
  deleteStaff,
  resetPassword,
  resetPasswordHR,
  viewMissingDays,
  viewMembersMissing,
  updateSalary,
  viewStaffPerDepartment,
  viewDaysOff,
  viewDifferenceHours,
  viewAllProfiles,
  viewMyProfile,
  updateMyProfile,
  updateProfile,
  checkSalarySoFar,
  viewStaffPerDepartment2,
}
