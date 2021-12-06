const express = require('express')
const {
  verifyTASCOURSE,
  verifyHOD,
  verifyCI,
  verifyToken,
  verifyINSinCOURSE,
  verifyTASinCOURSE,
  verifyNotHR,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  assignStaff,
  deleteStaff,
  upDateStaff,
  addSlot,
  deleteSlot,
  updateSlot,
  viewTeachingAssignmentHOD,
  viewTeachingAssignmentCI,
  viewSchedule,
  viewAvailableSlots,
  viewAvailableSlotsMyCourses,
  viewAvailableSlotsMyDepartment,
  viewAllSlotsMyCourses,
  viewAllSlotsMyDepartment,
  checkCC,
} = require('../controllers/slot.controller')
const {
  validateAddSlot,
  validateAandUOfSlot,
  validatedeleteStaffFromSlot,
  validateDeleteSlot,
  validateUpdateSlot,
  validateViewSlotsMyCourses,
  validateViewSlotsMyDepartment,
} = require('../middleware/validations/slot.validations')

router.post('/assignStaff', validateAandUOfSlot, verifyINSinCOURSE, assignStaff)
router.delete(
  '/deleteStaff',
  validatedeleteStaffFromSlot,
  verifyINSinCOURSE,
  deleteStaff
)
router.put('/updateStaff', validateAandUOfSlot, verifyINSinCOURSE, upDateStaff)

router.post('/addSlot', validateAddSlot, verifyTASCOURSE, addSlot)
router.delete('/deleteSlot', validateDeleteSlot, verifyTASinCOURSE, deleteSlot)
router.put('/updateSlot', validateUpdateSlot, verifyTASinCOURSE, updateSlot)
router.post('/checkCC', verifyToken, checkCC)
router.post('/viewTeachingAssignmentHOD', verifyHOD, viewTeachingAssignmentHOD)
router.post('/viewTeachingAssignmentCI', verifyCI, viewTeachingAssignmentCI)
router.get('/viewSchedule', verifyNotHR, viewSchedule)
router.get('/viewAvailableSlots', verifyNotHR, viewAvailableSlots)
router.post(
  '/viewCoursesSlots',

  validateViewSlotsMyCourses,
  viewAvailableSlotsMyCourses
)
router.post(
  '/viewDepartmentSlots',

  validateViewSlotsMyDepartment,
  viewAvailableSlotsMyDepartment
)
router.post(
  '/viewAllCoursesSlots',
  verifyToken,
  validateViewSlotsMyCourses,
  viewAllSlotsMyCourses
)
router.post(
  '/viewAllDepartmentSlots',
  verifyToken,
  validateViewSlotsMyDepartment,
  viewAllSlotsMyDepartment
)
module.exports = router
