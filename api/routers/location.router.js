const express = require('express')
const { verifyToken, verifyHR, verifyHRCIHOD } = require('../auth/verifyToken')
const router = express.Router()
const {
  addLocation,
  assignOffice,
  deleteLocation,
  updateLocation,
  getLocations,
  viewLocations,
} = require('../controllers/location.controller')
const {
  validateAddLocation,
  validateAssignOffice,
  validateDeleteLocation,
  validateUpdateLocation,
} = require('../middleware/validations/location.validations')

router.post('/addLocation', validateAddLocation, verifyHR, addLocation)
router.delete(
  '/deleteLocation',
  validateDeleteLocation,
  verifyHR,
  deleteLocation
)
router.put('/updateLocation', validateUpdateLocation, verifyHR, updateLocation)
router.put('/assignOffice', validateAssignOffice, verifyHR, assignOffice)
router.get('/getLocations', verifyHRCIHOD, getLocations)
router.get('/viewLocations', verifyHR, viewLocations)
router.post('/viewLocations', verifyToken, viewLocations)

module.exports = router
