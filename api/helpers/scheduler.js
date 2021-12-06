const schedule = require('node-schedule')
const staffmodel = require('../../models/staff.model')
const attendancemodel = require('../../models/attendence.model')
const rule = new schedule.RecurrenceRule()
rule.hour = 0
rule.minute = 0
rule.second = 0
rule.dayOfWeek = new schedule.Range(0, 6)
const everyDay = async () => {
  try {
    console.log('Executing day scheduler')
    const staff = await staffmodel.find()
    const today = new Date(new Date().setDate(new Date().getDate() - 1))
    const endDate = new Date()
    const attendence = await attendancemodel.find({
      signIn: { $gte: today, $lt: endDate },
      signOut: { $ne: null, $ne: undefined },
    })
    let staffmissing = []
    let targetDay = ''
    switch (today.getDay()) {
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
    for (let i = 0; i < staff.length; i++) {
      let f = false
      for (let j = 0; j < attendence.length; j++) {
        if (attendence[j].staffId == staff[i]._id) {
          f = true
          break
        }
      }
      if (!f && staff[i].dayOff !== targetDay && targetDay !== 'friday') {
        staffmissing.push(staff[i]._id)
      }
    }
    await staffmodel.updateMany(
      { _id: { $in: staffmissing } },
      { $inc: { missingDays: 1 } }
    )
  } catch (exception) {
    console.log(exception)
  }
}

const daySchedule = async () => {
  schedule.scheduleJob(rule, everyDay)
}
module.exports = { daySchedule }
