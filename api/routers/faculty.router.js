const express = require('express')
const { verifyHR } = require('../auth/verifyToken')
const router = express.Router()
const {
  addFaculty,
  deleteFaculty,
  upDateFaculty,
  viewAllFac,
} = require('../controllers/faculty.controller')
const {
  validateAddFaculty,
  validateupdateFaculty,
  validateDeleteFaculty,
} = require('../middleware/validations/faculty.validations')

router.post('/addFaculty', validateAddFaculty, verifyHR, addFaculty)
router.delete('/deleteFaculty', validateDeleteFaculty, verifyHR, deleteFaculty)
router.put('/updateFaculty', validateupdateFaculty, verifyHR, upDateFaculty)
router.get('/viewAllFaculties', verifyHR, viewAllFac)

module.exports = router
