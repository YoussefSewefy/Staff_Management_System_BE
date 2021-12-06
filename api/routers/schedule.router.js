const express = require('express')
const {
  verifyTA,
  verifyCCScheduleRequest,
  verifyTAorIns,
  verifyHODScheduleRequest,
  verifyScheduleOwner,
  verifyHOD,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  viewCourseLinkingRequest,
  acceptLinkingRequest,
  rejectLinkingRequest,
  sendLinkingRequest,
  cancelRequest,
  requestChangeDayOff,
  rejectChangeDayOff,
  acceptChangeDayOff,
  viewChangeDayOff,
} = require('../controllers/schedule.controller')
const {
  validateRejectLinkingRequest,
  validateAcceptLinkingRequest,
  validateViewCourseLinkingRequest,
  validateSendLinkingRequest,
  validateRequestChangeDayOff,
  validateViewChangeDayOff,
  validateAcceptChangeDayOff,
  validateRejectChangeDayOff,
  validateCancelRequest,
} = require('../middleware/validations/schedule.validations')

router.get(
  '/viewCourseLinkingRequest',
  validateViewCourseLinkingRequest,
  verifyTA,
  viewCourseLinkingRequest
)

router.put(
  '/acceptLinkingRequest',
  validateAcceptLinkingRequest,
  verifyCCScheduleRequest,
  acceptLinkingRequest
)

router.put(
  '/rejectLinkingRequest',
  validateRejectLinkingRequest,
  verifyCCScheduleRequest,
  rejectLinkingRequest
)

router.post(
  '/sendLinkingRequest',
  validateSendLinkingRequest,
  verifyTAorIns,
  sendLinkingRequest
)

router.post(
  '/requestChangeDayOff',
  validateRequestChangeDayOff,
  verifyTAorIns,
  requestChangeDayOff
)
router.get(
  '/viewChangeDayOff',
  validateViewChangeDayOff,
  verifyHOD,
  viewChangeDayOff
)
router.put(
  '/acceptChangeDayOff',
  validateAcceptChangeDayOff,
  verifyHODScheduleRequest,
  acceptChangeDayOff
)
router.put(
  '/rejectChangeDayOff',
  validateRejectChangeDayOff,
  verifyHODScheduleRequest,
  rejectChangeDayOff
)

router.put(
  '/cancelRequest',
  validateCancelRequest,
  verifyScheduleOwner,
  cancelRequest
)

module.exports = router
