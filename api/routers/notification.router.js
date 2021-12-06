const express = require('express')
const { verifyNotHR } = require('../auth/verifyToken')
const router = express.Router()
const {
  viewNotifications,
  removeNotification,
  setNotificationSeen,
} = require('../controllers/notification.controller')
const {
  validateRemoveNotification,
  validateSetSeen,
} = require('../middleware/validations/notification.validation')

router.get('/viewNotifications', verifyNotHR, viewNotifications)
router.delete(
  '/removeNotification',
  validateRemoveNotification,
  verifyNotHR,
  removeNotification
)
router.put(
  '/setNotificationSeen',
  validateSetSeen,
  verifyNotHR,
  setNotificationSeen
)
module.exports = router
