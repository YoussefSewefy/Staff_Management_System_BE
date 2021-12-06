const express = require('express')
const cors = require('cors')
const allRoutes = require('express-list-endpoints')
const { connectDB } = require('./config/dbConfig')
const staff = require('./api/routers/staff.router')
const leave = require('./api/routers/leave.router')
const schedule = require('./api/routers/schedule.router')
const slot = require('./api/routers/slot.router')
const faculty = require('./api/routers/faculty.router')
const replacement = require('./api/routers/replacement.router')
const attendence = require('./api/routers/attendence.router')
const department = require('./api/routers/department.router')
const notification = require('./api/routers/notification.router')
const course = require('./api/routers/course.router')
const courseStaff = require('./api/routers/courseStaff.router')
const location = require('./api/routers/location.router')
const salary = require('./api/routers/salary.router')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const explore = (req, res) => {
  const routes = allRoutes(app)
  const result = {
    ServiceList: [],
  }

  routes.forEach((route) => {
    const name = route.path.split('/')[5]
    result.ServiceList.push({
      Service: {
        name,
        fullUrl: `${route.path}`,
      },
    })
  })
  return res.json({ result, count: result.ServiceList.length })
}
app.use('/explore', explore)
app.use('/staff', staff)
app.use('/attendence', attendence)
app.use('/slot', slot)
app.use('/faculty', faculty)
app.use('/department', department)
app.use('/replacement', replacement)
app.use('/leave', leave)
app.use('/schedule', schedule)
app.use('/notification', notification)
app.use('/course', course)
app.use('/location', location)
app.use('/courseStaff', courseStaff)
app.use('/salary', salary)
app.use((req, res) => {
  res.status(404).send({ err: 'No such url' })
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Origin', 'GET, POST, OPTIONS')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, X-Auth-Token, Accept'
  )
  next()
})
connectDB()

const port = 5000
if (process.env.PORT) {
  app.listen(process.env.PORT, () =>
    console.log(`Server up and running on ${process.env.PORT}`)
  )
} else {
  app.listen(port, () => console.log(`Server up and running on ${port}`))
}
