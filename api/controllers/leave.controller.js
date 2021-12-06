const staffmodel = require('../../models/staff.model')
const locationmodel = require('../../models/location.model')
const leaveModel = require('../../models/leave.model')
const replacementModel = require('../../models/replacement.model')
const scheduleModel = require('../../models/schedule.model')
const attendanceModel = require('../../models/attendence.model')
const { checkDateExist } = require('../helpers/dates.helper')
const notificationModel = require('../../models/notification.model')

const courseStaffModel = require('../../models/courseStaff.model')
const slotmodel = require('../../models/slot.model')
const coursemodel = require('../../models/course.model')

const {
  entityNotFound,
  unknown,
  success,
  dateDoesNotExist,
  dateCannotBeInThePast,
  validation,
  startDateMustBeBeforeEndTime,
  cannotCancelRequest,
  leaveMustBeMaxThree,
  leaveBalanceLimitReached,
  requestExceedsBalance,
  canNotSendRequest,
  alreadyAccepted,
} = require('../constants/statusCodes')
const {
  requestStatus,
  leaveRequestType,
  notificationType,
  scheduleType,
} = require('../constants/enums')
const departmentModel = require('../../models/department.model')

const viewAllMyRequests = async (req, res) => {
  try {
    if (req.body.type) {
      var allRequests = []
      if (req.body.type === 'linking') {
        const finalScheduleRequests = []
        const scheduleRequests = await scheduleModel.find({
          staffId: req.data.id,
          type: scheduleType.LINKING,
        })
        for (var i = 0; i < scheduleRequests.length; i++) {
          const oneRequest = {
            _id: scheduleRequests[i]._id,
            staffId: scheduleRequests[i].staffId,
            status: scheduleRequests[i].status,
            message: scheduleRequests[i].message,
            slotId: scheduleRequests[i].slotId,
          }
          oneRequest.staffName = (
            await staffmodel.findById(scheduleRequests[i].staffId)
          ).name
          oneRequest.slot = await slotmodel.findById(scheduleRequests[i].slotId)
          oneRequest.courseName = (
            await coursemodel.findById(oneRequest.slot.courseId)
          ).name
          finalScheduleRequests.push(oneRequest)
        }
        allRequests = allRequests.concat(finalScheduleRequests)

        return res.json({
          statusCode: success,
          allRequests,
        })
      } else if (req.body.type === 'changeDay') {
        const schedule = await scheduleModel.find({
          staffId: req.data.id,
          type: scheduleType.CHANGEDAY,
        })
        const schedulefinal = []
        for (var i = 0; i < schedule.length; i++) {
          const oneRequest = {
            staffName: (await staffmodel.findById(schedule[i].staffId)).name,
            _id: schedule[i]._id,
            dayOff: schedule[i].dayOff,
            reason: schedule[i].reason,
            message: schedule[i].message,
            staffId: schedule[i].staffId,
            status: schedule[i].status,
          }
          schedulefinal.push(oneRequest)
        }
        allRequests = allRequests.concat(schedulefinal)
        return res.json({
          statusCode: success,
          allRequests,
        })
      } else if (req.body.type === 'replacement') {
        const replacement = await replacementModel.find({
          senderId: req.data.id,
        })
        replacement = replacement.concat(
          await replacementModel.find({
            receiverId: req.data.id,
          })
        )
        allRequests = allRequests.concat(replacement)

        return res.json({
          statusCode: success,
          allRequests,
        })
      } else if (req.body.type === 'leave') {
        const leave = await leaveModel.find({
          senderId: req.data.id,
        })
        const final = []
        for (var i = 0; i < leave.length; i++) {
          const oneRequest = {
            staffName: (await staffmodel.findById(leave[i].senderId)).name,
            _id: leave[i]._id,
            reason: leave[i].reason,
            message: leave[i].message,
            senderId: leave[i].senderId,
            status: leave[i].status,
            type: leave[i].type,
            receiverId: leave[i].receiverId,
            replacementRequestId: leave[i].replacementRequestId,
            dateSent: leave[i].dateSent,
            targetStartDate: leave[i].targetStartDate,
            targetEndDate: leave[i].targetEndDate,
            documentUrl: leave[i].documentUrl,
          }
          const requestFound = []
          var RequestFoundOne = {}
          for (var j = 0; j < leave[i].replacementRequestId.length; j++) {
            RequestFoundOne = await replacementModel.findById(
              leave[i].replacementRequestId[j]
            )
            requestFound.push(RequestFoundOne)
          }
          const finalReplacement = []

          for (let i = 0; i < requestFound.length; i++) {
            const oneRequest = {
              senderName: (await staffmodel.findById(requestFound[i].senderId))
                .name,
              slot: await slotmodel.findById(requestFound[i].slotId),
              _id: requestFound[i]._id,
              targetDate: requestFound[i].targetDate,
              dateSent: requestFound[i].dateSent,
              senderId: requestFound[i].senderId,
              status: requestFound[i].status,
              receiverId: requestFound[i].receiverId,
              slotId: requestFound[i].slotId,
              recieverName: (
                await staffmodel.findById(requestFound[i].receiverId)
              ).name,
            }
            finalReplacement.push(oneRequest)
          }
          oneRequest.replacementRequest = finalReplacement
          final.push(oneRequest)
        }
        // allRequests = allRequests.concat(leave)
        return res.json({
          statusCode: success,
          allRequests: final,
        })
      } else {
        return res.json({
          statusCode: canNotSendRequest,
          error: 'type is not valid',
        })
      }
    } else {
      var allRequests = []
      const leave = await leaveModel.find({
        senderId: req.data.id,
      })

      const replacement = await replacementModel.find({
        senderId: req.data.id,
      })

      const schedule = await scheduleModel.find({
        staffId: req.data.id,
        type: scheduleType.CHANGEDAY,
      })
      const schedulefinal = []
      for (var i = 0; i < schedule.length; i++) {
        const oneRequest = {
          staffName: (await staffmodel.findById(schedule[i].staffId)).name,
          _id: schedule[i]._id,
          dayOff: schedule[i].dayOff,
          reason: schedule[i].reason,
          message: schedule[i].message,
          staffId: schedule[i].staffId,
          status: schedule[i].status,
        }
        schedulefinal.push(oneRequest)
      }

      const finalScheduleRequests = []
      const scheduleRequests = await scheduleModel.find({
        staffId: req.data.id,
        type: scheduleType.LINKING,
      })

      for (var i = 0; i < scheduleRequests.length; i++) {
        const oneRequest = {
          _id: scheduleRequests[i]._id,
          staffId: scheduleRequests[i].staffId,
          status: scheduleRequests[i].status,
          message: scheduleRequests[i].message,
          slotId: scheduleRequests[i].slotId,
        }
        oneRequest.staffName = (
          await staffmodel.findById(scheduleRequests[i].staffId)
        ).name
        oneRequest.slot = await slotmodel.findById(scheduleRequests[i].slotId)
        oneRequest.courseName = (
          await coursemodel.findById(oneRequest.slot.courseId)
        ).name
        finalScheduleRequests.push(oneRequest)
      }

      allRequests.push(leave)
      allRequests.push(replacement)
      allRequests.push(schedulefinal)
      allRequests.push(finalScheduleRequests)
      return res.json({
        statusCode: success,
        allRequests,
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
const acceptRequest = async (req, res) => {
  try {
    const requesting = await leaveModel.findById(req.body.leaveId)

    if (requesting.status !== requestStatus.PENDING)
      return res.json({
        statusCode: alreadyAccepted,
        error: 'request must be pending',
      })

    const notification = {
      type: notificationType.LEAVE,
      description: 'One of your leave requests has been accepted',
      seen: false,
      staffId: requesting.senderId,
      redId: requesting._id,
    }
    const endDate = requesting.targetEndDate
    const startDate = requesting.targetStartDate
    const today = new Date()
    let max, min
    if (today.getDate() <= 10) {
      min = new Date(today.getFullYear(), today.getMonth() - 1, 11)
      max = new Date(today.getFullYear(), today.getMonth(), 11)
    } else {
      min = new Date(today.getFullYear(), today.getMonth(), 11)
      max = new Date(today.getFullYear(), today.getMonth() + 1, 11)
    }
    let diff1
    let daysToBeCompensated
    if (
      startDate < max &&
      startDate >= min &&
      endDate < max &&
      endDate >= min
    ) {
      diff1 = endDate - startDate
      daysToBeCompensated = diff1 / 86400000 + 1
    } else if (startDate < max && startDate >= min) {
      diff1 = max - startDate
      daysToBeCompensated = diff1 / 86400000 + 1
    } else if (endDate < max && endDate >= min) {
      diff1 = endDate - min
      daysToBeCompensated = diff1 / 86400000 + 1
    } else if (startDate < min && endDate >= max) {
      diff1 = max - min
      daysToBeCompensated = diff1 / 86400000 + 1
    }

    const diff = endDate - startDate
    const days = (diff / 86400000) * -1

    const sender = await staffmodel.findById(requesting.senderId)
    if (requesting.type == leaveRequestType.ACCIDENTAL) {
      if (sender.accidentalBalance + days - 1 < 0) {
        return res.json({
          statusCode: leaveBalanceLimitReached,
          error: `Cannot accept an accidental leave request that has more days than the accidental balance, you are trying to
            send an accidental leave of ${
              days * -1 + 1
            } and your accidental balance is ${sender.accidentalBalance}`,
        })
      }
    }
    if (
      sender.leaveBalance + days - 1 < 0 &&
      requesting.type != leaveRequestType.MATERNITY &&
      requesting.type != leaveRequestType.SICK &&
      requesting.type != leaveRequestType.COMPENSATION
    )
      return res.json({
        statusCode: leaveBalanceLimitReached,
        error:
          'Cannot accept a leave request that has more days than the leave balance',
      })
    if (
      requesting.type != leaveRequestType.MATERNITY &&
      requesting.type != leaveRequestType.SICK &&
      requesting.type != leaveRequestType.COMPENSATION
    ) {
      if (requesting.type == leaveRequestType.ACCIDENTAL) {
        const updated = await staffmodel.findByIdAndUpdate(
          requesting.senderId,
          {
            $inc: { leaveBalance: days - 1 },
            $inc: { accidentalBalance: days - 1 },
          },
          { useFindAndModify: false }
        )
      } else {
        const updated = await staffmodel.findByIdAndUpdate(
          requesting.senderId,
          {
            $inc: { leaveBalance: days - 1 },
          },
          { useFindAndModify: false }
        )
      }
    }
    if (requesting.type == leaveRequestType.COMPENSATION) {
      if (daysToBeCompensated) {
        const updated1 = await staffmodel.findByIdAndUpdate(
          requesting.senderId,
          {
            $inc: { daysToBeCompensatedDays: daysToBeCompensated },
          },
          { useFindAndModify: false }
        )
      }
    } else {
      if (daysToBeCompensated) {
        const updated1 = await staffmodel.findByIdAndUpdate(
          requesting.senderId,
          {
            $inc: { compensatedDays: daysToBeCompensated },
          },
          { useFindAndModify: false }
        )
      }
    }

    const request = await leaveModel.findByIdAndUpdate(
      req.body.leaveId,
      {
        status: requestStatus.ACCEPTED,
      },
      { useFindAndModify: false }
    )

    const notif = await notificationModel.create(notification)
    return res.json({
      statusCode: success,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: exception.message,
      statusCode: unknown,
    })
  }
}
const rejectRequest = async (req, res) => {
  try {
    var request = 0
    const requesting = await leaveModel.findById(req.body.leaveId)
    if (requesting.status !== requestStatus.PENDING)
      return res.json({
        statusCode: alreadyAccepted,
        error: 'request must be pending',
      })
    if (req.body.message) {
      request = await leaveModel.findByIdAndUpdate(
        req.body.leaveId,
        {
          status: requestStatus.REJECTED,
          message: req.body.message,
        },
        { useFindAndModify: false }
      )
    } else {
      request = await leaveModel.findByIdAndUpdate(
        req.body.leaveId,
        {
          status: requestStatus.REJECTED,
        },
        { useFindAndModify: false }
      )
    }
    const notification = {
      type: notificationType.LEAVE,
      description: 'One of your leave requests has been rejected',
      seen: false,
      staffId: request.senderId,
      redId: request._id,
    }
    const notif = await notificationModel.create(notification)
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

const sendLeaveRequest = async (req, res) => {
  try {
    const request = req.body

    const staff = await staffmodel.findById(req.data.id)
    if (
      request.type == leaveRequestType.MATERNITY &&
      staff.gender != 'female'
    ) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'Only females can send maternity leaves',
      })
    }
    if (
      (request.type == leaveRequestType.SICK ||
        request.type == leaveRequestType.MATERNITY) &&
      !request.documentUrl
    ) {
      return res.json({
        statusCode: validation,
        error: 'A document is required for sick and maternity leaves',
      })
    }
    if (request.replacementRequestId) {
      for (let i = 0; i < request.replacementRequestId; i++) {
        const replacement = await replacementModel.findById(
          replacementRequestId[i]
        )
        if (!replacement) {
          return res.json({
            statusCode: entityNotFound,
            error: `The ${i + 1}th replacement request is not found`,
          })
        }
      }
    }
    const splitStart = request.targetStartDate.split('-')
    const splitEnd = request.targetEndDate.split('-')
    let dateExists = checkDateExist(splitStart[0], splitStart[1], splitStart[2])
    if (!dateExists) {
      return res.json({
        statusCode: dateDoesNotExist,
        error: 'start date does not exist',
      })
    }
    dateExists = checkDateExist(splitEnd[0], splitEnd[1], splitEnd[2])
    if (!dateExists) {
      return res.json({
        statusCode: dateDoesNotExist,
        error: 'end date does not exist',
      })
    }
    let startDate = new Date(splitStart[0], splitStart[1] - 1, splitStart[2])
    let endDate = new Date(splitEnd[0], splitEnd[1] - 1, splitEnd[2])
    request.targetStartDate = startDate
    request.targetEndDate = endDate
    const date = new Date()
    if (
      request.type == leaveRequestType.ANNUAL ||
      request.type == leaveRequestType.MATERNITY
    ) {
      if (date > startDate) {
        return res.json({
          statusCode: dateCannotBeInThePast,
          error: 'start date can not be in the past',
        })
      }
      if (date > endDate) {
        return res.json({
          statusCode: dateCannotBeInThePast,
          error: 'end date can not be in the past',
        })
      }
    }

    if (startDate > endDate) {
      return res.json({
        statusCode: startDateMustBeBeforeEndTime,
        error: 'start date must be before end date',
      })
    }
    const diff = endDate - startDate
    const diffSick = date - startDate
    const months = diff / 2629746000
    const days = diff / 86400000 + 1
    const daysSick = diffSick / 86400000
    if (request.type == leaveRequestType.SICK && daysSick > 3) {
      return res.json({
        statusCode: leaveMustBeMaxThree,
        error:
          'Sick leaves must be sent after 3 days maximum from the target day',
      })
    }
    if (request.type == leaveRequestType.MATERNITY) {
      if (months > 3) {
        return res.json({
          statusCode: leaveMustBeMaxThree,
          error: 'Maternity leaves cannot exceed 3 months',
        })
      }
    }
    request.senderId = req.data.id
    if (
      request.type != leaveRequestType.MATERNITY &&
      request.type != leaveRequestType.SICK &&
      request.type != leaveRequestType.COMPENSATION
    ) {
      if (staff.leaveBalance == 0) {
        return res.json({
          statusCode: leaveBalanceLimitReached,
          error: 'Your leave balance limit is reached',
        })
      } else if (staff.leaveBalance < days) {
        return res.json({
          statusCode: requestExceedsBalance,
          error: 'Your request exceeds your balance',
        })
      }
    }
    const dept = await departmentModel.findById(staff.department)
    request.receiverId = dept.HODId
    request.status = requestStatus.PENDING
    request.dateSent = new Date()

    const newRequest = new leaveModel(request)
    await newRequest.save()
    const notification = {
      type: notificationType.LEAVE,
      description: 'You have a new leave request',
      seen: false,
      staffId: request.receiverId,
      redId: newRequest._id,
    }
    const notif = await notificationModel.create(notification)
    return res.json({ statusCode: success, request: newRequest })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllRequests = async (req, res) => {
  try {
    const HOD = await staffmodel.findById(req.data.id)
    const allStaff = await staffmodel.find({
      department: HOD.department,
    })
    if (req.body.type) {
      var allRequests = {
        leave: [],
        scheduleChangeDay: [],
        scheduleLinking: [],
        replacement: [],
      }
      if (req.body.type === 'linking') {
        for (let i = 0; i < allStaff.length; i++) {
          const scheduleLinking = await scheduleModel.find({
            staffId: allStaff[i]._id,
            type: scheduleType.LINKING,
          })
          if (scheduleLinking.length > 0)
            allRequests.scheduleLinking = allRequests.scheduleLinking.concat(
              scheduleLinking
            )
        }
        for (var i = 0; i < allRequests.scheduleLinking.length; i++) {
          const oneRequest = {
            _id: allRequests.scheduleLinking[i]._id,
            staffId: allRequests.scheduleLinking[i].staffId,
            status: allRequests.scheduleLinking[i].status,
            message: allRequests.scheduleLinking[i].message,
            slotId: allRequests.scheduleLinking[i].slotId,
          }
          oneRequest.staffName = (
            await staffmodel.findById(allRequests.scheduleLinking[i].staffId)
          ).name
          oneRequest.slot = await slotmodel.findById(
            allRequests.scheduleLinking[i].slotId
          )
          oneRequest.courseName = (
            await coursemodel.findById(oneRequest.slot.courseId)
          ).name
          allRequests.scheduleLinking[i] = oneRequest
        }
        return res.json({
          statusCode: success,
          returnData: allRequests.scheduleLinking,
        })
      } else if (req.body.type === 'changeDay') {
        for (let i = 0; i < allStaff.length; i++) {
          const scheduleChangeDay = await scheduleModel.find({
            staffId: allStaff[i]._id,
            type: scheduleType.CHANGEDAY,
          })
          if (scheduleChangeDay.length > 0)
            allRequests.scheduleChangeDay = allRequests.scheduleChangeDay.concat(
              scheduleChangeDay
            )
        }
        return res.json({
          statusCode: success,
          returnData: allRequests.scheduleChangeDay,
        })
      } else if (req.body.type === 'leave') {
        for (let i = 0; i < allStaff.length; i++) {
          const leave = await leaveModel.find({
            senderId: allStaff[i]._id,
          })

          if (leave.length > 0)
            allRequests.leave = allRequests.leave.concat(leave)
        }
        const leave = allRequests.leave
        const final = []
        for (var i = 0; i < leave.length; i++) {
          const oneRequest = {
            staffName: (await staffmodel.findById(leave[i].senderId)).name,
            _id: leave[i]._id,
            reason: leave[i].reason,
            message: leave[i].message,
            senderId: leave[i].senderId,
            status: leave[i].status,
            type: leave[i].type,
            receiverId: leave[i].receiverId,
            replacementRequestId: leave[i].replacementRequestId,
            dateSent: leave[i].dateSent,
            targetStartDate: leave[i].targetStartDate,
            targetEndDate: leave[i].targetEndDate,
            documentUrl: leave[i].documentUrl,
          }
          const requestFound = []
          var RequestFoundOne = {}
          for (var j = 0; j < leave[i].replacementRequestId.length; j++) {
            RequestFoundOne = await replacementModel.findById(
              leave[i].replacementRequestId[j]
            )
            requestFound.push(RequestFoundOne)
          }
          const finalReplacement = []

          for (let i = 0; i < requestFound.length; i++) {
            const oneRequest = {
              senderName: (await staffmodel.findById(requestFound[i].senderId))
                .name,
              slot: await slotmodel.findById(requestFound[i].slotId),
              _id: requestFound[i]._id,
              targetDate: requestFound[i].targetDate,
              dateSent: requestFound[i].dateSent,
              senderId: requestFound[i].senderId,
              status: requestFound[i].status,
              receiverId: requestFound[i].receiverId,
              slotId: requestFound[i].slotId,
              recieverName: (
                await staffmodel.findById(requestFound[i].receiverId)
              ).name,
            }
            finalReplacement.push(oneRequest)
          }
          oneRequest.replacementRequest = finalReplacement
          final.push(oneRequest)
        }
        return res.json({
          statusCode: success,
          returnData: final,
        })
      } else if (req.body.type === 'replacement') {
        for (let i = 0; i < allStaff.length; i++) {
          const replacement = await replacementModel.find({
            senderId: allStaff[i]._id,
          })

          if (replacement.length > 0)
            allRequests.replacement = allRequests.replacement.concat(
              replacement
            )
        }
        for (let i = 0; i < allRequests.replacement.length; i++) {
          oneRequest = {
            senderName: (
              await staffmodel.findById(allRequests.replacement[i].senderId)
            ).name,
            recieverName: (
              await staffmodel.findById(allRequests.replacement[i].receiverId)
            ).name,
            slot: await slotmodel.findById(allRequests.replacement[i].slotId),
          }
          allRequests.replacement[i] = {
            ...allRequests.replacement[i],
            ...oneRequest,
          }
        }
        return res.json({
          statusCode: success,
          returnData: allRequests.replacement,
        })
      } else {
        return res.json({
          statusCode: success,
          returnData: allRequests.replacement,
        })
      }
    } else {
      var allRequests = {
        leave: [],
        scheduleChangeDay: [],
        scheduleLinking: [],
        replacement: [],
      }
      for (let i = 0; i < allStaff.length; i++) {
        const leave = await leaveModel.find({
          senderId: allStaff[i]._id,
        })

        const replacement = await replacementModel.find({
          senderId: allStaff[i]._id,
        })

        const scheduleChangeDay = await scheduleModel.find({
          staffId: allStaff[i]._id,
          type: scheduleType.CHANGEDAY,
        })

        const scheduleLinking = await scheduleModel.find({
          staffId: allStaff[i]._id,
          type: scheduleType.LINKING,
        })

        if (leave.length > 0)
          allRequests.leave = allRequests.leave.concat(leave)

        if (replacement.length > 0)
          allRequests.replacement = allRequests.replacement.concat(replacement)

        if (scheduleChangeDay.length > 0)
          allRequests.scheduleChangeDay = allRequests.scheduleChangeDay.concat(
            scheduleChangeDay
          )

        if (scheduleLinking.length > 0)
          allRequests.scheduleLinking = allRequests.scheduleLinking.concat(
            scheduleLinking
          )
      }

      for (let i = 0; i < allRequests.replacement.length; i++) {
        oneRequest = {
          senderName: (
            await staffmodel.findById(allRequests.replacement[i].senderId)
          ).name,
          recieverName: (
            await staffmodel.findById(allRequests.replacement[i].receiverId)
          ).name,
          slot: await slotmodel.findById(allRequests.replacement[i].slotId),
        }
        allRequests.replacement[i] = {
          ...allRequests.replacement[i],
          ...oneRequest,
        }
      }

      for (var i = 0; i < allRequests.scheduleLinking.length; i++) {
        const oneRequest = {
          _id: allRequests.scheduleLinking[i]._id,
          staffId: allRequests.scheduleLinking[i].staffId,
          status: allRequests.scheduleLinking[i].status,
          message: allRequests.scheduleLinking[i].message,
          slotId: allRequests.scheduleLinking[i].slotId,
        }
        oneRequest.staffName = (
          await staffmodel.findById(allRequests.scheduleLinking[i].staffId)
        ).name
        oneRequest.slot = await slotmodel.findById(
          allRequests.scheduleLinking[i].slotId
        )
        oneRequest.courseName = (
          await coursemodel.findById(oneRequest.slot.courseId)
        ).name
        allRequests.scheduleLinking[i] = oneRequest
      }
      return res.json({
        statusCode: success,
        allRequests,
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
    var request = 0
    request = await leaveModel.findById(req.body.leaveId)
    if (request.status != requestStatus.PENDING) {
      return res.json({
        error: 'request must be pending',
        statusCode: cannotCancelRequest,
      })
    }
    request = await leaveModel.findByIdAndUpdate(
      req.body.leaveId,
      {
        status: requestStatus.CANCELED,
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
  viewAllMyRequests,
  acceptRequest,
  rejectRequest,
  sendLeaveRequest,
  viewAllRequests,
  cancelRequest,
}
