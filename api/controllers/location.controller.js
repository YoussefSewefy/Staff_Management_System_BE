const jwt = require('jsonwebtoken')
const { signingKey } = require('../../config/keys')
const CourseModel = require('../../models/course.model')
const DepartmentModel = require('../../models/department.model')
const SlotModel = require('../../models/slot.model')
const StaffModel = require('../../models/staff.model')
const LocationModel = require('../../models/location.model')
const {
  doesNotExist,
  success,
  unknown,
  alreadyExists,
  typeMismatch,
  alreadyAssigned,
  fullCapacity,
} = require('../../api/constants/statusCodes')
const { locationType } = require('../constants/enums')
const locationModel = require('../../models/location.model')

const addLocation = async (req, res) => {
  try {
    const locationName = req.body.location.name
    var location = await LocationModel.findOne({ name: locationName })
    if (location) {
      return res.json({
        statusCode: alreadyExists,
        error: 'Location with that name already exists.',
      })
    } else {
      location = new LocationModel(req.body.location)
      return location
        .save()
        .then(() => {
          return res.json({ statusCode: success })
        })
        .catch((err) => {
          return res.json({ statuscode: unknown, error: err })
        })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const updateLocation = async (req, res) => {
  try {
    const locationId = req.body.locationId
    const location = await LocationModel.findById(locationId)
    const newLocation = req.body.location
    if (location) {
      if (newLocation.name) {
        const newLocationNameQuery = await LocationModel.findOne({
          name: newLocation.name,
        })

        if (newLocationNameQuery)
          return res.json({
            statusCode: alreadyExists,
            error: 'Location with this name already exists',
          })
      }

      return LocationModel.update({ _id: locationId }, newLocation)
        .then(() => {
          return res.json({ statusCode: success })
        })
        .catch((err) => {
          return res.json({ statusCode: unknown, error: err })
        })
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'location with this ID does not exist',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const deleteLocation = async (req, res) => {
  try {
    const locationId = req.body.locationId
    const location = await LocationModel.findById(locationId)
    if (location) {
      try {
        const slotUpdate = await SlotModel.updateMany(
          { locationId: locationId },
          { locationId: null }
        )
        const staffUpdated = await StaffModel.updateMany(
          { officeLocation: locationId },
          { officeLocation: null }
        )
        return LocationModel.deleteOne({ _id: locationId }, req.body.location)
          .then(() => {
            return res.json({ statusCode: success })
          })
          .catch((err) => {
            return res.json({ statusCode: unknown, error: err })
          })
      } catch (err) {
        return res.json({ statusCode: unknown, error: err.message })
      }
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'location with this ID does not exist',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}
const assignOffice = async (req, res) => {
  try {
    const locationId = req.body.locationId
    const staffId = req.body.staffId
    const staff = await StaffModel.findById(staffId)

    if (staff) {
      if (staff.officeLocation === locationId)
        return res.json({
          statusCode: alreadyAssigned,
          error: 'Staff member is already assigned to this office',
        })
      const location = await LocationModel.findById(locationId)
      if (location) {
        const staffOffice = await StaffModel.find({
          officeLocation: locationId,
        })
        if (staffOffice.length < location.capacity) {
          if (location.type === locationType.OFFICE) {
            return StaffModel.updateOne(
              { _id: staffId },
              { officeLocation: locationId }
            )
              .then(() => {
                return res.json({ statusCode: success })
              })
              .catch((err) => {
                return res.json({ statusCode: unknown, error: err })
              })
          } else
            return res.json({
              statusCode: typeMismatch,
              error: 'location is not an office',
            })
        } else {
          return res.json({
            statusCode: fullCapacity,
            error: 'location is at maximum capacity',
          })
        }
      } else {
        return res.json({
          statusCode: doesNotExist,
          error: 'location with this ID does not exist',
        })
      }
    } else {
      return res.json({
        statusCode: doesNotExist,
        error: 'staff member with this ID does not exist',
      })
    }
  } catch (err) {
    return res.json({ statusCode: unknown, error: err.message })
  }
}

const getLocations = async (req, res) => {
  try {
    const locations = await LocationModel.find()
    return res.json({
      statusCode: success,
      locations,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewLocations = async (req, res) => {
  try {
    const locations = await locationModel.find()
    return res.json({
      statusCode: success,
      locations,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
module.exports = {
  addLocation,
  updateLocation,
  deleteLocation,
  assignOffice,
  getLocations,
  viewLocations,
}
