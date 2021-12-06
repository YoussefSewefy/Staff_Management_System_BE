const notificationModel = require('../../models/notification.model')
const sModel = require('../../models/schedule.model')
const { notificationType } = require('../constants/enums')

const { entityNotFound, unknown, success } = require('../constants/statusCodes')

const viewNotifications = async (req, res) => {
  try {
    const n = await notificationModel.find({
      staffId: req.data.id,
    })
    var notifications = []
    for (let i = 0; i < n.length; i++) {
      var t
      if (n[i].type == notificationType.SCHEDULE) {
        s = await sModel.findById(n[i].redId)
        t = s.type
      } else {
        t = n[i].type
      }

      const n1 = {
        _id: n[i]._id,
        type: t,
        description: n[i].description,
        seen: n[i].seen,
      }
      notifications.push(n1)
    }

    return res.json({
      statusCode: success,
      notifications,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const removeNotification = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndDelete(
      req.body.notificationId
    )
    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const setNotificationSeen = async (req, res) => {
  try {
    const notification = await notificationModel.findByIdAndUpdate(
      req.body.notificationId,
      {
        seen: true,
      },
      { useFindAndModify: false }
    )
    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

module.exports = {
  viewNotifications,
  removeNotification,
  setNotificationSeen,
}
