const schedulemodel = require('../../models/schedule.model')
const staffmodel = require('../../models/staff.model')
const slotmodel = require('../../models/slot.model')
const coursestaffmodel = require('../../models/courseStaff.model')
const coursemodel = require('../../models/course.model')
const notificationModel = require('../../models/notification.model')
const departmentModel = require('../../models/notification.model')
const { request } = require('express')

const jwt = require('jsonwebtoken')
const { signingKey } = require('../../config/keys')

const {
  entityNotFound,
  canNotSendRequest,
  success,
  canNotUpdate,
  unknown,
} = require('../constants/statusCodes')
const {
  requestStatus,
  roleInCourse,
  scheduleType,
  notificationType,
} = require('../constants/enums')
const scheduleModel = require('../../models/schedule.model')

const viewCourseLinkingRequest = async (req, res) => {
  try {
    const staff = await staffmodel.findById(req.data.id)

    const courseFound = await coursemodel.find({
      courseCoordinatorId: req.data.id,
    })

    if (courseFound.length === 0) {
      return res.json({
        statusCode: entityNotFound,
        error: 'You are not a coordinator in any course',
      })
    }

    const courseIds = []
    for (let i = 0; i < courseFound.length; i++) {
      courseIds.push(courseFound[i]._id)
    }
    // const courseStaff = await coursestaffmodel.find({
    //   courseId: { $in: courseIds },
    // })

    // const courseStaffId = []
    // for (let i = 0; i < courseStaff.length; i++) {
    //   courseStaffId.push(courseStaff[i].courseId)
    // }
    const slots = await slotmodel.find({
      courseId: { $in: courseIds },
    })
    if (slots.length === 0) {
      return res.json({
        statusCode: entityNotFound,
        error: 'There are no slots for the courses you are a coordiator on',
      })
    }

    let slotId = []
    for (let i = 0; i < slots.length; i++) {
      slotId.push(slots[i]._id)
    }
    const scheduleRequests = await schedulemodel.find({
      slotId: { $in: slotId },
      type: scheduleType.LINKING,
    })
    const finalScheduleRequests = []
    if (scheduleRequests.length === 0) {
      return res.json({
        statusCode: entityNotFound,
        error:
          'There are no linking requests for the courses you are a coordiator in ',
      })
    } else {
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
    }

    return res.json({
      statusCode: success,
      scheduleRequests: finalScheduleRequests,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const acceptLinkingRequest = async (req, res) => {
  try {
    const scheduleRequest = await schedulemodel.findById(req.body.id)
    if (!scheduleRequest) {
      return res.json({
        error: 'Schedule Request not found',
        statusCode: entityNotFound,
      })
    }

    if (scheduleRequest.status !== requestStatus.PENDING) {
      return res.json({
        error: 'Schedule Request not pending',
        statusCode: canNotUpdate,
      })
    }

    const slot = await slotmodel.findById(scheduleRequest.slotId)
    if (!slot) {
      return res.json({
        error: 'Slot not found',
        statusCode: entityNotFound,
      })
    }
    if (slot.staffId) {
      return res.json({
        error: 'Slot already assigned to a Staff',
        statusCode: canNotUpdate,
      })
    }

    const TAslot = await slotmodel.findOne({
      staffId: scheduleRequest.staffId,
      time: slot.time,
      day: slot.day,
    })

    if (TAslot) {
      return res.json({
        error: 'TA busy at that time',
        statusCode: canNotUpdate,
      })
    }

    await slotmodel.updateMany(
      {
        _id: scheduleRequest.slotId,
      },
      { staffId: scheduleRequest.staffId }
    )
    await schedulemodel.updateMany(
      {
        _id: req.body.id,
      },
      { status: requestStatus.ACCEPTED }
    )
    const notification = {
      type: notificationType.SCHEDULE,
      description: 'One of your slot linking requests has been accepted',
      seen: false,
      staffId: request.staffId,
      redId: req.body.id,
    }
    const notif = await notificationModel.create(notification)

    return res.json({ statusCode: success })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const rejectLinkingRequest = async (req, res) => {
  try {
    const requestFound = await schedulemodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else {
      if (req.body.message) {
        await schedulemodel.findByIdAndUpdate(
          req.body.id,
          {
            status: requestStatus.REJECTED,
            message: req.body.message,
          },
          { useFindAndModify: false }
        )
      } else {
        await schedulemodel.findByIdAndUpdate(
          req.body.id,
          {
            status: requestStatus.REJECTED,
          },
          { useFindAndModify: false }
        )
      }
      const notification = {
        type: notificationType.SCHEDULE,
        description: 'One of your slot linking requests has been rejected',
        seen: false,
        staffId: request.staffId,
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

const sendLinkingRequest = async (req, res) => {
  try {
    const request = req.body
    const slot = await slotmodel.findById(req.body.slotId)

    if (!slot) {
      return res.json({
        error: 'Slot not found',
        statusCode: entityNotFound,
      })
    }
    if (slot.staffId) {
      return res.json({
        error: 'Slot already assigned to Staff',
        statusCode: canNotSendRequest,
      })
    }

    const TAslot = await staffmodel.findOne({
      staffId: req.data.id,
      day: slot.day,
      time: slot.time,
    })
    if (TAslot) {
      return res.json({
        error: 'You are busy at that time',
        statusCode: canNotSendRequest,
      })
    }
    const course = await coursemodel.findById(slot.courseId)

    if (!course) {
      return res.json({
        error: 'Course not found',
        statusCode: entityNotFound,
      })
    }
    const staff = await staffmodel.findById(req.data.id)
    if (course.departmentId !== staff.department) {
      return res.json({
        error: 'Slot is not in  your department',
        statusCode: canNotSendRequest,
      })
    }
    request.staffId = staff._id
    request.status = requestStatus.PENDING
    request.type = scheduleType.LINKING

    const Schedule = await schedulemodel.create(request)

    const notification = {
      type: notificationType.SCHEDULE,
      description: 'A slot linking request has been sent',
      seen: false,
      staffId: course.courseCoordinatorId,
      redId: Schedule._id,
    }
    const notif = await notificationModel.create(notification)

    return res.json({
      statusCode: success,
      request: Schedule,
    })
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
    const requestFound = await schedulemodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else {
      await schedulemodel.findByIdAndUpdate(
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
const rejectChangeDayOff = async (req, res) => {
  try {
    const requestFound = await schedulemodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else {
      if (req.body.message) {
        await schedulemodel.findByIdAndUpdate(
          req.body.id,
          {
            status: requestStatus.REJECTED,
            message: req.body.message,
          },
          { useFindAndModify: false }
        )
      } else {
        await schedulemodel.findByIdAndUpdate(
          req.body.id,
          {
            status: requestStatus.REJECTED,
          },
          { useFindAndModify: false }
        )
      }

      const notification = {
        type: notificationType.SCHEDULE,
        description: 'Your request to change your day off has been rejected',
        seen: false,
        staffId: requestFound.staffId,
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
const acceptChangeDayOff = async (req, res) => {
  try {
    const requestFound = await schedulemodel.findOne({
      _id: req.body.id,
    })

    if (requestFound.status !== requestStatus.PENDING) {
      return res.json({
        statusCode: canNotUpdate,
        error: 'Request Status is not pending',
      })
    } else {
      await staffmodel.findByIdAndUpdate(
        requestFound.staffId,
        {
          dayOff: requestFound.dayOff,
        },
        { useFindAndModify: false }
      )
      await scheduleModel.findByIdAndUpdate(
        req.body.id,
        {
          status: requestStatus.ACCEPTED,
        },
        { useFindAndModify: false }
      )
      const notification = {
        type: notificationType.SCHEDULE,
        description: 'Your request to change your day off has been accepted',
        seen: false,
        staffId: requestFound.staffId,
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

const requestChangeDayOff = async (req, res) => {
  try {
    const staff = await staffmodel.findById(req.data.id)
    if (staff.dayOff === req.body.dayOff) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'This is your Day Off',
      })
    }
    const slots = await slotmodel.findOne({
      staffId: req.data.id,
      day: req.body.dayOff,
    })
    if (slots) {
      return res.json({
        statusCode: canNotSendRequest,
        error: 'You have teaching obligations on that day',
      })
    }

    const course = await coursemodel.findOne({
      staffId: req.data.id,
      day: req.body.dayOff,
    })

    let department
    if (course) {
      department = await departmentModel.findById({
        staffId: req.data.id,
        day: req.body.dayOff,
      })
    }

    const request = req.body
    request.staffId = req.data.id
    request.status = requestStatus.PENDING
    request.type = scheduleType.CHANGEDAY

    const scheduleRequest = await schedulemodel.create(request)
    if (department) {
      const notification = {
        type: notificationType.SCHEDULE,
        description: 'A request to change day off has been sent',
        seen: false,
        staffId: department.HODId,
        redId: scheduleRequest._id,
      }
      const notif = await notificationModel.create(notification)
    }

    return res.json({ statusCode: success, scheduleRequest: scheduleRequest })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewChangeDayOff = async (req, res) => {
  try {
    const HOD = await staffmodel.findById(req.data.id)
    const staffs = await staffmodel.find({
      departmentId: HOD.departmentId,
    })
    if (staffs.length === 0) {
      return res.json({
        error: 'No Staff in your department',
        statusCode: entityNotFound,
      })
    }

    let staffId = []
    for (let i = 0; i < staffs.length; i++) {
      staffId.push(staffs[i]._id)
    }
    const schedule = await schedulemodel.find({
      staffId: { $in: staffId },
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
    return res.json({ statusCode: success, scheduleRequest: schedulefinal })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
module.exports = {
  viewCourseLinkingRequest,
  acceptLinkingRequest,
  rejectLinkingRequest,
  sendLinkingRequest,
  cancelRequest,
  requestChangeDayOff,
  rejectChangeDayOff,
  acceptChangeDayOff,
  viewChangeDayOff,
}
