const express = require('express')
const {
  verifyToken,
  verifyHR,
  verifyReset,
  verifyHRNOTME,
  verifyCIorHOD,
  verifyHOD,
  verifyNotHR,
  verifyHRCIHOD,
} = require('../auth/verifyToken')
const router = express.Router()
const {
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
  viewMyProfile,
  viewAllProfiles,
  updateMyProfile,
  updateProfile,
  checkSalarySoFar,
  viewStaffPerDepartment2,
} = require('../controllers/staff.controller')
const {
  valdiateLogIn,
  validateAddStaff,
  validateDeleteStaff,
  validateResetPassword,
  validateResetPasswordHR,
  validateUpdateSalary,
  validateupdateMyProfile,
  validateupdateProfile,
} = require('../middleware/validations/staff.validations')

router.put('/logIn', valdiateLogIn, logIn)
router.put('/logOut', verifyToken, logOut)
router.post('/addStaff', validateAddStaff, verifyHR, addStaff)
router.delete('/deleteStaff', validateDeleteStaff, verifyHR, deleteStaff)
router.put('/resetPassword', validateResetPassword, verifyReset, resetPassword)
router.put(
  '/resetPasswordHR',
  validateResetPasswordHR,
  verifyHRNOTME,
  resetPasswordHR
)
router.get('/viewMissingDays', verifyToken, viewMissingDays)
router.put('/updateSalary', validateUpdateSalary, verifyHR, updateSalary)
router.get('/viewMembersMissing', verifyHR, viewMembersMissing)
router.get('/viewStaffPerDepartment', verifyCIorHOD, viewStaffPerDepartment)
router.get('/viewStaffPerDepartment2', verifyNotHR, viewStaffPerDepartment2)
router.post('/viewStaffPerDepartment', verifyCIorHOD, viewStaffPerDepartment)

router.post('/viewStaffPerDepartment1', verifyToken, viewStaffPerDepartment)
router.get('/viewDaysOff', verifyHOD, viewDaysOff)
router.get('/viewDifferenceHours', verifyToken, viewDifferenceHours)
router.get('/viewMyProfile', verifyToken, viewMyProfile)
router.get('/viewAllProfiles', verifyHRCIHOD, viewAllProfiles)
router.put(
  '/updateMyProfile',
  validateupdateMyProfile,
  verifyToken,
  updateMyProfile
)
router.put('/updateProfile', validateupdateProfile, verifyHR, updateProfile)
router.get('/checkSalarySoFar', verifyToken, checkSalarySoFar)
module.exports = router
