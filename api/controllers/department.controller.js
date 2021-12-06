const departmentmodel = require('../../models/department.model')
const staffmodel = require('../../models/staff.model')
const facultymodel = require('../../models/faculty.model')
const { staffType } = require('../constants/enums')
const {
  entityNotFound,
  unknown,
  alreadyExists,
  wrongCredentials,
  success,
  accountDeleted,
  wrongType,
  doesNotExist,
} = require('../constants/statusCodes')
const courseModel = require('../../models/course.model')
const departmentModel = require('../../models/department.model')

const addDepartment = async (req, res) => {
  try {
    const department = req.body
    const departmentExist = await departmentmodel.findOne({
      name: department.name,
      facultyId: department.facultyId,
    })
    if (departmentExist) {
      return res.json({
        error: 'This departent already exists',
        statusCode: alreadyExists,
      })
    }
    const faculty = await facultymodel.findById(department.facultyId)
    if (!faculty)
      return res.json({
        statusCode: doesNotExist,
        error: 'faculty does not exist',
      })
    const HODId = req.body.HODId
    if (HODId) {
      const notHOD = await staffmodel.findById(HODId)
      if (!notHOD) {
        return res.json({
          error: 'This Staff member does not exist',
          statusCode: entityNotFound,
        })
      }
      if (notHOD.type !== staffType.HOD) {
        return res.json({
          error: 'This Staff member can not be head of a department',
          statusCode: wrongCredentials,
        })
      }
    }
    await departmentmodel.updateOne({ HODId: HODId }, { HODId: null })
    const newDep = await departmentmodel.create(department)
    await staffmodel.updateOne({ _id: HODId }, { department: newDep._id })
    return res.json({
      statusCode: success,
      message: 'Department created  successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const deleteDepartment = async (req, res) => {
  try {
    const departmentID = req.body.id
    await staffmodel.updateMany(
      { department: departmentID },
      { department: null }
    )
    await courseModel.updateMany(
      { departmentId: departmentID },
      { departmentId: null }
    )
    const departmentfound = await departmentmodel.findByIdAndDelete(
      departmentID
    )
    await courseModel.updateMany(
      { departmentId: departmentID },
      { departmentId: null }
    )
    await staffmodel.updateMany(
      { departmentId: departmentID },
      { departmentId: null }
    )
    if (!departmentfound) {
      return res.json({
        error: 'This department does not exist',
        statusCode: entityNotFound,
      })
    }
    return res.json({
      statusCode: success,
      message: 'Department deleted  successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}

const upDateDepartment = async (req, res) => {
  try {
    const { id, name, HODId, facultyId } = req.body
    let departmentfound = await departmentmodel.findById(id)
    if (!HODId && !facultyId && !name) {
      return res.json({
        error: 'Please enter data to update it',
        statusCode: wrongCredentials,
      })
    }
    if (!departmentfound) {
      return res.json({
        error: 'Department does not exist',
        statusCode: entityNotFound,
      })
    }
    if (name) {
      const departmentExist = await departmentmodel.findOne({
        name: name,
        facultyId: departmentfound.facultyId,
      })
      if (departmentExist) {
        return res.json({
          error: 'This department already exists',
          statusCode: alreadyExists,
        })
      }
      await departmentmodel.findByIdAndUpdate(
        id,
        { name: name },
        { useFindAndModify: false }
      )
    }
    if (HODId) {
      const notHOD = await staffmodel.findById(HODId)
      if (!notHOD) {
        return res.json({
          error: 'This Staff member does not exist',
          statusCode: entityNotFound,
        })
      }
      if (notHOD.type !== staffType.HOD) {
        return res.json({
          error: 'This Staff member can not be head of a department',
          statusCode: wrongCredentials,
        })
      }
      await departmentmodel.updateOne({ HODId: HODId }, { HODId: null })
      await staffmodel.updateOne({ _id: HODId }, { department: id })
      await departmentmodel.findByIdAndUpdate(
        id,
        { HODId: HODId },
        { useFindAndModify: false }
      )
    }
    if (facultyId) {
      const departmentExist = await departmentmodel.findOne({
        name: departmentfound.name,
        facultyId: facultyId,
      })
      if (departmentExist) {
        return res.json({
          error: 'This department already exists',
          statusCode: alreadyExists,
        })
      }
      const facultyfound = await facultymodel.findById(facultyId)
      if (!facultyfound) {
        return res.json({
          error: 'Faculty does not exist',
          statusCode: entityNotFound,
        })
      }
      await departmentmodel.findByIdAndUpdate(
        id,
        { facultyId: facultyId },
        { useFindAndModify: false }
      )
    }
    if (!departmentfound) {
      return res.json({
        error: 'Department does not exist',
        statusCode: entityNotFound,
      })
    }
    return res.json({
      statusCode: success,
      message: 'Department info updated successfully',
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const getDepartments = async (req, res) => {
  try {
    const departments = await departmentModel.find()
    return res.json({
      statusCode: success,
      departments,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const getTAsinDepartment = async (req, res) => {
  try {
    const staff = await staffmodel.find({
      department: req.body.id,
      type: staffType.TA,
    })
    return res.json({
      statusCode: success,
      staff,
    })
  } catch (exception) {
    console.log(exception)
    return res.json({
      error: 'Something went wrong',
      statusCode: unknown,
    })
  }
}
const viewAllDep = async (req, res) => {
  try {
    const Dep = await departmentmodel.find()
    var allDep = []
    for (let i = 0; i < Dep.length; i++) {
      var fn = 'N/A'
      if (Dep[i].facultyId) {
        fn = (await facultymodel.findById(Dep[i].facultyId)).name
      }
      var h = 'N/A'
      if (Dep[i].HODId) {
        h = (await staffmodel.findById(Dep[i].HODId)).name
      }

      const Dep1 = {
        id: Dep[i].id,
        facultyId: Dep[i].facultyId,
        HODId: Dep[i].HODId,
        facultyName: fn,
        name: Dep[i].name,
        HODName: h,
      }
      allDep.push(Dep1)
    }
    return res.json({
      statusCode: success,
      allDep,
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
  addDepartment,
  deleteDepartment,
  upDateDepartment,
  getDepartments,
  getTAsinDepartment,
  viewAllDep,
}
