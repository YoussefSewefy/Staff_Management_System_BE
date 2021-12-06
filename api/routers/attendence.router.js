const express = require('express')
const { verifyToken, verifyHRNOTME, verifyHR } = require('../auth/verifyToken')
const router = express.Router()
const {
  signIn,
  signOut,
  manualSignIn,
  manualSignOut,
  viewAttendance,
  viewAllAttendance,
  viewAllAttendanceWithoutSignIn,
  viewAllAttendanceWithoutSignOut,
  namesAndIds,
} = require('../controllers/attendence.controller')
const {
  validManualSignIn,
  validManualSignOut,
  validateViewAll,
} = require('../middleware/validations/attendence.validations')

router.post('/signIn', verifyToken, signIn)
router.post('/signOut', verifyToken, signOut)
router.post('/manualSignIn', validManualSignIn, verifyHRNOTME, manualSignIn)
router.post('/manualSignOut', validManualSignOut, verifyHRNOTME, manualSignOut)
router.get('/viewAttendance', verifyToken, viewAttendance)
router.get('/viewAllAttendance', validateViewAll, verifyHR, viewAllAttendance)
router.post(
  '/viewAllAttendanceWithoutSignIn',
  validateViewAll,
  verifyHR,
  viewAllAttendanceWithoutSignIn
)
router.post(
  '/viewAllAttendanceWithoutSignOut',
  validateViewAll,
  verifyHR,
  viewAllAttendanceWithoutSignOut
)
router.get('/getNamesAndIds', verifyToken, namesAndIds)

module.exports = router
