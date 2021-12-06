const schedule = require('node-schedule')
const staffmodel = require('../../models/staff.model')
const rule = new schedule.RecurrenceRule()
rule.month = 11
rule.date = 11
rule.hour = 0
rule.minute = 0

const everyYear = async () => {
  try {
    await staffmodel.updateMany({
      accidentalBalance: 6,
      leaveBalance: 0,
    })
  } catch (err) {
    console.log(err)
  }
}
const yearScheduler = async () => {
  schedule.scheduleJob(rule, everyYear)
}
module.exports = { yearScheduler }
