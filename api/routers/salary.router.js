const express = require('express')
const { verifyToken, verifyHR } = require('../auth/verifyToken')
const router = express.Router()
const {
  viewAllSalaries,
  viewMySalary,
  viewStaffSalary,
} = require('../controllers/salary.controller')
const {
  validateViewSalary,
  validateViewAllSalaries,
  validateViewStaffSalary,
} = require('../middleware/validations/salary.validations')

router.get(
  '/viewAllSalaries',
  validateViewAllSalaries,
  verifyHR,
  viewAllSalaries
)
router.get('/viewMySalary', validateViewSalary, verifyToken, viewMySalary)
router.post(
  '/viewStaffSalary',
  validateViewStaffSalary,
  verifyToken,
  viewStaffSalary
)

module.exports = router
