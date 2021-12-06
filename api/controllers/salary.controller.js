const salaryModel = require('../../models/salary.model')
const { success, unknown } = require('../constants/statusCodes')

const viewAllSalaries = async (req, res) => {
  try {
    const salaries = await salaryModel.find({
      month: req.body.month,
      year: req.body.year,
    })
    return res.json({ statusCode: success, salaries: salaries })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewMySalary = async (req, res) => {
  try {
    const salary = await salaryModel.findOne({
      staffId: req.data.id,
      month: req.body.month,
      year: req.body.year,
    })
    return res.json({ statusCode: success, salary: salary })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewStaffSalary = async (req, res) => {
  try {
    const salary = await salaryModel.findOne({
      staffId: req.body.staffId,
      month: req.body.month,
      year: req.body.year,
    })
    return res.json({ statusCode: success, salary: salary })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
module.exports = {
  viewAllSalaries,
  viewMySalary,
  viewStaffSalary,
}
