const express = require('express')
const { verifyHR, verifyToken, verifyHRCIHOD } = require('../auth/verifyToken')
const router = express.Router()
const {
  addDepartment,
  deleteDepartment,
  upDateDepartment,
  getDepartments,
  getTAsinDepartment,
  viewAllDep,
} = require('../controllers/department.controller')
const {
  validateAddDepartment,
  validateupdateDepartment,
  validateDeleteDepartment,
} = require('../middleware/validations/department.validations')

router.post('/addDepartment', validateAddDepartment, verifyHR, addDepartment)
router.delete(
  '/deleteDepartment',
  validateDeleteDepartment,
  verifyHR,
  deleteDepartment
)
router.put(
  '/updateDepartment',
  validateupdateDepartment,
  verifyHR,
  upDateDepartment
)
router.get('/viewAllDepartments', verifyHR, viewAllDep)

router.post('/getDepartments', verifyHRCIHOD, getDepartments)
router.post(
  '/getTAsinDepartment',
  validateDeleteDepartment,
  verifyToken,
  getTAsinDepartment
)

module.exports = router
