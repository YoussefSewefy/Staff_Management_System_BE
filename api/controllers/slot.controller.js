const staffmodel = require('../../models/staff.model')
const slotmodel = require('../../models/slot.model')
const courseStaffmodel = require('../../models/courseStaff.model')
const coursemodel = require('../../models/course.model')
const loactionmodel = require('../../models/location.model')
const replacementmodel = require('../../models/replacement.model')
const {
  entityNotFound,
  unknown,
  alreadyBusy,
  alreadyEmpty,
  alreadyExists,
  wrongCredentials,
  success,
  wrongType,
  doesNotExist,
  fullCapacity,
  authentication,
} = require('../constants/statusCodes')
const { staffType, requestStatus, locationType } = require('../constants/enums')
const departmentModel = require('../../models/department.model')
const courseModel = require('../../models/course.model')
const courseStaffModel = require('../../models/courseStaff.model')

const assignStaff = async (req, res) => {
  try {
    const { id, staffId } = req.body
    const staff = await staffmodel.findById(staffId)
    const slot = await slotmodel.findById(id)
    if (!slot) {
      return res.json({
        error: 'slot not found',
        statusCode: entityNotFound,
      })
    }
    if (!staff) {
      return res.json({
        error: 'staff not found',
        statusCode: entityNotFound,
      })
    }
    if (staff.type !== staffType.TA && staff.type !== staffType.INSTRUCTOR) {
      return res.json({
        error: 'This staff member can not teach',
        statusCode: wrongCredentials,
      })
    }
    if (staff.dayOff === slot.day) {
      return res.json({
        error: 'This staff member can not teach on his day off',
        statusCode: wrongCredentials,
      })
    }
    const staffLinked = await courseStaffmodel.findOne({
      courseId: slot.courseId,
      staffId: staffId,
    })
    if (!staffLinked) {
      return res.json({
        error: 'This staff cannot teach this course',
        statusCode: wrongCredentials,
      })
    }

    if (slot.staffId) {
      return res.json({
        error: 'This slot is already assigned to a TA',
        statusCode: alreadyBusy,
      })
    }
    const slot1 = await slotmodel.findOne({
      staffId: staffId,
      time: slot.time,
      // locationId: slot.locationId,
      day: slot.day,
    })
    if (slot1) {
      return res.json({
        error: 'This Staff member is busy on this slot',
        statusCode: alreadyBusy,
      })
    }

    await slotmodel.findByIdAndUpdate(
      id,
      { staffId: staffId },
      { useFindAndModify: false }
    )

    return res.json({
      statusCode: success,
      message: 'Staff member assigned successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const deleteStaff = async (req, res) => {
  try {
    const { id } = req.body
    const slot = await slotmodel.findById(id)
    if (!slot) {
      return res.json({
        error: 'slot not found',
        statusCode: entityNotFound,
      })
    }
    if (!slot.staffId) {
      return res.json({
        error: 'This slot is already not assigned to any Staff member',
        statusCode: alreadyEmpty,
      })
    }

    await slotmodel.findByIdAndUpdate(
      id,
      { staffId: null },
      { useFindAndModify: false }
    )
    return res.json({
      statusCode: success,
      message: 'Staff member deleted successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const upDateStaff = async (req, res) => {
  try {
    console.log('in update staff. req body:', req.body)
    const { id, staffId } = req.body
    const staff = await staffmodel.findById(staffId)

    const slot = await slotmodel.findById(id)
    if (!staff) {
      return res.json({
        error: 'This staff member not found',
        statusCode: entityNotFound,
      })
    }
    if (staff.type !== staffType.TA && staff.type !== staffType.INSTRUCTOR) {
      return res.json({
        error: 'This staff member can not teach',
        statusCode: wrongCredentials,
      })
    }
    if (staff.dayOff === slot.day) {
      return res.json({
        error: 'This staff member can not teach on his day off',
        statusCode: wrongCredentials,
      })
    }
    const staffLinked = await courseStaffmodel.findOne({
      courseId: slot.courseId,
      staffId: staffId,
    })
    if (!staffLinked) {
      return res.json({
        error: 'This staff member cannot teach this course',
        statusCode: wrongCredentials,
      })
    }

    if (!slot) {
      return res.json({
        error: 'slot not found',
        statusCode: entityNotFound,
      })
    }
    if (slot.staffId === staffId) {
      return res.json({
        error: 'This staff member is already assigned to this slot',
        statusCode: alreadyBusy,
      })
    }
    if (!slot.staffId) {
      return res.json({
        error: 'This slot is has no assigne',
        statusCode: alreadyEmpty,
      })
    }

    await slotmodel.findByIdAndUpdate(
      id,
      { staffId: staffId },
      { useFindAndModify: false }
    )
    return res.json({
      statusCode: success,
      message: 'Staff member updated successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const updateSlot = async (req, res) => {
  try {
    const slot = req.body
    const room = await loactionmodel.findById(slot.locationId)
    if (slot.locationId && room.type === locationType.OFFICE) {
      return res.json({
        error: 'This location can not be a teaching one',
        statusCode: wrongType,
      })
    }
    const slotE = await slotmodel.findById(slot.id)
    if (!slotE) {
      return res.json({
        error: 'This slot does not exists',
        statusCode: entityNotFound,
      })
    }
    if (slotE.staffId) {
      const staffFound = await staffmodel.findById(slotE.staffId)
      if (slot.day === staffFound.dayOff) {
        return res.json({
          error: 'This staff member can not teach on his day off',
          statusCode: wrongCredentials,
        })
      }
    }
    if (
      //  !slot.courseId &&
      !slot.type &&
      !slot.time &&
      !slot.locationId &&
      !slot.day
    ) {
      return res.json({
        error: 'Please enter data to update it',
        statusCode: wrongCredentials,
      })
    }
    if (slot.courseId) {
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { courseId: slot.courseId },
        { useFindAndModify: false }
      )
    }
    if (slot.type) {
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { type: slot.type },
        { useFindAndModify: false }
      )
    }
    if (slot.time && slot.day && slot.locationId) {
      const exists = await slotmodel.findOne({
        time: slot.time,
        day: slot.day,
        locationId: slot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { time: slot.time, locationId: slot.locationId, day: slot.day },
        { useFindAndModify: false }
      )
    } else if (slot.time && slot.day) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        time: slot.time,
        day: slot.day,
        locationId: thisSlot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { time: slot.time, day: slot.day },
        { useFindAndModify: false }
      )
    } else if (slot.time && slot.locationId) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        time: slot.time,
        day: thisSlot.day,
        locationId: slot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { time: slot.time, locationId: slot.locationId },
        { useFindAndModify: false }
      )
    } else if (slot.locationId && slot.day) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        time: thisSlot.time,
        day: slot.day,
        loction: slot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { locationId: slot.locationId, day: slot.day },
        { useFindAndModify: false }
      )
    } else if (slot.time) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        time: slot.time,
        day: thisSlot.day,
        locationId: thisSlot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { time: slot.time },
        { useFindAndModify: false }
      )
    } else if (slot.locationId) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        time: thisSlot.time,
        day: thisSlot.day,
        locationId: slot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      const room = await loactionmodel.findById(slot.locationId)
      if (room.type === locationType.OFFICE) {
        return res.json({
          error: 'This location can not be a teaching one',
          statusCode: wrongType,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { locationId: slot.locationId },
        { useFindAndModify: false }
      )
    } else if (slot.day) {
      const thisSlot = await slotmodel.findById(slot.id)
      const exists = await slotmodel.findOne({
        day: slot.day,
        time: thisSlot.time,
        locationId: thisSlot.locationId,
      })
      if (exists) {
        return res.json({
          error: 'This time is already occupied',
          statusCode: alreadyExists,
        })
      }
      await slotmodel.findByIdAndUpdate(
        slot.id,
        { day: slot.day },
        { useFindAndModify: false }
      )
    }
    return res.json({
      statusCode: success,
      message: 'Slot updated successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const addSlot = async (req, res) => {
  try {
    const myId = req.data.id
    const slot = req.body
    const room = await loactionmodel.findById(slot.locationId)
    if (room.type === locationType.OFFICE) {
      return res.json({
        error: 'This location can not be a teaching one',
        statusCode: wrongType,
      })
    }
    const slotE = await slotmodel.findOne({
      time: slot.time,
      locationId: slot.locationId,
      day: slot.day,
    })
    const slotsInCourse = await slotmodel.find({ courseId: slot.courseId })

    const course = await courseModel.findById(slot.courseId)
    if (!course)
      return res.json({
        statusCode: doesNotExist,
        error: 'course with this id does not exist',
      })
    if (course.numberOfSlots <= slotsInCourse.length) {
      return res.json({
        statusCode: fullCapacity,
        error: 'Cannot add any more slots to the course',
      })
    }
    if (course.courseCoordinatorId !== myId) {
      return res.json({
        statusCode: authentication,
        error: 'Cannot add a slot to a course you are not a CC in',
      })
    }
    if (slotE) {
      return res.json({
        error: 'This slot already exists',
        statusCode: alreadyExists,
      })
    }
    if (slot.staffId) {
      const staff = await staffmodel.findById(slot.staffId)
      if (staff.type !== staffType.TA && staff.type !== staffType.INSTRUCTOR) {
        console.log('member can not teach')
        return res.json({
          error: 'This staff member can not teach',
          statusCode: wrongCredentials,
        })
      }
      const staffLinked = await courseStaffmodel.findOne({
        courseId: slot.courseId,
        staffId: slot.staffId,
      })
      if (!staffLinked) {
        return res.json({
          error: 'This staff member cannot teach this course',
          statusCode: wrongCredentials,
        })
      }

      const taB = await slotmodel.findOne({
        staffId: slot.staffId,
        time: slot.time,
        day: slot.day,
      })
      if (taB) {
        return res.json({
          error: 'This Staff member is already busy',
          statusCode: alreadyBusy,
        })
      }
    }

    const slotCreated = await slotmodel.create(slot)

    return res.json({
      statusCode: success,
      message: 'Slot created successfully',
      slotCreated,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const checkCC = async (req, res) => {
  try {
    let flag = false
    const course = await courseModel.findOne({
      courseCoordinatorId: req.data.id,
    })
    if (course) flag = true

    return res.json({ statusCode: success, flag: flag })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const deleteSlot = async (req, res) => {
  try {
    const { id } = req.body
    const slotE = await slotmodel.findByIdAndDelete(id)

    if (!slotE) {
      return res.json({
        error: 'This slot does not exists',
        statusCode: entityNotFound,
      })
    }

    return res.json({
      statusCode: success,
      message: 'Slot deleted successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewTeachingAssignmentHOD = async (req, res) => {
  try {
    const staffId = req.data.id

    // const depid = await departmentModel.findOne({ HODId: staffId })
    const staffcourse = await coursemodel.find({
      departmentId: req.data.department,
    })
    console.log('staffCourse:', staffcourse)
    var returnData = []
    var allslots = []
    for (let j = 0; j < staffcourse.length; j++) {
      const teachingAssignment = await slotmodel.find({
        courseId: staffcourse[j]._id,
      })
      if (teachingAssignment.length > 0) allslots.push(teachingAssignment)
    }
    console.log('all slots: ', allslots)
    for (let i = 0; i < allslots.length; i++) {
      for (let h = 0; h < allslots[i].length; h++) {
        if (allslots[i][h].staffId) {
          const staff = await staffmodel.findById(allslots[i][h].staffId)
          const atten = {
            staffName: staff.name,
            locationName: (
              await loactionmodel.findById(allslots[i][h].locationId)
            ).name,
            courseName: (await coursemodel.findById(allslots[i][h].courseId))
              .name,
            type: allslots[i][h].type,
            time: allslots[i][h].time,
            day: allslots[i][h].day,
            slotId: allslots[i][h]._id,
          }
          returnData.push(atten)
        }
      }
    }
    return res.json({ statusCode: success, returnData })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewTeachingAssignmentCI = async (req, res) => {
  try {
    const staffId = req.data.id
    const staffcourse = await courseStaffmodel.find({ staffId: staffId })

    var returnData = []
    var allslots = []
    for (let j = 0; j < staffcourse.length; j++) {
      const teachingAssignment = await slotmodel.find({
        courseId: staffcourse[j].courseId,
      })
      if (teachingAssignment.length > 0) allslots.push(teachingAssignment)
    }

    for (let i = 0; i < allslots.length; i++) {
      for (let h = 0; h < allslots[i].length; h++) {
        if (allslots[i][h].staffId) {
          const staff = await staffmodel.findById(allslots[i][h].staffId)

          const atten = {
            staffName: staff ? staff.name : null,
            locationName: (
              await loactionmodel.findById(allslots[i][h].locationId)
            ).name,
            courseName: (await coursemodel.findById(allslots[i][h].courseId))
              .name,
            type: allslots[i][h].type,
            time: allslots[i][h].time,
            day: allslots[i][h].day,
            slotId: allslots[i][h]._id,
          }
          returnData.push(atten)
        }
      }
    }
    return res.json({ statusCode: success, returnData })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewSchedule = async (req, res) => {
  try {
    const staffId = req.data.id
    const staffSlots = await slotmodel.find({ staffId: staffId })
    var slots = []
    for (let i = 0; i < staffSlots.length; i++) {
      const slot = {
        _id: staffSlots[i]._id,
        locationName: (await loactionmodel.findById(staffSlots[i].locationId))
          .name,
        courseName: (await coursemodel.findById(staffSlots[i].courseId)).name,
        type: staffSlots[i].type,
        time: staffSlots[i].time,
        day: staffSlots[i].day,
      }
      slots.push(slot)
    }
    const staffRequests = await replacementmodel.find({
      receiverId: staffId,
      status: requestStatus.ACCEPTED,
      targetDate: {
        $gte: new Date(),
        $lte: new Date().setDate(new Date().getDate() + 6),
      },
    })
    var ReplacementRequests = []
    for (let i = 0; i < staffRequests.length; i++) {
      const slotaya = await slotmodel.findById(staffRequests[i].slotId)
      const requests = {
        senderId: staffRequests[i].senderId,
        slotId: staffRequests[i].slotId,
        targetDate: staffRequests[i].targetDate,
        dateSent: staffRequests[i].dateSent,
        status: staffRequests[i].status,
        locationName: (await loactionmodel.findById(slotaya.locationId)).name,
        courseName: (await coursemodel.findById(slotaya.courseId)).name,
        type: slotaya.type,
        time: slotaya.time,
        day: slotaya.day,
      }
      ReplacementRequests.push(requests)
    }

    return res.json({
      statusCode: success,
      slots,
      ReplacementRequests,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewAvailableSlots = async (req, res) => {
  try {
    const staffId = req.data.id
    const staffCourses = await courseStaffmodel.find({
      staffId: staffId,
    })
    const courseIds = []
    for (var i = 0; i < staffCourses.length; i++) {
      courseIds.push(staffCourses[i].courseId)
    }
    const availableSlot = await slotmodel.find({
      courseId: { $in: courseIds },
      staffId: null,
    })
    const final = []
    for (var i = 0; i < availableSlot.length; i++) {
      const one = {
        time: availableSlot[i].time,
        _id: availableSlot[i]._id,
        day: availableSlot[i].day,
      }
      one.courseName = (
        await coursemodel.findById(availableSlot[i].courseId)
      ).name
      final.push(one)
    }
    return res.json({
      statusCode: success,
      result: final,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const viewAvailableSlotsMyCourses = async (req, res) => {
  try {
    const myCourses = await courseStaffmodel.find({
      staffId: req.body.staffId,
    })
    if (!myCourses)
      return res.json({
        statusCode: unknown,
        error: 'Soemthing went wrong with fetching the course staff.',
      })
    var availableSlots
    var allAvailableSlots = []
    for (var i = 0; i < myCourses.length; i++) {
      availableSlots = await slotmodel.find({
        courseId: myCourses[i].courseId,
        staffId: null,
      })
      for (var j = 0; j < availableSlots.length; j++)
        allAvailableSlots.push(availableSlots[j])
    }

    const detailedSlots = []

    var courseName
    var locationName

    for (var i = 0; i < allAvailableSlots.length; i++) {
      courseName = await courseModel.findById(
        allAvailableSlots[i].courseId,
        'name'
      )
      locationName = await loactionmodel.findById(
        allAvailableSlots[i].locationId,
        'name'
      )
      detailedSlots.push(Object.assign({}, allAvailableSlots[i]))

      detailedSlots[i]['_doc']['staffName'] = ''
      detailedSlots[i]['_doc']['courseName'] = courseName.name
      detailedSlots[i]['_doc']['locationName'] = locationName.name
      detailedSlots[i] = detailedSlots[i]._doc
    }
    return res.json({ statusCode: success, slots: detailedSlots })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}

const viewAvailableSlotsMyDepartment = async (req, res) => {
  try {
    const myCourses = await courseModel.find({
      departmentId: req.body.departmentId,
    })
    if (!myCourses)
      return res.json({
        statusCode: unknown,
        error: 'Soemthing went wrong with fetching the courses.',
      })
    var availableSlots
    var allAvailableSlots = []
    for (var i = 0; i < myCourses.length; i++) {
      availableSlots = await slotmodel.find({
        courseId: myCourses[i]._id,
        staffId: null,
      })
      for (var j = 0; j < availableSlots.length; j++)
        allAvailableSlots.push(availableSlots[j])
    }

    const detailedSlots = []

    var courseName
    var locationName

    for (var i = 0; i < allAvailableSlots.length; i++) {
      courseName = await courseModel.findById(
        allAvailableSlots[i].courseId,
        'name'
      )
      locationName = await loactionmodel.findById(
        allAvailableSlots[i].locationId,
        'name'
      )
      detailedSlots.push(Object.assign({}, allAvailableSlots[i]))

      detailedSlots[i]['_doc']['staffName'] = ''
      detailedSlots[i]['_doc']['courseName'] = courseName.name
      detailedSlots[i]['_doc']['locationName'] = locationName.name
      detailedSlots[i] = detailedSlots[i]._doc
    }
    return res.json({ statusCode: success, slots: detailedSlots })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewAllSlotsMyCourses = async (req, res) => {
  try {
    const myCourses = await courseStaffmodel.find({
      staffId: req.body.staffId,
    })
    if (!myCourses)
      return res.json({
        statusCode: unknown,
        error: 'Something went wrong with fetching the course staff.',
      })
    var availableSlots
    var allAvailableSlots = []

    for (var i = 0; i < myCourses.length; i++) {
      availableSlots = await slotmodel.find({
        courseId: myCourses[i].courseId,
        // staffId: { $ne: null },
      })
      for (var j = 0; j < availableSlots.length; j++)
        allAvailableSlots.push(availableSlots[j])
    }

    const detailedSlots = []
    var staffName = {}
    var courseName
    var locationName

    for (var i = 0; i < allAvailableSlots.length; i++) {
      if (allAvailableSlots[i].staffId) {
        staffName = await staffmodel.findById(
          allAvailableSlots[i].staffId,
          'name'
        )
      }

      courseName = await courseModel.findById(
        allAvailableSlots[i].courseId,
        'name'
      )
      locationName = await loactionmodel.findById(
        allAvailableSlots[i].locationId,
        'name'
      )

      detailedSlots.push(Object.assign({}, allAvailableSlots[i]))
      if (allAvailableSlots[i].staffId)
        detailedSlots[i]['_doc']['staffName'] = staffName.name
      detailedSlots[i]['_doc']['courseName'] = courseName.name
      detailedSlots[i]['_doc']['locationName'] = locationName.name
      detailedSlots[i] = detailedSlots[i]._doc
    }

    return res.json({ statusCode: success, slots: detailedSlots })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const viewAllSlotsMyDepartment = async (req, res) => {
  try {
    const myCourses = await courseModel.find({
      departmentId: req.body.departmentId,
    })

    if (!myCourses)
      return res.json({
        statusCode: unknown,
        error: 'Soemthing went wrong with fetching the courses.',
      })
    var availableSlots
    var allAvailableSlots = []
    for (var i = 0; i < myCourses.length; i++) {
      availableSlots = await slotmodel.find({
        courseId: myCourses[i]._id,
      })
      for (var j = 0; j < availableSlots.length; j++)
        allAvailableSlots.push(availableSlots[j])
    }

    const detailedSlots = []
    var staffName = {}
    var courseName
    var locationName

    for (var i = 0; i < allAvailableSlots.length; i++) {
      if (allAvailableSlots[i].staffId) {
        staffName = await staffmodel.findById(
          allAvailableSlots[i].staffId,
          'name'
        )
      }
      courseName = await courseModel.findById(
        allAvailableSlots[i].courseId,
        'name'
      )
      locationName = await loactionmodel.findById(
        allAvailableSlots[i].locationId,
        'name'
      )
      detailedSlots.push(Object.assign({}, allAvailableSlots[i]))
      if (allAvailableSlots[i].staffId)
        detailedSlots[i]['_doc']['staffName'] = staffName.name
      detailedSlots[i]['_doc']['courseName'] = courseName.name
      detailedSlots[i]['_doc']['locationName'] = locationName.name
      detailedSlots[i] = detailedSlots[i]._doc
    }
    return res.json({ statusCode: success, slots: detailedSlots })
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}

module.exports = {
  assignStaff,
  deleteStaff,
  upDateStaff,
  addSlot,
  deleteSlot,
  viewTeachingAssignmentHOD,
  viewTeachingAssignmentCI,
  viewSchedule,
  viewAvailableSlotsMyCourses,
  viewAvailableSlotsMyDepartment,
  updateSlot,
  viewAvailableSlots,
  viewAllSlotsMyCourses,
  viewAllSlotsMyDepartment,
  checkCC,
}
