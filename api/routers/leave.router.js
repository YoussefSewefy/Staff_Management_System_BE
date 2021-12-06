const express = require('express')
const {
  verifyToken,
  verifyHR,
  verifyReset,
  verifyHRNOTME,
  verifyCIorHOD,
  verifyHOD,
  verifyNotHR,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  viewAllMyRequests,
  acceptRequest,
  rejectRequest,
  sendLeaveRequest,
  viewAllRequests,
  cancelRequest,
} = require('../controllers/leave.controller')
const {
  validateAcceptRequest,
  validateRejectRequest,
  validateSendRequest,
  validateCancelRequest,
} = require('../middleware/validations/leave.validation')

router.post('/viewAllMyRequests', verifyToken, viewAllMyRequests)
router.put('/acceptRequest', validateAcceptRequest, verifyHOD, acceptRequest)
router.put('/rejectRequest', validateRejectRequest, verifyHOD, rejectRequest)
router.post(
  '/sendLeaveRequest',
  validateSendRequest,
  verifyNotHR,
  sendLeaveRequest
)
router.post('/viewAllRequests', verifyHOD, viewAllRequests)
router.put('/cancelRequest', validateCancelRequest, verifyToken, cancelRequest)
module.exports = router
