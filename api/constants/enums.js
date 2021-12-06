const gender = {
  MALE: 'male',
  FEMALE: 'female',
}
const staffType = {
  HR: 'hr',
  INSTRUCTOR: 'instructor',
  TA: 'ta',
  HOD: 'hod',
}
const slotType = {
  LAB: 'lab',
  TUTORIAL: 'tutorial',
  LECTURE: 'lecture',
}
const requestStatus = {
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  PENDING: 'pending',
  CANCELED: 'canceled',
}
const locationType = {
  OFFICE: 'office',
  HALL: 'hall',
  ROOM: 'room',
}
const leaveRequestType = {
  SICK: 'sick',
  ACCIDENTAL: 'accidental',
  MATERNITY: 'maternity',
  COMPENSATION: 'compensation',
  ANNUAL: 'annual',
}
const roleInCourse = {
  INSTRUCTOR: 'instructor',
  TA: 'ta',
  COURSECOORDINATOR: 'courseCoordinator',
}

const passwordStatus = {
  DEFAULT: 'default',
  CHANGED: 'changed',
}
const day = {
  SUNDAY: 'sunday',
  MONDAY: 'monday',
  TUESDAY: 'tuesday',
  WEDNESDAY: 'wednesday',
  THURSDAY: 'thursday',
  FRIDAY: 'friday',
  SATURDAY: 'saturday',
}

const scheduleType = {
  LINKING: 'linking',
  CHANGEDAY: 'changeDay',
}
const notificationType = {
  LEAVE: 'leave',
  SCHEDULE: 'schedule',
  REPLACEMENT: 'replacement',
  ASSIGNMENT: 'assignment',
}
module.exports = {
  gender,
  staffType,
  slotType,
  requestStatus,
  locationType,
  leaveRequestType,
  roleInCourse,
  passwordStatus,
  day,
  scheduleType,
  notificationType,
}
