const staffmodel = require('../../models/staff.model')
const attendencemodel = require('../../models/attendence.model')
const {
  entityNotFound,
  unknown,
  success,
  cannotoverwrite,
  wrongdateentry,
  dateDoesNotExist,
} = require('../constants/statusCodes')
const { checkDateExist } = require('../helpers/dates.helper')
const signIn = async (req, res) => {
  try {
    const date = new Date()
    const record = await attendencemodel.create({
      staffId: req.data.id,
      signIn: date,
    })
    return res.json({
      statusCode: success,
      record,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const manualSignIn = async (req, res) => {
  try {
    const y = req.body.date
    const splitY = y.split('-')

    if (!checkDateExist(splitY[0], splitY[1], splitY[2])) {
      return res.json({
        error: 'Date is not valid',
        statusCode: dateDoesNotExist,
      })
    }
    const x = new Date(req.body.date)
    const hrs = req.body.time.substring(0, 2)
    const mins = req.body.time.substring(3, 5)
    const date = new Date(
      x.getFullYear(),
      x.getMonth(),
      x.getDate(),
      hrs,
      mins,
      0,
      0
    )
    const min = new Date(x.getFullYear(), x.getMonth(), x.getDate(), 7, 0, 0, 0)
    const max = new Date(
      x.getFullYear(),
      x.getMonth(),
      x.getDate(),
      19,
      0,
      0,
      0
    )
    let targetDay = ''
    switch (date.getDay()) {
      case 0:
        targetDay = 'sunday'
        break
      case 1:
        targetDay = 'monday'
        break
      case 2:
        targetDay = 'tuesday'
        break
      case 3:
        targetDay = 'wednesday'
        break
      case 4:
        targetDay = 'thursday'
        break
      case 5:
        targetDay = 'friday'
        break
      case 6:
        targetDay = 'saturday'
    }
    if (req.body.attendenceId) {
      const attendenceRecord = await attendencemodel.findOne({
        _id: req.body.attendenceId,
        staffId: req.body.staffId,
      })
      if (!attendenceRecord) {
        return res.json({
          statusCode: entityNotFound,
          error: 'Attendence record not found or does not belong to staff',
        })
      }

      if (attendenceRecord.signIn) {
        return res.json({
          statusCode: cannotoverwrite,
          error: 'Attendence already has a signIn',
        })
      }
      if (date > attendenceRecord.signOut) {
        return res.json({
          statusCode: wrongdateentry,
          error: 'Sign in must preced sign out',
        })
      }
      if (
        date.getDate() !== attendenceRecord.signOut.getDate() ||
        date.getMonth() !== attendenceRecord.signOut.getMonth() ||
        date.getFullYear() !== attendenceRecord.signOut.getFullYear()
      ) {
        return res.json({
          statusCode: wrongdateentry,
          error: 'Sign in must have same date as sign out',
        })
      }
      const startOfDay = new Date(
        attendenceRecord.signOut.getFullYear() +
          '-' +
          (attendenceRecord.signOut.getMonth() + 1) +
          '-' +
          attendenceRecord.signOut.getDate()
      )
      const endDay = new Date(
        attendenceRecord.signOut.getFullYear() +
          '-' +
          (attendenceRecord.signOut.getMonth() + 1) +
          '-' +
          (attendenceRecord.signOut.getDate() + 1)
      )
      const attendenceThatDay = await attendencemodel.find({
        signIn: { $gte: startOfDay, $lt: endDay },
        signOut: { $ne: null, $ne: undefined },
        staffId: req.body.staffId,
      })
      const staff = await staffmodel.findById(req.body.staffId)
      let x1
      let y1
      if (date < min) x1 = min
      else if (date > max) x1 = max
      else x1 = date
      if (attendenceRecord.signOut < min) y1 = min
      else if (attendenceRecord.signOut > max) y1 = max
      else y1 = attendenceRecord.signOut
      const diff = y1 - x1
      const hrs = diff / 3600000
      let inc = 0
      if (staff.dayOff === targetDay && staff.daysToBeCompensatedDays > 0)
        inc += 1
      let dec = inc * -1
      await staffmodel.findByIdAndUpdate(
        staff._id,
        {
          totalHrs: staff.totalHrs + hrs,
          $inc: { compensatedDays: inc, daysToBeCompensatedDays: dec },
          missingDays:
            attendenceThatDay.length === 0 &&
            date.getMonth() === new Date().getMonth()
              ? staff.missingDays - 1 >= 0
                ? staff.missingDays - 1
                : staff.missingDays
              : staff.missingDays,
        },
        { useFindAndModify: false }
      )
      await attendencemodel.findByIdAndUpdate(
        attendenceRecord._id,
        {
          signIn: date,
        },
        { useFindAndModify: false }
      )
    } else {
      await attendencemodel.create({
        staffId: req.body.staffId,
        signIn: date,
      })
    }

    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const signOut = async (req, res) => {
  try {
    const date = new Date()
    const startOfDay = new Date(
      date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    )
    const min = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      7,
      0,
      0,
      0
    )
    const max = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      19,
      0,
      0,
      0
    )
    let targetDay = ''
    switch (date.getDay()) {
      case 0:
        targetDay = 'sunday'
        break
      case 1:
        targetDay = 'monday'
        break
      case 2:
        targetDay = 'tuesday'
        break
      case 3:
        targetDay = 'wednesday'
        break
      case 4:
        targetDay = 'thursday'
        break
      case 5:
        targetDay = 'friday'
        break
      case 6:
        targetDay = 'saturday'
    }
    const record = await attendencemodel.find({
      signIn: { $gte: startOfDay },
      staffId: req.data.id,
    })
    const staff = await staffmodel.findById(req.data.id)
    if (record.length === 0) {
      await attendencemodel.create({
        staffId: req.data.id,
        signOut: date,
      })
    } else {
      let indexMax = 0
      for (let i = 1; i < record.length; i++) {
        if (record[i].signIn > record[indexMax].signIn) {
          indexMax = i
        }
      }
      if (!record[indexMax].signOut) {
        let x
        let y
        if (date < min) x = min
        else if (date > max) x = max
        else x = date
        if (record[indexMax].signIn < min) y = min
        else if (record[indexMax].signIn > max) y = max
        else y = record[indexMax].signIn
        const diff = x - y
        const hrs = diff / 3600000
        let inc = 0
        if (staff.dayOff === targetDay && staff.daysToBeCompensatedDays > 0)
          inc += 1
        let dec = inc * -1
        await staffmodel.findByIdAndUpdate(
          req.data.id,
          {
            totalHrs: staff.totalHrs + hrs,
            $inc: { compensatedDays: inc, daysToBeCompensatedDays: dec },
          },
          { useFindAndModify: false }
        )
        await attendencemodel.findByIdAndUpdate(
          record[indexMax]._id,
          {
            signOut: date,
          },
          { useFindAndModify: false }
        )
      } else {
        await attendencemodel.create({
          staffId: req.data.id,
          signOut: date,
        })
      }
    }

    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewAllAttendance = async (req, res) => {
  try {
    let att
    if (req.body.staffId)
      att = await attendencemodel.find({ staffId: req.body.staffId })
    else att = await attendencemodel.find()

    return res.json({
      statusCode: success,
      returnData: att,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const namesAndIds = async (req, res) => {
  try {
    const profiles = await staffmodel.find()
    return res.json({ statusCode: success, profiles })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewAttendance = async (req, res) => {
  try {
    const staffId = req.data.id

    const att = await attendencemodel.find(
      { staffId: staffId },
      'signIn signOut'
    )

    return res.json({
      statusCode: success,
      returnData: att,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const manualSignOut = async (req, res) => {
  try {
    const y = req.body.date
    const splitY = y.split('-')

    if (!checkDateExist(splitY[0], splitY[1], splitY[2])) {
      return res.json({
        error: 'Date is not valid',
        statusCode: dateDoesNotExist,
      })
    }
    const x = new Date(req.body.date)
    const hrs = req.body.time.substring(0, 2)
    const mins = req.body.time.substring(3, 5)
    const date = new Date(
      x.getFullYear(),
      x.getMonth(),
      x.getDate(),
      hrs,
      mins,
      0,
      0
    )
    const min = new Date(x.getFullYear(), x.getMonth(), x.getDate(), 7, 0, 0, 0)
    const max = new Date(
      x.getFullYear(),
      x.getMonth(),
      x.getDate(),
      19,
      0,
      0,
      0
    )
    let targetDay = ''
    switch (date.getDay()) {
      case 0:
        targetDay = 'sunday'
        break
      case 1:
        targetDay = 'monday'
        break
      case 2:
        targetDay = 'tuesday'
        break
      case 3:
        targetDay = 'wednesday'
        break
      case 4:
        targetDay = 'thursday'
        break
      case 5:
        targetDay = 'friday'
        break
      case 6:
        targetDay = 'saturday'
    }
    const attendenceRecord = await attendencemodel.findOne({
      _id: req.body.attendenceId,
      staffId: req.body.staffId,
    })
    if (!attendenceRecord) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Attendence record not found or does not belong to staff',
      })
    }
    if (attendenceRecord.signOut) {
      return res.json({
        statusCode: cannotoverwrite,
        error: 'Attendence already has a signOut',
      })
    }
    if (date < attendenceRecord.signIn) {
      return res.json({
        statusCode: wrongdateentry,
        error: 'Sign out must follow sign in time',
      })
    }
    if (
      date.getDate() !== attendenceRecord.signIn.getDate() ||
      date.getMonth() !== attendenceRecord.signIn.getMonth() ||
      date.getFullYear() !== attendenceRecord.signIn.getFullYear()
    ) {
      return res.json({
        statusCode: wrongdateentry,
        error: 'Sign in must have same date as sign out',
      })
    }
    const startOfDay = new Date(
      attendenceRecord.signIn.getFullYear() +
        '-' +
        (attendenceRecord.signIn.getMonth() + 1) +
        '-' +
        attendenceRecord.signIn.getDate()
    )
    const endDay = new Date(
      attendenceRecord.signIn.getFullYear() +
        '-' +
        (attendenceRecord.signIn.getMonth() + 1) +
        '-' +
        (attendenceRecord.signIn.getDate() + 1)
    )
    const attendenceThatDay = await attendencemodel.find({
      signIn: { $gte: startOfDay, $lt: endDay },
      signOut: { $ne: null, $ne: undefined },
      staffId: req.body.staffId,
    })
    const staff = await staffmodel.findById(req.body.staffId)
    let x1
    let y1
    if (date < min) x1 = min
    else if (date > max) x1 = max
    else x1 = date
    if (attendenceRecord.signIn < min) y1 = min
    else if (attendenceRecord.signIn > max) y1 = max
    else y1 = attendenceRecord.signIn
    const diff = x1 - y1
    const hrs1 = diff / 3600000
    let inc = 0
    if (staff.dayOff === targetDay && staff.daysToBeCompensatedDays > 0)
      inc += 1
    let dec = inc * -1
    await staffmodel.findByIdAndUpdate(
      staff._id,
      {
        totalHrs: staff.totalHrs + hrs1,
        $inc: { compensatedDays: inc, daysToBeCompensatedDays: dec },
        missingDays:
          attendenceThatDay.length === 0 &&
          date.getMonth() === new Date().getMonth()
            ? staff.missingDays - 1 >= 0
              ? staff.missingDays - 1
              : staff.missingDays
            : staff.missingDays,
      },
      { useFindAndModify: false }
    )
    await attendencemodel.findByIdAndUpdate(
      attendenceRecord._id,
      {
        signOut: date,
      },
      { useFindAndModify: false }
    )

    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllAttendanceWithoutSignIn = async (req, res) => {
  try {
    att = await attendencemodel.find({
      staffId: req.body.staffId,
      $or: [{ signIn: null }, { signIn: undefined }],
    })
    return res.json({
      statusCode: success,
      returnData: att,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllAttendanceWithoutSignOut = async (req, res) => {
  try {
    att = await attendencemodel.find({
      staffId: req.body.staffId,
      $or: [{ signOut: null }, { signOut: undefined }],
    })
    return res.json({
      statusCode: success,
      returnData: att,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
module.exports = {
  signIn,
  signOut,
  manualSignIn,
  manualSignOut,
  viewAttendance,
  viewAllAttendance,
  viewAllAttendanceWithoutSignIn,
  viewAllAttendanceWithoutSignOut,
  namesAndIds,
}
