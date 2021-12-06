const express = require('express')
const {
  verifyHR,
  verifyHODINSCourse,
  verifyToken,
  verifyINSCOURSE,
} = require('../auth/verifyToken')
const router = express.Router()
const {
  addCourse,
  deleteCourse,
  updateCourse,
  viewCourseCoverage,
  viewCourses,
  viewCourse,
  coursename,
  viewCoursesInDepartment,
  updateCourseINS,
} = require('../controllers/course.controller')
const {
  validateAddCourse,
  validateDeleteCourse,
  validateUpdateCourse,
  validateViewCourseCoverage,
  validateCoursesInDepartment,
  validateUpdateCourseINS,
} = require('../middleware/validations/course.validations')

router.post('/addCourse', validateAddCourse, verifyHR, addCourse)
router.put('/updateCourse', validateUpdateCourse, verifyHR, updateCourse)
router.put(
  '/updateCourseINS',
  validateUpdateCourseINS,
  verifyINSCOURSE,
  updateCourseINS
)
router.delete('/deleteCourse', validateDeleteCourse, verifyHR, deleteCourse)
router.post(
  '/viewCourseCoverage',
  validateViewCourseCoverage,
  verifyHODINSCourse,
  viewCourseCoverage
)
router.get('/viewCourses', verifyToken, viewCourses)
router.post('/viewCourse', validateDeleteCourse, verifyHR, viewCourse)
router.post('/viewCourseINS', validateDeleteCourse, verifyINSCOURSE, viewCourse)

router.post('/coursename', validateDeleteCourse, verifyToken, coursename)
router.post(
  '/viewCoursesInDepartment',
  validateCoursesInDepartment,
  verifyToken,
  viewCoursesInDepartment
)

module.exports = router
