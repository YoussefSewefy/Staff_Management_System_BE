const jwt = require('jsonwebtoken')
const { signingKey } = require('../../config/keys')
const CourseModel = require('../../models/course.model')
const DepartmentModel = require('../../models/department.model')
const SlotModel = require('../../models/slot.model')
const StaffModel = require('../../models/staff.model')
const {
  doesNotExist,
  success,
  unknown,
  alreadyExists,
} = require('../../api/constants/statusCodes')
const courseStaffModel = require('../../models/courseStaff.model')
const { staffType, roleInCourse } = require('../constants/enums')
const courseModel = require('../../models/course.model')
const departmentModel = require('../../models/department.model')
const staffmodel = require('../../models/staff.model')
const addCourse = async (req, res) => {
  try {
    const departmentId = req.body.course.departmentId
    const coordinatorId = req.body.course.courseCoordinatorId
    const department = await DepartmentModel.findById(departmentId)
    if (department) {
      const course = await CourseModel.find({ name: req.body.course.name })
      if (course.length > 0) {
        return res.json({
          statusCode: alreadyExists,
          error: 'Course already exists.',
        })
      }
      if (coordinatorId) {
        const staff = await staffmodel.find({
          _id: coordinatorId,
          department: departmentId,
          type: staffType.TA,
        })
        if (staff.length === 0) {
          return res.json({
            statusCode: '115',
            error: 'Staff is not a TA or not department',
          })
        }
        const Course = new CourseModel(req.body.course)
        const newCourse = await Course.save()
        const courseStaff = new courseStaffModel({
          courseId: newCourse._id,
          staffId: coordinatorId,
          role: roleInCourse.COURSECOORDINATOR,
        })
        await courseStaff.save()
      } else {
        const Course = new CourseModel(req.body.course)
        const newCourse = await Course.save()
      }
      return res.json({ statusCode: success })
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'Department does not exist',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewCoursesInDepartment = async (req, res) => {
  const departmentId = req.body.departmentId

  try {
    const department = DepartmentModel.findById(departmentId)
    if (!department)
      return res.json({
        statusCode: doesNotExist,
        error: 'department with that ID does not exist',
      })
    const courses = await CourseModel.find({ departmentId: departmentId })
    if (courses.length === 0)
      return res.json({
        statusCode: doesNotExist,
        error: 'Department has no courses',
      })
    return res.json({ statusCode: success, courses })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const updateCourseINS = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const newCourse = req.body.course
    const courseCoordinatorId = newCourse.courseCoordinatorId
    const oldCourse = await CourseModel.findById(courseId)

    if (oldCourse) {
      try {
        const courseCoordinator = await StaffModel.findById(courseCoordinatorId)
        if (!courseCoordinator && courseCoordinatorId) {
          return res.json({
            statusCode: doesNotExist,
            error: 'course coordinator with this ID does not exist.',
          })
        } else if (
          courseCoordinator &&
          courseCoordinatorId &&
          oldCourse.courseCoordinatorId
        ) {
          await courseStaffModel.updateOne(
            {
              courseId: courseId,
              role: roleInCourse.COURSECOORDINATOR,
              staffId: oldCourse.courseCoordinatorId,
            },
            { role: roleInCourse.TA }
          )
          const newCourseStaff = new courseStaffModel({
            courseId: courseId,
            staffId: courseCoordinatorId,
            role: roleInCourse.COURSECOORDINATOR,
          })
          await newCourseStaff.save()
        } else if (
          courseCoordinator &&
          courseCoordinatorId &&
          !oldCourse.courseCoordinatorId
        ) {
          const newCourseStaff = new courseStaffModel({
            courseId: courseId,
            staffId: courseCoordinatorId,
            role: roleInCourse.COURSECOORDINATOR,
          })
          await newCourseStaff.save()
        }

        CourseModel.findByIdAndUpdate(courseId, newCourse, (err, docs) => {
          if (err) {
            return res.json({
              statusCode: unknown,
              error: 'Something went wrong while updating document.',
            })
          }
          if (docs) {
            return res.json({ statusCode: success })
          }
        })
      } catch (err) {
        return res.json({ statusCode: unknown, error: err.message })
      }
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}

const updateCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const newCourse = req.body.course
    const departmentId = newCourse.departmentId
    const courseCoordinatorId = newCourse.courseCoordinatorId
    const oldCourse = await CourseModel.findById(courseId)

    if (oldCourse) {
      try {
        const department = await DepartmentModel.findById(departmentId)
        if (!department && departmentId)
          return res.json({
            statusCode: doesNotExist,
            error: 'derpartment with this ID does not exist',
          })
        const courseCoordinator = await StaffModel.findById(courseCoordinatorId)
        if (!courseCoordinator && courseCoordinatorId) {
          return res.json({
            statusCode: doesNotExist,
            error: 'course coordinator with this ID does not exist.',
          })
        } else if (
          courseCoordinator &&
          courseCoordinatorId &&
          oldCourse.courseCoordinatorId
        ) {
          await courseStaffModel.updateOne(
            {
              courseId: courseId,
              role: roleInCourse.COURSECOORDINATOR,
              staffId: oldCourse.courseCoordinatorId,
            },
            { role: roleInCourse.TA }
          )
          const newCourseStaff = new courseStaffModel({
            courseId: courseId,
            staffId: courseCoordinatorId,
            role: roleInCourse.COURSECOORDINATOR,
          })
          await newCourseStaff.save()
        } else if (
          courseCoordinator &&
          courseCoordinatorId &&
          !oldCourse.courseCoordinatorId
        ) {
          const newCourseStaff = new courseStaffModel({
            courseId: courseId,
            staffId: courseCoordinatorId,
            role: roleInCourse.COURSECOORDINATOR,
          })
          await newCourseStaff.save()
        }

        CourseModel.findByIdAndUpdate(courseId, newCourse, (err, docs) => {
          if (err) {
            return res.json({
              statusCode: unknown,
              error: 'Something went wrong while updating document.',
            })
          }
          if (docs) {
            return res.json({ statusCode: success })
          }
        })
      } catch (err) {
        return res.json({ statusCode: unknown, error: err.message })
      }
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}

const deleteCourse = async (req, res) => {
  try {
    const courseId = req.body.courseId
    const course = await CourseModel.findById(courseId)
    if (course) {
      try {
        await CourseModel.findByIdAndDelete(courseId)
        await courseStaffModel.deleteMany({ courseId: courseId })
        await SlotModel.deleteMany({ courseId: courseId })
        return res.json({ statusCode: success })
      } catch (err) {
        return res.json({ statusCode: unknown, error: err.message })
      }
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'course does not exist.',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewCourseCoverage = async (req, res) => {
  try {
    var coverage
    var assignedSlots = []
    const courseId = req.body.courseId
    const course = await CourseModel.findById(courseId)
    if (course) {
      const courseSlots = course.numberOfSlots
      const slots = await SlotModel.find({ courseId: courseId })
      if (slots) {
        if (slots.length > 0) {
          for (var i = 0; i < slots.length; i++) {
            if (slots[i].staffId) assignedSlots.push(slots[i])
          }
          coverage = (assignedSlots.length / courseSlots) * 100
          const coveragePercent = '' + coverage + ' %'
          const unassignedSlots = []
          for (var i = 0; i < slots.length; i++) {
            if (!assignedSlots.includes(slots[i]))
              unassignedSlots.push(slots[i])
          }
          return res.json({
            statusCode: success,
            coverage: coveragePercent,
            unassignedSlots: unassignedSlots,
          })
        }
        //no slots with this course Id were found
        else {
          return res.json({
            statusCode: doesNotExist,
            error:
              'slots with this course ID do not exist or have not been added',
          })
        }
      } else {
        return res.json({
          statusCode: unknown,
          error:
            'An error occurred while querying on slots. They may not exist',
        })
      }
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'Course does not exist',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewCourses = async (req, res) => {
  try {
    let courses = []
    if (req.data.type === staffType.HR) {
      const courses1 = await courseModel.find()
      for (let i = 0; i < courses1.length; i++) {
        const department = await departmentModel.findById(
          courses1[i].departmentId
        )

        const coordinator = await staffmodel.findById(
          courses1[i].courseCoordinatorId
        )
        let cousre = {
          id: courses1[i]._id,
          name: courses1[i].name,
          numberOfSlots: courses1[i].numberOfSlots,
          department: department,
          coordinator: coordinator,
        }
        courses.push(cousre)
      }
    } else if (req.data.type === staffType.HOD) {
      const departments = await departmentModel.find({ HODId: req.data.id })
      let derpartmentsIds = []
      for (let i = 0; i < departments.length; i++) {
        derpartmentsIds.push(departments[i]._id)
      }
      const courses1 = await courseModel.find({
        departmentId: { $in: derpartmentsIds },
      })
      for (let i = 0; i < courses1.length; i++) {
        const department = await departmentModel.findById(
          courses1[i].departmentId
        )

        const coordinator = await staffmodel.findById(
          courses1[i].courseCoordinatorId
        )
        let cousre = {
          id: courses1[i]._id,
          name: courses1[i].name,
          numberOfSlots: courses1[i].numberOfSlots,
          department: department,
          coordinator: coordinator,
        }
        courses.push(cousre)
      }
    } else {
      const coursesMe = await courseStaffModel.find({
        staffId: req.data.id,
      })
      let coursesSearch = []
      for (let i = 0; i < coursesMe.length; i++) {
        coursesSearch.push(coursesMe[i].courseId)
      }
      const courses1 = await courseModel.find({
        $or: [
          { _id: { $in: coursesSearch } },
          { courseCoordinatorId: req.data.id },
        ],
      })
      for (let i = 0; i < courses1.length; i++) {
        const department = await departmentModel.findById(
          courses1[i].departmentId
        )
        const coordinator = await staffmodel.findById(
          courses1[i].courseCoordinatorId
        )
        let cousre = {
          id: courses1[i]._id,
          name: courses1[i].name,
          numberOfSlots: courses1[i].numberOfSlots,
          department: department,
          coordinator: coordinator,
        }
        courses.push(cousre)
      }
    }
    return res.json({
      statusCode: success,
      courses,
    })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewCourse = async (req, res) => {
  try {
    const courses1 = await courseModel.findById(req.body.courseId)
    const department = await departmentModel.findById(courses1.departmentId)

    const coordinator = await staffmodel.findById(courses1.courseCoordinatorId)
    let course = {
      id: courses1._id,
      name: courses1.name,
      numberOfSlots: courses1.numberOfSlots,
      department: department,
      coordinator: coordinator,
    }
    return res.json({
      statusCode: success,
      course,
    })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const coursename = async (req, res) => {
  try {
    const course = await courseModel.findById(req.body.courseId)
    return res.json({
      statusCode: success,
      course: course.name,
    })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
module.exports = {
  viewCourses,
  addCourse,
  updateCourse,
  deleteCourse,
  viewCourseCoverage,
  viewCourse,
  coursename,
  viewCoursesInDepartment,
  updateCourseINS,
}
