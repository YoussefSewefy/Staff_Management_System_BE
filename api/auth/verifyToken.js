const jwt = require('jsonwebtoken')
const {
  breach,
  authentication,
  entityNotFound,
} = require('../constants/statusCodes')
const { signingKey } = require('../../config/keys')
const {
  staffType,
  roleInCourse,
  passwordStatus,
} = require('../constants/enums')
const staffmodel = require('../../models/staff.model')
const slotmodel = require('../../models/slot.model')
const courseStaff = require('../../models/courseStaff.model')
const departmentModel = require('../../models/department.model')
const leaveRequestModel = require('../../models/leave.model')
const replacementmodel = require('../../models/replacement.model')
const schedulemodel = require('../../models/schedule.model')
const notificationModel = require('../../models/notification.model')
const courseModel = require('../../models/course.model')
const courseStaffModel = require('../../models/courseStaff.model')
const e = require('express')
const verifyReset = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyToken = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (req.body.leaveId) {
          const leave = await leaveRequestModel.findById(req.body.leaveId)
          if (leave) {
            if (leave.senderId != authorizedData.id) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Request does not exist',
            })
          }
        }
        if (req.body.notificationId) {
          const notification = await notificationModel.findById(
            req.body.notificationId
          )
          if (notification) {
            if (notification.staffId != authorizedData.id) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Notification does not exist',
            })
          }
        }
        const header = req.headers.authorization
        const token = header

        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyHR = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.HR) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyHRNOTME = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (
          authorizedData.type !== staffType.HR ||
          req.body.staffId === authorizedData.id
        ) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyHOD = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.HOD) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        // const HOD = await staffmodel.findById(authorizedData.id)
        if (req.body.id) {
          const staff1 = await staffmodel.findById(req.body.id)
          if (staff1) {
            if (staff1.department !== staff.department) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Staff not found',
            })
          }
        }
        if (req.body.leaveId) {
          const id = req.body.leaveId
          const leave = await leaveRequestModel.findById(id)
          if (leave) {
            const staffId = leave.senderId
            const staff2 = await staffmodel.findById(staffId)
            if (staff2.department !== staff.department) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Leave request not found',
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyCI = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.INSTRUCTOR) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        // const HOD = await staffmodel.findById(authorizedData.id)
        if (req.body.id) {
          const staff1 = await staffmodel.findById(req.body.id)
          if (staff1) {
            if (staff1.department !== staff.department) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Staff not found',
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyHODCourse = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.HOD) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const HOD = await staffmodel.findById(authorizedData.id)
        const course = await courseModel.findById(req.body.courseId)
        if (course) {
          if (course.departmentId !== HOD.department) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyINSCOURSE = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.INSTRUCTOR) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }

        const INS = await courseStaff.findOne({
          staffId: authorizedData.id,
          courseId: req.body.courseId,
          role: roleInCourse.INSTRUCTOR,
        })
        if (!INS) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyHODINSCourse = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (
          authorizedData.type !== staffType.HOD &&
          authorizedData.type !== staffType.INSTRUCTOR
        ) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const HOD = await staffmodel.findById(authorizedData.id)
        const course = await courseModel.findById(req.body.courseId)
        if (course) {
          const courseStaff = await courseStaffModel.findOne({
            courseId: course._id,
            staffId: HOD._id,
            role: roleInCourse.INSTRUCTOR,
          })
          const department = await departmentModel.findById(course.departmentId)

          if (department && department.HODId != HOD._id && !courseStaff) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
        } else {
          return res.json({
            error: 'Course Id not found',
            statusCode: entityNotFound,
          })
        }

        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyINSinCOURSE = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const slot = req.body.id
        const courseOfSlot = await slotmodel.findById(slot)
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type !== staffType.INSTRUCTOR) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        if (courseOfSlot) {
          const INS = await courseStaff.findOne({
            staffId: authorizedData.id,
            courseId: courseOfSlot.courseId,
            role: roleInCourse.INSTRUCTOR,
          })
          if (!INS) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyTA = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }
          if (authorizedData.type !== staffType.TA) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyTASCOURSE = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (authorizedData.type !== staffType.TA) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }

        const INS = await courseModel.findById({
          courseCoordinator: authorizedData.id,
          _id: req.body.courseId,
        })

        if (!INS) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyTASinCOURSE = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const slot = req.body.id
        const courseOfSlot = await slotmodel.findById(slot)
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (authorizedData.type !== staffType.TA) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        if (courseOfSlot) {
          console.log(courseOfSlot.courseId, 'sss')
          const INS = await courseModel.findById(courseOfSlot.courseId)
          if (INS.courseCoordinatorId !== authorizedData.id) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyCIorHOD = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (
          authorizedData.type !== staffType.INSTRUCTOR &&
          authorizedData.type !== staffType.HOD
        ) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyForViewCourseStaff = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization)
          return res.json({ statusCode: breach, error: 'Token not valid' })

        if (staff.passwordStatus === passwordStatus.DEFAULT)
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        const course = await courseModel.findById(req.body.courseId)
        if (
          authorizedData.type === staffType.HR ||
          (authorizedData.type === staffType.HOD &&
            authorizedData.department === course.departmentId) ||
          (authorizedData.type === staffType.INSTRUCTOR &&
            authorizedData.department === course.departmentId)
        ) {
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        }
        const courseStaffs = await courseStaffModel.find({
          staffId: authorizedData.id,
        })
        var flag = false
        for (var i = 0; i < courseStaffs.length; i++) {
          if (courseStaffs[i].courseId === req.body.courseId) flag = true
        }
        if (flag) {
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        }
        return res.json({
          error: 'You are not authorized',
          statusCode: authentication,
        })
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyTAorIns = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }
          if (
            authorizedData.type !== staffType.TA &&
            authorizedData.type !== staffType.INSTRUCTOR
          ) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyReceiverReplacementRequest = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }

          const Request = await replacementmodel.findById(req.body.id)

          if (!Request) {
            return res.json({
              error: 'Replacement request not found',
              statusCode: entityNotFound,
            })
          } else {
            if (Request.receiverId != staff._id) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          }
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifySenderReplacementRequest = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }

          const Request = await replacementmodel.findById(req.body.id)

          if (!Request) {
            return res.json({
              error: 'Replacement request not found',
              statusCode: entityNotFound,
            })
          } else {
            if (Request.senderId != staff._id) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          }
          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyCCScheduleRequest = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }
          if (authorizedData.type !== staffType.TA) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
          const request = await schedulemodel.findById(req.body.id)

          if (!request) {
            return res.json({
              error: 'Schedule Request not found',
              statusCode: entityNotFound,
            })
          }
          const slot = await slotmodel.findById(request.slotId)
          if (!slot) {
            return res.json({
              error: 'Slot not found',
              statusCode: entityNotFound,
            })
          }

          const courseStaffInfo = await courseModel.findOne({
            _id: slot.courseId,
          })

          if (courseStaffInfo.courseCoordinatorId !== authorizedData.id) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }

          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyHODScheduleRequest = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }
          if (authorizedData.type !== staffType.HOD) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
          const request = await schedulemodel.findById(req.body.id)

          if (!request) {
            return res.json({
              error: 'Schedule Request not found',
              statusCode: entityNotFound,
            })
          }
          const requester = await staffmodel.findById(request.staffId)
          const department = await departmentModel.findById(
            requester.department
          )
          console.log(requester, department)
          if (department.HODId !== authorizedData.id) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }

          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyNotHR = async (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (authorizedData.type == staffType.HR) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        if (req.body.notificationId) {
          const notification = await notificationModel.findById(
            req.body.notificationId
          )
          if (notification) {
            if (notification.staffId != authorizedData.id) {
              return res.json({
                error: 'You are not authorized',
                statusCode: authentication,
              })
            }
          } else {
            return res.json({
              statusCode: entityNotFound,
              error: 'Notification does not exist',
            })
          }
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}

const verifyScheduleOwner = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        try {
          const staff = await staffmodel.findById(authorizedData.id)
          if (!staff || staff.token !== req.headers.authorization) {
            return res.json({ statusCode: breach, error: 'Token not valid' })
          }
          if (staff.passwordStatus === passwordStatus.DEFAULT) {
            return res.json({
              statusCode: breach,
              error: 'Please reset your password first',
            })
          }
          const request = await schedulemodel.findById(req.body.id)
          if (request.staffId !== authorizedData.id) {
            return res.json({
              error: 'You are not authorized',
              statusCode: authentication,
            })
          }
          if (!request) {
            return res.json({
              error: 'Schedule Request not found',
              statusCode: entityNotFound,
            })
          }

          const header = req.headers.authorization
          const token = header
          req.data = authorizedData
          req.token = token
          return next()
        } catch (exception) {
          console.log(exception)
          return res.json({
            error: 'Something went wrong',
            statusCode: unknown,
          })
        }
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
const verifyHRCIHOD = (req, res, next) => {
  return jwt.verify(
    req.headers.authorization,
    signingKey,
    async (err, authorizedData) => {
      if (!err) {
        const staff = await staffmodel.findById(authorizedData.id)
        if (!staff || staff.token !== req.headers.authorization) {
          return res.json({ statusCode: breach, error: 'Token not valid' })
        }
        if (staff.passwordStatus === passwordStatus.DEFAULT) {
          return res.json({
            statusCode: breach,
            error: 'Please reset your password first',
          })
        }
        if (
          authorizedData.type !== staffType.HR &&
          authorizedData.type !== staffType.HOD &&
          authorizedData.type !== staffType.INSTRUCTOR
        ) {
          return res.json({
            error: 'You are not authorized',
            statusCode: authentication,
          })
        }
        const header = req.headers.authorization
        const token = header
        req.data = authorizedData
        req.token = token
        return next()
      }
      return res.json({ statusCode: breach, error: 'breach' })
    }
  )
}
module.exports = {
  verifyToken,
  verifyHR,
  verifyHRNOTME,
  verifyHOD,
  verifyINSCOURSE,
  verifyTA,
  verifyTAorIns,
  verifyReset,
  verifyTASCOURSE,
  verifyTASinCOURSE,
  verifyCIorHOD,
  verifyNotHR,
  verifyReceiverReplacementRequest,
  verifySenderReplacementRequest,
  verifyCCScheduleRequest,
  verifyHODScheduleRequest,
  verifyScheduleOwner,
  verifyCI,
  verifyINSinCOURSE,
  verifyHODCourse,
  verifyHODINSCourse,
  verifyForViewCourseStaff,
  verifyHRCIHOD,
}
