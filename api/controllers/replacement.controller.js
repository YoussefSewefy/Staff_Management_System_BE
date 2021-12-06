const replacementmodel = require('../../models/replacement.model')
const staffmodel = require('../../models/staff.model')
const slotmodel = require('../../models/slot.model')
const notificationModel = require('../../models/notification.model')

const jwt = require('jsonwebtoken')
const { signingKey } = require('../../config/keys')

const {
  entityNotFound,
  canNotSendRequest,
  success,
  canNotUpdate,
} = require('../constants/statusCodes')
const { requestStatus, notificationType } = require('../constants/enums')

const createReplacementRequest = async (req, res) => {
  try {
    const request = req.body
    let targetDay = ''
    switch (new Date(request.targetDate).getDay()) {
      case 0:
        targetDay = 'sunday'
        break
      case 1:
        targetDay = 'monday'
        break
      case 2:
        targetDay = 'tuesday'
        break
      case 3:
        targetDay = 'wednesday'
        break
      case 4:
        targetDay = 'thursday'
        break
      case 5:
        targetDay = 'friday'
        break
      case 6:
        targetDay = 'saturday'
    }

    request.targetDate = new Date(request.targetDate)
    const dateNow = new Date(Date.now())

    if (request.targetDate <= dateNow) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'Target Date of request must be in the furture',
      })
    }
    const mySlot = await slotmodel.findOne({ _id: request.slotId })

    if (!mySlot) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Slot is not found',
      })
    }
    const myStaff = await staffmodel.findOne({ _id: req.data.id })
    if (mySlot.staffId != myStaff._id) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'This is not your slot',
      })
    }

    if (mySlot.day !== targetDay) {
      return res.json({
        statusCode: canNotSendRequest,
        error: `Target date is on a ${targetDay} but slot is on a ${mySlot.day}`,
      })
    }

    const staffFound = await staffmodel.findOne({ _id: request.receiverId })

    if (!staffFound) {
      return res.json({
        statusCode: entityNotFound,
        error: 'Receiver Account is not found',
      })
    }

    if (staffFound.type !== myStaff.type) {
      return res.json({
        statusCode: canNotSendRequest,
        error: `Request Receiver must also be ${myStaff.type}`,
      })
    }

    const slotsFound = await slotmodel.findOne({
      staffId: request.receiverId,
      day: targetDay,
      time: mySlot ? mySlot.time : 0,
    })

    if (slotsFound) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'Receiver is busy at that time',
      })
    }

    const replacementFound = await replacementmodel.findOne({
      receiverId: request.receiverId,
      targetDate: new Date(request.targetDate),
      status: requestStatus.ACCEPTED,
    })

    let replacementSlot = {}

    if (replacementFound) {
      replacementSlot = await slotmodel.findOne({
        slotId: replacementFound.slotId,
      })
    }

    if (replacementSlot && mySlot && replacementSlot.time === mySlot.time) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'Receiver is busy at that time',
      })
    }

    request.senderId = myStaff._id
    request.dateSent = dateNow
    request.status = requestStatus.PENDING

    const replacementReq = await replacementmodel.create(request)

    const notification = {
      type: notificationType.REPLACEMENT,
      description: 'Someone sent you a replacement request',
      seen: false,
      staffId: request.receiverId,
      redId: request._id,
    }
    const notif = await notificationModel.create(notification)

    return res.json({
      statusCode: success,
      request: replacementReq,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewReplacementRequest = async (req, res) => {
  try {
    const finalrequests = []
    let requestFound = await replacementmodel.find({
      receiverId: req.data.id,
    })
    const myName = (await staffmodel.findById(req.data.id)).name

    for (let i = 0; i < requestFound.length; i++) {
      const oneRequest = {
        senderName: (await staffmodel.findById(requestFound[i].senderId)).name,
        slot: await slotmodel.findById(requestFound[i].slotId),
        _id: requestFound[i]._id,
        targetDate: requestFound[i].targetDate,
        dateSent: requestFound[i].dateSent,
        senderId: requestFound[i].senderId,
        status: requestFound[i].status,
        receiverId: requestFound[i].receiverId,
        slotId: requestFound[i].slotId,
        recieverName: myName,
      }
      finalrequests.push(oneRequest)
    }
    let requestFound1 = await replacementmodel.find({
      senderId: req.data.id,
    })
    for (var i = 0; i < requestFound1.length; i++) {
      const oneRequest = {
        recieverName: (await staffmodel.findById(requestFound1[i].receiverId))
          .name,
        slot: await slotmodel.findById(requestFound1[i].slotId),
        _id: requestFound1[i]._id,
        targetDate: requestFound1[i].targetDate,
        dateSent: requestFound1[i].dateSent,
        senderId: requestFound1[i].senderId,
        status: requestFound1[i].status,
        receiverId: requestFound1[i].receiverId,
        slotId: requestFound1[i].slotId,
        senderName: myName,
      }
      finalrequests.push(oneRequest)
    }
    if (finalrequests.length > 0) {
      return res.json({
        statusCode: success,
        request: finalrequests,
      })
    } else {
      return res.json({
        statusCode: entityNotFound,
        error: 'no requests found',
      })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const cancelRequest = async (req, res) => {
  try {
    const requestFound = await replacementmodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else {
      await replacementmodel.findByIdAndUpdate(
        req.body.id,
        {
          status: requestStatus.CANCELED,
        },
        { useFindAndModify: false }
      )
      return res.json({ statusCode: success })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const rejectRequest = async (req, res) => {
  try {
    const requestFound = await replacementmodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else if (requestFound.targetDate < new Date(Date.now())) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Target Date has passed',
      })
    } else {
      await replacementmodel.findByIdAndUpdate(
        req.body.id,
        {
          status: requestStatus.REJECTED,
        },
        { useFindAndModify: false }
      )

      const notification = {
        type: notificationType.REPLACEMENT,
        description: 'Your replacement request has been rejected',
        seen: false,
        staffId: requestFound.senderId,
        redId: req.body.id,
      }
      const notif = await notificationModel.create(notification)
      return res.json({ statusCode: success })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const acceptRequest = async (req, res) => {
  try {
    const requestFound = await replacementmodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else if (requestFound.targetDate < new Date(Date.now())) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Target Date has passed',
      })
    } else {
      await replacementmodel.updateMany(
        {
          senderId: requestFound.senderId,
          targetDate: requestFound.targetDate,
          slotId: requestFound.slotId,
        },

        {
          status: requestStatus.CANCELED,
        }
      )

      await replacementmodel.findByIdAndUpdate(
        req.body.id,
        {
          status: requestStatus.ACCEPTED,
        },
        { useFindAndModify: false }
      )
      const notification = {
        type: notificationType.REPLACEMENT,
        description: 'Your replacement request has been accepted',
        seen: false,
        staffId: requestFound.senderId,
        redId: req.body.id,
      }
      const notif = await notificationModel.create(notification)
      return res.json({ statusCode: success })
    }
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
module.exports = {
  createReplacementRequest,
  viewReplacementRequest,
  cancelRequest,
  acceptRequest,
  rejectRequest,
}
