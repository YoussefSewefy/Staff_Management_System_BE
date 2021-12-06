const schedule = require('node-schedule')
const staffmodel = require('../../models/staff.model')
const salarymodel = require('../../models/salary.model')
const leavemodel = require('../../models/leave.model')
const { requestStatus, leaveRequestType } = require('../constants/enums')
const rule = new schedule.RecurrenceRule()
rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
rule.date = 11
rule.hour = 0
rule.minute = 0
const everyMonth = async () => {
  try {
    console.log('Execute month scheduler')
    const today = new Date()
    const staffs = await staffmodel.find()
    let min = today
    let max = new Date(today.getFullYear(), today.getMonth() + 1, 11)
    for (let i = 0; i < staffs.length; i++) {
      const leave = await leavemodel.find({
        senderId: staffs[i]._id,
        status: requestStatus.ACCEPTED,
      })
      let daysToBeCompensated = 0
      let compensatedDays = 0
      for (let j = 0; j < leave.length; j++) {
        let diff1 = 0
        if (
          leave[j].targetStartDate < max &&
          leave[j].targetStartDate >= min &&
          leave[j].targetEndDate < max &&
          leave[j].targetEndDate >= min
        ) {
          diff1 = leave[j].targetEndDate - leave[j].targetStartDate
        } else if (
          leave[j].targetStartDate < max &&
          leave[j].targetStartDate >= min
        ) {
          diff1 = max - leave[j].targetStartDate
        } else if (
          leave[j].targetEndDate < max &&
          leave[j].targetEndDate >= min
        ) {
          diff1 = leave[j].targetEndDate - min
        } else if (
          leave[j].targetStartDate < min &&
          leave[j].targetEndDate >= max
        ) {
          diff1 = max - min
        }
        if (leave[j].type == leaveRequestType.COMPENSATION) {
          daysToBeCompensated += diff1 / 86400000 + 1
        } else {
          compensatedDays += diff1 / 86400000 + 1
        }
      }

      let salary = staffs[i].salary
      let missingDays = staffs[i].missingDays - staffs[i].compensatedDays
      let missingHrs = 168 - staffs[i].totalHrs
      let monthSalary = salary - missingDays * (salary / 60)
      if (missingHrs >= 3) {
        monthSalary -= missingHrs * (salary / 180)
      }
      await salarymodel.create({
        staffId: staffs[i]._id,
        month: today.getMonth() + 1,
        salary: monthSalary > 0 ? monthSalary : 0,
        year: today.getFullYear(),
      })
      await staffmodel.findByIdAndUpdate(
        staffs[i]._id,
        {
          daysToBeCompensatedDays: daysToBeCompensated,
          compensatedDays: compensatedDays,
        },
        { useFindAndModify: false }
      )
    }
    await staffmodel.updateMany({
      totalHrs: 0,
      missingDays: 0,
      $inc: { leaveBalance: 2.5 },
    })
  } catch (err) {
    console.log(err)
  }
}
const monthScheduler = async () => {
  schedule.scheduleJob(rule, everyMonth)
}
module.exports = { monthScheduler }
