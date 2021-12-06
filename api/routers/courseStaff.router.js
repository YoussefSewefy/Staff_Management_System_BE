const express = require('express')
const {
  verifyHODCourse,
  verifyINSCOURSE,
  verifyForViewCourseStaff,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  assignInstructor,
  assignStaff,
  deleteInstructor,
  deleteStaff,
  updateInstructor,
  viewCourseStaff,
  getInstructors,
  getStaff,
  updateStaff,
} = require('../controllers/courseStaff.controller')
const {
  validateAssignInstructor,
  validateAssignStaff,
  validateDeleteInstructor,
  validateDeleteStaff,
  validateUpdateInstructor,
  validateViewCourseStaff,
} = require('../middleware/validations/courseStaff.validations')

router.post(
  '/viewCourseStaff',
  validateViewCourseStaff,
  verifyForViewCourseStaff,
  viewCourseStaff
)

router.post(
  '/assignInstructor',
  validateAssignInstructor,
  verifyHODCourse,

  assignInstructor
)
router.post('/assignStaff', validateAssignStaff, verifyINSCOURSE, assignStaff)
router.delete('/deleteStaff', validateDeleteStaff, verifyINSCOURSE, deleteStaff)
router.delete(
  '/deleteInstructor',

  validateAssignInstructor,
  verifyHODCourse,
  deleteInstructor
)
router.put(
  '/updateInstructor',
  validateUpdateInstructor,
  verifyHODCourse,
  updateInstructor
)
router.post(
  '/getInstructors',
  validateViewCourseStaff,
  verifyHODCourse,
  getInstructors
)
router.put(
  '/updateStaff',
  validateUpdateInstructor,
  verifyINSCOURSE,
  updateStaff
)
router.post('/getStaff', validateViewCourseStaff, verifyINSCOURSE, getStaff)
module.exports = router
