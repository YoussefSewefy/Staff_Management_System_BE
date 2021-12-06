const jwt = require('jsonwebtoken')
const { signingKey } = require('../../config/keys')
const CourseModel = require('../../models/course.model')
const DepartmentModel = require('../../models/department.model')
const SlotModel = require('../../models/slot.model')
const StaffModel = require('../../models/staff.model')
const CourseStaffModel = require('../../models/courseStaff.model')
const {
  doesNotExist,
  success,
  unknown,
  alreadyAssigned,
  typeMismatch,
  notAssignedBeforeDelete,
  alreadyExists,
} = require('../../api/constants/statusCodes')
const { staffType, roleInCourse } = require('../constants/enums')
const courseStaffModel = require('../../models/courseStaff.model')
const staffmodel = require('../../models/staff.model')
const courseModel = require('../../models/course.model')

const viewCourseStaff = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await CourseModel.findById(courseId)
    if (course) {
      var staffIds = []
      var staff = []
      const courseStaff = await CourseStaffModel.find({ courseId: courseId })
      if (courseStaff.length > 0) {
        let CC = false
        for (var i = 0; i < courseStaff.length; i++) {
          staffIds.push(courseStaff[i].staffId)
          if (courseStaff[i].staffId == course.courseCoordinatorId) CC = true
        }
        var staffi
        for (var i = 0; i < staffIds.length; i++) {
          staffi = await StaffModel.findById(
            staffIds[i],
            '_id id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays'
          )
          if (staffi) staff.push(staffi)
        }
        if (!CC && course.courseCoordinatorId) {
          staffi = await StaffModel.findById(
            course.courseCoordinatorId,
            '_id id name email type salary dayOff totalHrs missingDays leaveBalance accidentalBalance gender compensatedDays'
          )
          if (staffi) staff.push(staffi)
        }
        return res.json({ statusCode: success, staff: staff })
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'course staff record with this course id does not exist',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const assignInstructor = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const instructorId = req.body.staffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const instructor = await StaffModel.findById(instructorId)
      if (instructor.department !== course.departmentId) {
        return res.json({
          statusCode: typeMismatch,
          error: 'Instructor is not on the same department',
        })
      }
      if (instructor) {
        if (instructor.type === staffType.INSTRUCTOR) {
          const courseStaff = await CourseStaffModel.findOne({
            courseId: courseId,
            staffId: instructorId,
          })
          //instructor is already assigned to course as an instructor
          if (courseStaff && courseStaff.role === roleInCourse.INSTRUCTOR) {
            return res.json({
              statusCode: alreadyAssigned,
              error: 'Instructor has already been assigned to the course',
            })
          }
          //Was assigned as something other than an instructor. In this case we alter the record in place.
          else if (
            courseStaff &&
            !courseStaff.role === roleInCourse.INSTRUCTOR
          ) {
            return CourseStaffModel.update(
              { courseId: courseId, staffId: instructorId },
              { type: roleInCourse.INSTRUCTOR }
            )
              .then(() => {
                return res.json({ statusCode: success })
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          }
          //not assigned before
          else {
            const newCourseStaff = new CourseStaffModel({
              courseId: courseId,
              staffId: instructorId,
              role: roleInCourse.INSTRUCTOR,
            })
            return newCourseStaff
              .save()
              .then(() => {
                return res.json({ statusCode: success })
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          }
        } else
          return res.json({
            statusCode: typeMismatch,
            error: 'The staff ID in the body is not an instructor',
          })
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const assignStaff = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const staffId = req.body.staffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const staff = await StaffModel.findById(staffId)
      if (staff) {
        if (staff.type === staffType.TA) {
          if (staff.department !== course.departmentId) {
            return res.json({
              statusCode: typeMismatch,
              error:
                'The TA does not belong to the same department as the course',
            })
          }
          const courseStaff = await CourseStaffModel.findOne({
            courseId: courseId,
            staffId: staffId,
          })
          //TA is already assigned to course as an TA
          if (courseStaff) {
            return res.json({
              statusCode: alreadyAssigned,
              error: 'Staff member has already been assigned to the course',
            })
          }

          //not assigned before
          else {
            const newCourseStaff = new CourseStaffModel({
              courseId: courseId,
              staffId: staffId,
              role: roleInCourse.TA,
            })
            return newCourseStaff
              .save()
              .then(() => {
                return res.json({ statusCode: success })
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          }
        } else {
          res.json({
            statusCode: typeMismatch,
            error: 'Staff ID does not belong to a TA.',
          })
        }
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const deleteInstructor = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const instructorId = req.body.staffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const instructor = await StaffModel.findById(instructorId)
      if (instructor) {
        if (instructor.type === staffType.INSTRUCTOR) {
          const courseStaff = await CourseStaffModel.findOne({
            courseId: courseId,
            staffId: instructorId,
          })
          //instructor is already assigned to course as an instructor
          if (courseStaff && courseStaff.role === roleInCourse.INSTRUCTOR) {
            return await CourseStaffModel.deleteOne({
              courseId: courseId,
              staffId: instructorId,
            })
              .then(async () => {
                try {
                  await SlotModel.updateMany(
                    { courseId: courseId, staffId: instructorId },
                    { staffId: null }
                  )
                  return res.json({ statusCode: success })
                } catch (err) {
                  return res.json({ statusCode: unknown, error: err.message })
                }
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          }
          //Was assigned as something other than an instructor. In this case we alter the record in place.
          else if (
            courseStaff &&
            !courseStaff.role === roleInCourse.INSTRUCTOR
          ) {
            return res.json({
              statusCode: typeMismatch,
              error: 'Staff is not an instructor in this course.',
            })
          }
          //not assigned before
          else {
            return res.json({
              statusCode: notAssignedBeforeDelete,
              error: 'Instructor with this ID is not assigned to this course.',
            })
          }
        } else
          return res.json({
            statusCode: typeMismatch,
            error: 'The staff ID in the body is not an instructor',
          })
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const updateInstructor = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const instructorId = req.body.staffId
    const newInstructorId = req.body.newStaffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const instructor = await StaffModel.findById(instructorId)
      const newInstructor = await StaffModel.findById(newInstructorId)
      if (instructor && newInstructor) {
        if (instructor.department !== newInstructor.department) {
          return res.json({
            statusCode: typeMismatch,
            error: 'Instructor is not on the same department',
          })
        }
        if (
          instructor.type === newInstructor.type &&
          instructor.type === staffType.INSTRUCTOR
        ) {
          const courseStaff = await CourseStaffModel.findOne({
            staffId: instructorId,
            courseId: courseId,
          })
          if (courseStaff) {
            const newCourseStaff = await CourseStaffModel.findOne({
              staffId: newInstructorId,
              courseId: courseId,
            })
            if (newCourseStaff)
              return res.json({
                statusCode: alreadyExists,
                error:
                  'This instructor has already been assigned to this course.',
              })
            return await CourseStaffModel.update(
              { courseId, staffId: instructorId },
              { staffId: newInstructorId }
            )
              .then(async () => {
                try {
                  await SlotModel.updateMany(
                    { courseId: courseId, staffId: instructorId },
                    { staffId: newInstructorId }
                  )
                  return res.json({ statusCode: success })
                } catch (err) {
                  return res.json({ statusCode: unknown, error: err.message })
                }
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          } else {
            return res.json({
              statusCode: doesNotExist,
              error: 'course staff with staff ID and course ID does not exist',
            })
          }
        } else {
          return res.json({
            statusCode: typeMismatch,
            error: 'One or both of the staff are not instructors',
          })
        }
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const deleteStaff = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const staffId = req.body.staffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const staff = await StaffModel.findById(staffId)
      if (staff) {
        const courseStaff = await CourseStaffModel.findOne({
          courseId: courseId,
          staffId: staffId,
        })
        //instructor is already assigned to course as an instructor
        if (courseStaff && courseStaff.role === roleInCourse.TA) {
          return await CourseStaffModel.deleteOne({
            courseId: courseId,
            staffId: staffId,
          })
            .then(async () => {
              try {
                await SlotModel.updateMany(
                  { courseId: courseId, staffId: staffId },
                  { staffId: null }
                )
                return res.json({ statusCode: success })
              } catch (err) {
                return res.json({ statusCode: unknown, error: err.message })
              }
            })
            .catch((err) => {
              return res.json({ statusCode: unknown, error: err })
            })
        }

        //not assigned before
        else
          return res.json({
            statusCode: notAssignedBeforeDelete,
            error: 'Staff member with this ID is not assigned to this course.',
          })
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const getInstructors = async (req, res) => {
  try {
    const courseStaff = await courseStaffModel.find({
      courseId: req.body.courseId,
      role: roleInCourse.INSTRUCTOR,
    })
    let staffIds = []
    for (let i = 0; i < courseStaff.length; i++) {
      staffIds.push(courseStaff[i].staffId)
    }
    const staff = await staffmodel.find({
      department: req.data.department,
      type: staffType.INSTRUCTOR,
      _id: { $nin: staffIds },
    })
    return res.json({ statusCode: success, staff })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const getStaff = async (req, res) => {
  try {
    const courseStaff = await courseStaffModel.find({
      courseId: req.body.courseId,
      $or: [
        { role: roleInCourse.TA },
        { role: roleInCourse.COURSECOORDINATOR },
      ],
    })
    const coordinator = await courseModel.findById(req.body.courseId)
    let staffIds = []
    let CC = false
    for (let i = 0; i < courseStaff.length; i++) {
      if (coordinator.courseCoordinatorId == courseStaff[i].staffId) {
        CC = true
      } else {
        staffIds.push(courseStaff[i].staffId)
      }
    }
    if (!CC && coordinator.courseCoordinatorId) {
      await courseStaffModel.create({
        courseId: req.body.courseId,
        staffId: coordinator.courseCoordinatorId,
        role: roleInCourse.COURSECOORDINATOR,
      })
      staffIds.push(coordinator.courseCoordinatorId)
    }
    const staff = await staffmodel.find({
      department: req.data.department,
      type: staffType.TA,
      _id: { $nin: staffIds },
    })
    return res.json({ statusCode: success, staff })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const updateStaff = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const instructorId = req.body.staffId
    const newInstructorId = req.body.newStaffId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const instructor = await StaffModel.findById(instructorId)
      const newInstructor = await StaffModel.findById(newInstructorId)
      if (instructor && newInstructor) {
        if (instructor.department !== newInstructor.department) {
          return res.json({
            statusCode: typeMismatch,
            error: 'Staff is not on the same department',
          })
        }
        if (
          instructor.type === newInstructor.type &&
          instructor.type === staffType.TA
        ) {
          const courseStaff = await CourseStaffModel.findOne({
            staffId: instructorId,
            courseId: courseId,
          })
          if (courseStaff) {
            const newCourseStaff = await CourseStaffModel.findOne({
              staffId: newInstructorId,
              courseId: courseId,
            })
            if (newCourseStaff)
              return res.json({
                statusCode: alreadyExists,
                error: 'This TA has already been assigned to this course.',
              })
            return await CourseStaffModel.update(
              { courseId, staffId: instructorId },
              { staffId: newInstructorId }
            )
              .then(async () => {
                try {
                  await SlotModel.updateMany(
                    { courseId: courseId, staffId: instructorId },
                    { staffId: newInstructorId }
                  )
                  return res.json({ statusCode: success })
                } catch (err) {
                  return res.json({ statusCode: unknown, error: err.message })
                }
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          } else {
            return res.json({
              statusCode: doesNotExist,
              error: 'course staff with staff ID and course ID does not exist',
            })
          }
        } else {
          return res.json({
            statusCode: typeMismatch,
            error: 'One or both of the staff are not TA',
          })
        }
      } else
        return res.json({
          statusCode: doesNotExist,
          error: 'staff with this ID does not exist ',
        })
    } else
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this ID does not exist ',
      })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
module.exports = {
  viewCourseStaff,
  assignInstructor,
  assignStaff,
  deleteInstructor,
  deleteStaff,
  updateInstructor,
  getInstructors,
  getStaff,
  updateStaff,
}
