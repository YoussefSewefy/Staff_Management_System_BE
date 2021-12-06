const express = require('express')
const {
  verifyTAorIns,
  verifyReceiverReplacementRequest,
  verifySenderReplacementRequest,
  verifyReceiverSenderReplacementRequest,
  verifyToken,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  createReplacementRequest,
  viewReplacementRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
} = require('../controllers/replacement.controller')
const {
  validateCreateReplacementRequest,
  validateCancelReplacementRequest,
  validateAcceptReplacementRequest,
  validateRejectReplacementRequest,
} = require('../middleware/validations/replacement.validations')

router.post(
  '/createReplacementRequest',
  validateCreateReplacementRequest,
  verifyTAorIns,
  createReplacementRequest
)

router.get('/viewReplacementRequest', verifyToken, viewReplacementRequest)
router.put(
  '/cancelReplacementRequest',
  validateCancelReplacementRequest,
  verifySenderReplacementRequest,
  cancelRequest
)
router.put(
  '/acceptReplacementRequest',
  validateAcceptReplacementRequest,
  verifyReceiverReplacementRequest,
  acceptRequest
)
router.put(
  '/rejectReplacementRequest',
  validateRejectReplacementRequest,
  verifyReceiverReplacementRequest,
  rejectRequest
)
module.exports = router
