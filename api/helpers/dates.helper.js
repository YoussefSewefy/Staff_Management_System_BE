function checkDateExist(year, month, day) {
  const taskYear = year
  const taskDay = day
  // eslint-disable-next-line radix
  const taskMonth = parseInt(month)

  if (taskMonth === 2) {
    const yearDiff = taskYear - 2020
    if (yearDiff % 4 === 0) {
      if (taskDay > 29) {
        return false
      }
    } else if (taskDay > 28) {
      return false
    }
  } else if (
    taskMonth === 4 ||
    taskMonth === 6 ||
    taskMonth === 9 ||
    taskMonth === 11
  ) {
    if (taskDay > 30) {
      return false
    }
  }
  return true
}
module.exports = { checkDateExist }
