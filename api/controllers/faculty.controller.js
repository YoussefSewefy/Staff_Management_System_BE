const departmentModel = require('../../models/department.model')
const facultymodel = require('../../models/faculty.model')
const {
  entityNotFound,
  unknown,
  alreadyExists,
  wrongCredentials,
  success,
  emailshouldbeunique,
} = require('../constants/statusCodes')

const addFaculty = async (req, res) => {
  try {
    const faculty = req.body
    const facultyfound = await facultymodel.findOne({ name: faculty.name })
    if (facultyfound) {
      return res.json({
        error: 'This Faculty already exists',
        statusCode: alreadyExists,
      })
    }
    const facultyCreated = await facultymodel.create(faculty)
    return res.json({
      statusCode: success,
      message: 'Faculty created successfully',
      facultyCreated,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const deleteFaculty = async (req, res) => {
  try {
    const facultyID = req.body.id
    const facultyfound = await facultymodel.findByIdAndDelete(facultyID)
    if (!facultyfound) {
      return res.json({
        error: 'This Faculty does not exist',
        statusCode: entityNotFound,
      })
    }
    await departmentModel.updateMany(
      { facultyId: facultyID },
      { facultyId: null }
    )
    return res.json({
      statusCode: success,
      message: 'Faculty deleted successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const upDateFaculty = async (req, res) => {
  try {
    const { id, name, numberOfStudents, building } = req.body
    const facultyfound = await facultymodel.findById(id)
    if (!facultyfound) {
      return res.json({
        error: 'Faculty does not exist',
        statusCode: entityNotFound,
      })
    }
    if (!name && !numberOfStudents && !building) {
      return res.json({
        error: 'Please enter data to update it',
        statusCode: wrongCredentials,
      })
    }
    if (name) {
      const facultyyy = await facultymodel.findOne({
        name: name,
      })
      if (name != facultyfound.name && facultyyy) {
        return res.json({
          error: 'Faculty name must be unique',
          statusCode: emailshouldbeunique,
        })
      }
      await facultymodel.findByIdAndUpdate(
        id,
        { name: name },
        { useFindAndModify: false }
      )
    }
    if (numberOfStudents) {
      await facultymodel.findByIdAndUpdate(
        id,
        { numberOfStudents: numberOfStudents },
        { useFindAndModify: false }
      )
    }
    if (building) {
      await facultymodel.findByIdAndUpdate(
        id,
        { building: building },
        { useFindAndModify: false }
      )
    }

    return res.json({
      statusCode: success,
      message: 'Faculty info update successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllFac = async (req, res) => {
  try {
    const allFaculties = await facultymodel.find()
    return res.json({
      statusCode: success,
      allFaculties,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

module.exports = { addFaculty, deleteFaculty, upDateFaculty, viewAllFac }
