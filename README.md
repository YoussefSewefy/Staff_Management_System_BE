# ACL_Project

1. run server.js in the root.
2. server is listening to port 5000

---

If the database is at first empty, the server will automatically add an HR called mostafa with password 12345678 and email
mostafa@gmail.com

---

In any request, the token should be copied in the Headers at the key Authorization.
Note: all the IDs in the example requests are of course invalid in your database, we are using mongoDB auto-generated id as a foreign key accross the whole database and we return the id instead of the name in the response of the services we made. This will not be the case in the frontend as we returned the ids to use them in the frontend and get the data of the object related to this ID so in the frontend we will show user friendly data.
HOD = Head of Department
CI = Course Instructor
CC = Course Coordinator

Schedulers:
We have 3 scheculers: day, month and year.

1. Day Scheduler: It gets called at 12:00 AM each day and increments the missing days of the staff who didn't sign in and out in the past day by 1.
2. Month Scheduler: It gets called on the 11th day at 12:00 AM, it calculates the staff salary for the past month including the salary deduction due to missing days or missing hours more than 3 and it updates the days that should be compensated on the next month if any. In addition to that, it increments the leave balance by 2.5
3. Year scheduler: It gets called on the 11th day in December at 12:00 AM. It sets the leave balance for any staff back to 0, and the accidental leave balance back to 6.

---

Error Codes are defined as follows:
breach: '007',
success: '000',
authentication: '001',
validation: '003',
entityNotFound: '004',
accountDeleted: '002',
wrongCredentials: '005',
alreadyBusy: '008',
alreadyEmpty: '009',
unknown: '006',
emailshouldbeunique: '011',
fullCapacity: '012',
alreadyExists: '015',
canNotSendRequest: '021',
notRequiredType: '013',
samePassword: '014',
cannotoverwrite: '015',
wrongdateentry: '016',
canNotUpdate: '025',
dateDoesNotExist: '050',
dateCannotBeInThePast: '051',
startDateMustBeBeforeEndTime: '052',
cannotCancelRequest: '053',
leaveMustBeMaxThree: '054',
leaveBalanceLimitReached: '055',
requestExceedsBalance: '056',
wrongType: '071',
doesNotExist: '022',
alreadyAssigned: '026',
typeMismatch: '027',
notAssignedBeforeDelete: '028',
alreadyExists: '029',
HODExists: '111',
alreadyAccepted: '030',

---

-- Faculty:

1. -Functionality: Add a new Faculty (Only an HR user can do this)
   -Route: /faculty/addFaculty
   -Request type: POST
   -Request body: {
   "name": "Applied Arts",
   "numberOfStudents": 1000,
   "building": "D"
   } Note: numberOfStudents and building are not required
   -Response: Status code "Success", a message, and the faculty created.
   Example: {
   "statusCode": "000",
   "message": "Faculty created successfully",
   "facultyCreated": {
   "\_id": "5fe227829487f803ec365a05",
   "name": "MET",
   "numberOfStudents": 1000,
   "building": "D",
   "\_\_v": 0
   }
   }

---

2. -Functionality: Update a Faculty (Only an HR user can do this)
   -Route: /faculty/updateFaculty
   -Request type: PUT
   -Request body: {
   "id":"5fe2271c59b88c386c74b9c9",
   "name":"MET",
   "numberOfStudents": 1000,
   "building": "D"
   }Note: id and at least one aspect in the faculty are required
   -Response: Status code "Success" and a message
   Example: {
   "statusCode": "000",
   "message": "Faculty info update successfully"
   }

---

3. -Functionality: Delete a Faculty (Only an HR user can do this)
   -Route: /faculty/deleteFaculty
   -Request type: DELETE
   -Request body: {
   "id":"5fe2271c59b88c386c74b9c9",
   }Note: id is required
   -Response: Status code "Success" and a message
   Example: {
   "statusCode": "000",
   "message": "Faculty deleted successfully"
   }

---

-- Department:

4. -Functionality: Add a new Department (Only an HR user can do this)
   -Route: /department/addDepartment
   -Request type: POST
   -Request body:{
   "facultyId":"5fe2271c59b88c386c74b9c9",
   "name": "CS"
   }Note: id is required
   -Response: Status code "Success" and a message
   Example: {
   "statusCode":"000",
   "message":"department created successfully"
   }

---

5. -Functionality: Update a Department (Only an HR user can do this)
   -Route: /department/updateDepartment
   -Request type: PUT
   -Request body:{
   "id":"5fe228e33670180694e771eb",
   "facultyId":"5fe22ba337ed526fbc2137ef",
   "name": "CS",
   "HODId": "5fe22ba337ed526fbc2137es",
   }Note: id and at least one aspect in the department are required
   -Response: Status code "Success" and a message
   Example: {
   "statusCode":"000",
   "message":"Department info updated successfully"
   }

---

6. -Functionality: Delete a Department (Only an HR user can do this)
   -Route: /department/deleteDepartment
   -Request type: DELETE
   -Request body:{  
    "id":"5fe228e33670180694e771eb"
   }Note: id is required
   -Response: Status code "Success" and a message
   Example: {
   "statusCode":"000",
   "message":"Department deleted successfully"
   }

---

--Location:

7. -Functionality: Add a new Location (Only an HR user can do this)
   -Route: /location/addLocation
   -Request type: POST
   -Request body:{
   "location": {
   "type":"hall",
   "name": "H14",
   "capacity":200,
   }
   }Note: Everything is required in this request
   -Response: Status code "Success"
   Example:{"statusCode":"000"}

---

8. -Functionality: Update a Location (Only an HR user can do this)
   -Route: /location/updateLocation
   -Request type: PUT
   -Request body:{
   "locationId":"5fdd0c2096b4832898d7d5a7",
   "location": {
   "type":"hall",
   "name": "H14",
   "capacity":200,
   }
   }Note: The locationId and the location object are both required however the location object can be empty.
   -Response: Status code "Success"
   Example:{
   "statusCode":"000"
   }

---

9. -Functionality: Delete a Location (Only an HR user can do this)
   -Route: /location/deleteLocation
   -Request type: DELETE
   -Request body:{
   "locationId":"5fdd0c2096b4832898d7d5a7"
   }Note: The locationId is required.
   -Response: Status code "Success"
   Example:{statusCode:"000"}

---

10. -Functionality: Assigning an office to a staff member (Only an HR user can do this)
    -Route: /location/asssignOffice
    -Request type: PUT
    -Request body:{
    "locationId":"5fdd0c2096b4832898d7d5a7"
    "staffId":"5fdd0c2096b5632898d7d5a7"
    }Note: The locationId and staffId are required.
    -Response: Status code "Success"
    Example:{statusCode:"000"}

---

--Staff:

11. -Functionality: Add an new Staff (Only an HR user can do this)
    -Route: /staff/addStaff
    -Request type: POST
    -Request body:
    {
    "email": "mostafahatem@gmail.com",
    "name": "Mostafa",
    "officeLocation": "5fdd0c2096b4832898d7d5a7",
    "salary": 3000,
    "type": "instructor",
    "dayOff": "saturday",
    "gender":"male",
    "department":"5fdd0c2045b4832898d7d5a7"
    }Note: gender and department are not required.
    -Response: Status code "Success" and the staff created
    Example:
    {
    "statusCode": "000",
    "staff": {
    "\_id": "5fdd42109f077044445e251c",
    "email": "mostafahatem304@gmail.com",
    "name": "Mostafa",
    "officeLocation": "5fdd0c2096b4832898d7d5a7",
    "salary": 3000,
    "type": "instructor",
    "password": "$2a$10$9htwniPhjwFcp0azcQYNHOQtHcoJuL8V9jE1jJ7NfnR/y8OezFiei",
    "id": "ac-6",
    "\_\_v": 0
    }
    }

---

12. -Functionality: Deleting a staff (Only an HR user can do this)
    -Route: /staff/deleteStaff
    -Request type: DELETE
    -Request body:{
    "staffId":"5fdd42109f077044445e251c"
    }Note: The staffId is required.
    -Response: Status code "Success"
    Example:{statusCode:"000"}

---

13. -Functionality: Logging in to the system (Anyone can do this)
    -Route: /staff/logIn
    -Request type: PUT
    -Request body:{
    "email": "mostafahatem301@gmail.com",
    "password": "123456"
    }Note: The email and password are required.
    -Response: Status code "Success" and the token
    Example:{
    "statusCode": "000",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZGQwZmNlNDZmNWExNDNjNGUwNzU1NSIsIm5hbWUiOiJNb3N0YWZhIiwiZW1haWwiOiJtb3N0YWZhaGF0ZW0zMDFAZ21haWwuY29tIiwidHlwZSI6Imluc3RydWN0b3IiLCJpYXQiOjE2MDgzMzU4MTV9.bJE5s8iGKkkuqFsLh02xrG-qsmk_vGzAgsZ3pfS5ShM"
    }

---

14. -Functionality: Logging out of the system (Anyone can do this)
    -Route: /staff/logOut
    -Request type: PUT
    -Request body:No request is needed.
    -Response: A message
    Example:"logged out successfully"

---

15. -Functionality: Reset any user's password (Only HR can do this), this changes the password back to the default password "123456"
    -Route: /staff/resetPasswordHR
    -Request type: PUT
    -Request body:{
    "staffId":"5fdd0fce46f5a143c4e07555"
    }Note: The staffId is required.
    -Response: Status code "Success"
    Example:{
    "statusCode": "000"
    }

---

16. -Functionality: Reset my own password(Anyone can do this to his own password)
    -Route: /staff/resetPassword
    -Request type: PUT
    -Request body:{
    "oldPassword": "123456",
    "newPassword": "123456789"
    }Note: Old password and new password are both required.
    -Response: Status code "Success"
    Example:{
    "statusCode": "000"
    }

---

17. -Functionality: View my profile (Anyone can see his own profile)
    -Route: /staff/viewMyProfile
    -Request type: GET
    -Request body:No request is need
    -Response: Status code "Success" and my profile
    Example:{
    "statusCode": "000",
    "profile": {
    "\_id": "5fdd0dc17c847d3510a7da82",
    "email": "mostafahatem300@gmail.com",
    "name": "Mostafa",
    "officeLocation": "5fdd0c2096b4832898d7d5a7",
    "salary": 3000,
    "type": "hr",
    "id": "hr-1",
    "\_\_v": 0,
    "totalHrs": 0.1870277777777778
    }
    }

---

18. -Functionality: View all profiles (Only HR can do this)
    -Route: /staff/viewAllProfiles
    -Request type: GET
    -Request body:No request is need
    -Response: Status code "Success" and an array of profiles, this example contains 2 profiles
    Example:{"statusCode": "000",
    "profiles": [
    {
    "_id": "5fe239081e79d98c58994ef2",
    "email": "omneya@gmail.com",
    "name": "Omneya",
    "salary": 3000,
    "type": "hod",
    "dayOff": "sunday",
    "totalHrs": 0,
    "missingDays": 0,
    "compensatedDays": 0,
    "accidentalBalance": 6,
    "leaveBalance": 0
    },
    {
    "_id": "5fe239921e79d98c58994ef3",
    "email": "yasmine@gmail.com",
    "name": "yasmine",
    "salary": 3000,
    "type": "instructor",
    "dayOff": "sunday",
    "totalHrs": 0,
    "missingDays": 0,
    "compensatedDays": 0,
    "accidentalBalance": 6,
    "leaveBalance": 0
    }
    ]
    }

---

19. -Functionality: View my missing days of this month (Anyone can see his own)
    -Route: /staff/viewMissingDays
    -Request type: GET
    -Request body:No request is need
    -Response: Status code "Success" and missing days of this month
    Example:{
    "statusCode": "000",
    "missingDays": 0
    }

---

20. -Functionality: View difference in working hours of this month either
    missing hours or extra hours (Anyone can see his own)
    -Route: /staff/viewDifferenceHours
    -Request type: GET
    -Request body:No request is need
    -Response: Status code "Success" and difference of hours
    Example:{
    "statusCode": "000",
    "hours": "Missing hours 167.81297222222221"
    }

---

21. -Functionality: Update profile of any staff member (Only HR can do this)
    -Route: /staff/updateProfile
    -Request type: PUT
    -Request body:{
    "\_id": "5fe239921e79d98c58994ef3",
    "gender:"male",
    "email":"yehia1@gmail.com",
    "dayOff":"wednesday",
    "name":"Yehia Tarek",
    "department":"5fe239921e79d98c58994ef3",
    } Note: only the id is required and send at least one attribute to be updated
    -Response: Status code "Success"
    Example:{
    "statusCode": "000"
    }

---

22. -Functionality: Update my profile (Anyone can do it for his profile)
    -Route: /staff/updateMyProfile
    -Request type: PUT
    -Request body:{
    "gender":"female",
    "email": "mostafa@gmail.com"
    } Note: gender and email can be sent both or one of them
    -Response: Status code "Success"
    Example:{
    "statusCode": "000"
    }

---

23. -Functionality: Update salary of any Staff Membber (Only HR can do this)
    -Route: /staff/updateSalary
    -Request type: PUT
    -Request body:{
    "salary":1500,
    "id":"5fdd2e7891d5f45f6cf84f22"
    } Note: both salary and id are required
    -Response: Status code "Success"
    Example:{
    "statusCode": "000"
    }

---

24. -Functionality: View all profiles of staff in my department (Only HOD or Course Instructor can do this)
    -Route: /staff/viewStaffPerDepartment
    -Request type: GET
    -Request body: No Request is needed
    -Response: Status code "Success" and Staff array of the profiles of the staff
    Here is an example of 1 staff profile
    Example:{
    "statusCode":"000",
    "staff":
    [
    {"_id":"5fe23a6b1e79d98c58994ef7",
    "email":"sewefy@gmail.com",
    "name":"Sewefy",
    "salary":3000,
    "type":"hod",
    "dayOff":"sunday",
    "totalHrs":0,
    "missingDays":0,
    "compensatedDays":0,
    "accidentalBalance":6,
    "leaveBalance":0},
    ]}

---

25. -Functionality: View days off of the all Staff of my department
    or a specific staff member (Only HOD can do this)
    -Route: /staff/viewDaysOff
    -Request type: GET
    -Request body:{
    "id":"5fdd0fce46f5a143c4e07555"
    }
    Note: id is not required. If it is sent, it will get the day Off of this specific Staff Member
    -Response: Status code "Success" and Array of Staffs with their days off or just one object if id is given
    Here is an example of 1 staff profile
    Example:{
    "statusCode": "000",
    "staff": {
    "id": "5fdd0fce46f5a143c4e07555",
    "staffName": "Mostafa",
    "dayOff": "Monday"
    }

---

26. -Functionality: View members with missing days or hours (Only HR can do this)
    -Route: /staff/viewMembersMissing
    -Request type: GET
    -Request body: no request is needed
    -Response: Status code "Success", Array of Staffs with missing hours and Array of Staffs with missing days
    Here is an example of 1 staff profile in each array
    Example:
    {
    "statusCode": "000",
    "staffWithMissingHours": [
    {
    "_id": "5fe23b1c1e79d98c58994efd",
    "email": "yehia1@gmail.com",
    "name": "Yehia Tarek",
    "officeLocation": "5fe22ddc3670180694e771ee",
    "salary": 50000,
    "type": "ta",
    "department": "5fe229893670180694e771ed",
    "dayOff": "wednesday",
    "password": "$2a$10$1oS9bXBbsLaLyio8Mxoelu5jPcHcYgcSRHJTOJ/0OvyXu6jaU5vIq",
    "passwordStatus": "changed",
    "id": "ac-13",
    "totalHrs": 0.07957944444444444,
    "missingDays": 0,
    "compensatedDays": 0,
    "accidentalBalance": 6,
    "leaveBalance": 0,
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZTIzYjFjMWU3OWQ5OGM1ODk5NGVmZCIsIm5hbWUiOiJZZWhpYSBUYXJlayIsImVtYWlsIjoieWVoaWExQGdtYWlsLmNvbSIsInR5cGUiOiJ0YSIsImRlcGFydG1lbnQiOiI1ZmUyMjk4OTM2NzAxODA2OTRlNzcxZWQiLCJpYXQiOjE2MDg4MTE1MjN9.S6Vg8c0FhSSWuW0-LjjtN1PYXB-0ueQ5iAbh-QTIFk0",
    "gender": "male"
    }
    ],
    "staffWithMissingDays": [
    {
    "_id": "5fe23b101e79d98c58994efc",
    "email": "jerry@gmail.com",
    "name": "jerry",
    "officeLocation": "5fe22ddc3670180694e771ee",
    "salary": 3000,
    "type": "ta",
    "department": "5fe229893670180694e771ed",
    "dayOff": "tuesday",
    "password": "$2a$10$qBpfQnW1bpA/weaIp27.e.aETkan.5ldHRp4j5rjAUCS4aCbxB7ya",
    "passwordStatus": "changed",
    "id": "ac-12",
    "totalHrs": 0,
    "missingDays": 5,
    "compensatedDays": 0,
    "accidentalBalance": 6,
    "leaveBalance": 0,
    "__v": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZTIzYjEwMWU3OWQ5OGM1ODk5NGVmYyIsIm5hbWUiOiJqZXJyeSIsImVtYWlsIjoiamVycnlAZ21haWwuY29tIiwidHlwZSI6InRhIiwiZGVwYXJ0bWVudCI6IjVmZTIyOTg5MzY3MDE4MDY5NGU3NzFlZCIsImlhdCI6MTYwODgwNzMzOX0.Qb4mJyBRlRxGG2lT0vTWoALjothdNqvhBzO-8XrJ1fE"
    }
    ]
    }

---

27.

---

--Course:

28. -Functionality: Add a course to the system (Only HR can do this)
    -Route: /course/addCourse
    -Request type: POST
    -Request body:{
    "course":{
    "departmentId":"5fe228e33670180694e771eb",
    "name":"photoshop",
    "courseCoordinatorId":"5fe239e31e79d98c58994ef5",
    "numberOfSlots":10
    }
    }Note: courseCoordinatorId is not required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

29. -Functionality: Update a course's info (Only HR can do this)
    -Route: /course/updateCourse
    -Request type: PUT
    -Request body:{
    "courseId":"5fe228e33670180694e771eb",
    "course":{
    "departmentId":"5fe239e31e79d98c58994ef5",
    "name":"CSEN704",
    "courseCoordinatorId":"5fe243e31e79d98c58994ef5",
    "numberOfSlots":5
    }
    }Note: courseId and course object are required, however course object can only contain one of the attributes listed
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

30. -Functionality: Delete a course (Only HR can do this)
    -Route: /course/deleteCourse
    -Request type: DELETE
    -Request body:{
    "courseId":"5fe243e31e79d98c58994ef5"
    }Note: courseId is required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

31.

---

--CourseStaff:

32. -Functionality: Assign a course on an instructor (Only HOD can do this)
    -Route: /courseStaff/assignInstructor
    -Request type: POST
    -Request body:{
    "courseId":"5fe243e31e79d98c58994ed6",
    "staffId":"5fe239e31e79d98c58994ef5"
    }Note: courseId and staffId are required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

33. -Functionality: Delete an instructor from a course (Only HOD can do this)
    -Route: /courseStaff/deleteInstructor
    -Request type: DELETE
    -Request body:{
    "courseId":"5fe243e31e79d98c58994ef5",
    "staffId":"5fe239e31e79d98c58994ef5"
    }Note: courseId and staffId are required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

34. -Functionality: Update the instructor assigned on a course (Only HOD can do this)
    -Route: /courseStaff/updateInstructor
    -Request type: PUT
    -Request body:{
    "staffId":"5fe243e31e79d98c58994ed4",
    "courseId":"5fe243e31e79d98c58994ef5",
    "newStaffId":"5fe243e31e79d98c58994es8",
    }Note: all 3 are required for the update to be done. staffId is the old id to be removed from the course and newStaffId is the new id to be added to the course
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

35. -Functionality: View staff in a course
    (HR can see anyone in any course, HOD and CI can see staff in courses that are
    under their department and Any Normal Academic member can only see staff in courses he/she is assigned to)
    -Route: /courseStaff/viewCourseStaff
    -Request type: GET
    -Request body:{
    "courseId":"5fe24dcacdcba15728c2bfa9"
    }Note: courseId is required
    -Response: Status code "Success" and Array of Staffs with their days off. Here is an example of 1 staff in the array
    Example:{
    "statusCode": "000",
    "staff": [
    {
    "_id": "5fe23acd1e79d98c58994ef8",
    "email": "slim@gmail.com",
    "name": "slim",
    "salary": 3000,
    "type": "instructor",
    "dayOff": "sunday",
    "totalHrs": 0,
    "missingDays": 0,
    "compensatedDays": 0,
    "accidentalBalance": 6,
    "leaveBalance": 0
    }
    ]
    }

---

36. -Functionality: Assign a staff to a course (Only CI can do this in his/her course)
    -Route: /courseStaff/assignStaff
    -Request type: POST
    -Request body:{
    "courseId":"5fe243e31e79d98c58994ed6",
    "staffId":"5fe239e31e79d98c58994ef5"
    }Note: courseId and staffId are required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

37. -Functionality: Delete a staff from a course (Only CI can do this in his/her course)
    -Route: /courseStaff/deleteStaff
    -Request type: DELETE
    -Request body:{
    "courseId":"5fe243e31e79d98c58994ef5",
    "staffId":"5fe239e31e79d98c58994ef5"
    }Note: courseId and staffId are required
    -Response: Status code "Success"
    Example:{ "statusCode":"000"}

---

--Attendance:

38. -Functionality: Sign In to the University upon arrival (Anyone can do this for himself)
    -Route: /attendence/signIn
    -Request type: POST
    -Request body: No request is needed
    -Response: Status code "Success" and the attendance record
    Example: {
    "statusCode": "000",
    "record": {
    "\_id": "5fde932783daed482c04bbbd",
    "staffId": "5fdd0dc17c847d3510a7da82",
    "signIn": "2020-12-20T01:56:23.562Z",
    "\_\_v": 0
    }
    }

---

39. -Functionality: Sign Out of the University when leaving (Anyone can do this for himself)
    -Route: /attendence/signOut
    -Request type: POST
    -Request body: No request is needed
    -Response: Status code "Success"
    Example:
    { "statusCode": "000" }

---

40. -Functionality: Manual Sign In for a Staff Member on any day(HR can do this for anyone but himself)
    -Route: /attendence/manualSignIn
    -Request type: POST
    -Request body: {
    "staffId":"5fdd0fce46f5a143c4e07555",
    "date": "2020-12-20",
    "time": "07:30",
    "attendenceId":"5fdf37d9172a695b807f3e4f"
    }
    Note: attendenceId is not required but the rest of the attributes are required
    -Response: Status code "Success"
    Example:
    { "statusCode": "000" }

---

41. -Functionality: Manual Sign Out for a Staff Member on any day(HR can do this for anyone but himself)
    -Route: /attendence/manualSignOut
    -Request type: POST
    -Request body: {
    "staffId":"5fdd0fce46f5a143c4e07555",
    "date": "2020-12-20",
    "time": "07:30",
    "attendenceId":"5fdf37d9172a695b807f3e4f"
    }
    Note: attendenceId is not required but the rest of the attributes are required
    -Response: Status code "Success"
    Example:
    { "statusCode": "000" }

---

42. -Functionality: View my attendance (Anyone can do this for himself)
    -Route: /attendence/viewAttendance
    -Request type: GET
    -Request body: No request is needed
    -Response: Status code "Success" and an arrayy with all the attendance records of this person
    Here is an example with 2 attendance records
    Example:
    {
    "statusCode": "000",
    "returnData": [
    {
    "_id": "5fe392918209f9726081380f",
    "signIn": "2020-12-23T18:55:13.514Z",
    "signOut": "2020-12-23T19:00:00.000Z"
    },
    {
    "_id": "5fe39a020fab628eacc0f6d9",
    "signOut": "2020-12-23T19:26:57.648Z",
    "signIn": "2020-12-23T19:00:00.000Z"
    }
    ]
    }

---

43. -Functionality: View all attendance of all Staff Members
    or a specific staff member (Only HR can do this)
    -Route: /attendence/viewAllAttendance
    -Request type: GET
    -Request body: {
    "staffId":"5fe23b1c1e79d98c58994efb"
    }
    Note: id is not required. If it is sent, it will get the attendance records of this specific Staff Member only
    -Response: Status code "Success" and an arrayy with all the attendance records
    Here is an example with 2 attendance records
    Example:
    {
    "statusCode": "000",
    "returnData": [
    {
    "_id": "5fe393068209f97260813811",
    "staffId": "5fe23b1c1e79d98c58994efd",
    "signOut": "2020-12-23T18:57:09.830Z",
    "__v": 0,
    "signIn": "2020-12-23T17:00:00.000Z"
    },
    {
    "_id": "5fe39a020fab628eacc0f6d9",
    "staffId": "5fe23b1c1e79d98c58994efd",
    "signOut": "2020-12-23T19:26:57.648Z",
    "__v": 0,
    "signIn": "2020-12-23T19:00:00.000Z"
    }
    ]
    }

---

--Slot:

44. -Functionality: Add a new Slot to the course (Only Course Coordinator can do this)
    -Route: /slot/addSlot
    -Request type: POST
    -Request body: {
    "type": "lab",
    "staffId": "5fdd2e9191d5f45f6cf84f24",
    "courseId": "5fdf21ccc9ba1d372b75a447",
    "time": 1,
    "locationId": "5fdd0c2096b4832898d7d5a7",
    "day": "sunday"
    } Note: all the attributes are required except staffId is optional
    -Response: Status code "Success" and the slot record
    Example: {
    "statusCode": "000",
    "message": "Slot created successfully",
    "slotCreated": {
    "\_id": "5fe452185199e98e8886452c",
    "type": "lab",
    "staffId": "5fe23b101e79d98c58994efc",
    "courseId": "5fe24de9cdcba15728c2bfaa",
    "time": 5,
    "locationId": "5fe22e273670180694e771f1",
    "day": "sunday",
    "\_\_v": 0
    }
    }

---

45. -Functionality: Delete a Slot from the course (Only Course Coordinator can do this)
    -Route: /slot/deleteSlot
    -Request type: DELETE
    -Request body: {
    "id":"5fdf69f5468bdb2f8c00e515"
    } Note: id is required
    -Response: Status code "Success" and message
    Example: {
    "statusCode":"000",
    "message":"Slot deleted successfully"
    }

---

46. -Functionality: Update a Slot from the course (Only Course Coordinator can do this)
    -Route: /slot/updateSlot
    -Request type: PUT
    -Request body: {
    "id":"5fdf69f5468bdb2f8c00e515",
    "courseId":"5fdf21ccc9ba1d372b75a447",
    "time": 4,
    "type": "lab,
    "locationId": "5fdf21ccc9ba1d372b75a447",
    "day": "sunday"
    } Note: only id is required and send at least one field to be updated
    -Response: Status code "Success" and message
    Example: {
    "statusCode":"000",
    "message":"Slot deleted successfully"
    }

---

47. -Functionality: Assign Staff to a certain Slot (Only Course Instructor can do this)
    -Route: /slot/assignStaff
    -Request type: POST
    -Request body: {
    "slotId": "5fdd4c11936f566df24e2097",
    "staffId": "5fdd2e6191d5f45f6cf84f21",
    "courdId": "5fdeb83c7522de5af05b2567"
    } Note: all fields are required
    -Response: Status code "Success" and message
    Example: {
    "statusCode": "000",
    "message":" Staff member assigned successfully"
    }

---

48. -Functionality: Delete Staff from a certain Slot (Only Course Instructor can do this)
    -Route: /slot/deleteStaff
    -Request type: DELETE
    -Request body: {
    "slotId": "5fdd4c11936f566df24e2097"
    } Note: slotId is required
    -Response: Status code "Success" and message
    Example: {
    "statusCode": "000",
    "message": "Staff member deleted successfully"
    }

---

49. -Functionality: Update a Staff Member from a certain Slot (Only Course Instructor can do this)
    -Route: /slot/updateStaff
    -Request type: PUT
    -Request body: {
    "slotId": "5fdd4c11936f566df24e2097",
    "staffId": "5fdd2e6191d5f45f6cf84f21"
    } Note: both slotId and staffId are required
    -Response: Status code "Success" and message
    Example: {
    "statusCode":"000",
    "message":"Staff member updated successfully"
    }

---

50. -Functionality: View all Slot Assignments in my department (Only HOD can do this)
    -Route: /slot/viewTeachingAssignmentHOD
    -Request type: GET
    -Request body: No request is needed
    -Response: Status code "Success" and array of the assignments
    Here is an example of 2 assignments
    Example:
    {
    "statusCode":"000",
    "returnData":[
    {"staffName":"Farida",
    "locationName":"C7-102",
    "courseName":"IET1",
    "type":"tutorial",
    "time":2,
    "day":"monday"
    },
    {
    "staffName":"Farida",
    "locationName":"C7-102",
    "courseName":"IET1",
    "type":"lab",
    "time":2,
    "day":"monday"
    }]}

---

51. -Functionality: View all Slot Assignments in my courses (Only Course Instructor can do this)
    -Route: /slot/viewTeachingAssignmentCI
    -Request type: GET
    -Request body: No request is needed
    -Response: Status code "Success" and array of the assignments
    Here is an example of 2 assignments
    Example:
    {
    "statusCode":"000",
    "returnData":[
    {"staffName":"Farida",
    "locationName":"C7-102",
    "courseName":"IET1",
    "type":"tutorial",
    "time":2,
    "day":"monday"
    },
    {
    "staffName":"Farida",
    "locationName":"C7-102",
    "courseName":"IET1",
    "type":"lab",
    "time":2,
    "day":"monday"
    }]}

---

52. -Functionality: View my schedule (Anyone can view his own)
    -Route: /slot/viewSchedule
    -Request type: GET
    -Request body: No request is needed
    -Response: Status code "Success" and array of the assignments of regular slots
    or accepted replacement requests of this week
    Here is an example of 2 assignments, one is a slot, one is replacement requests
    Example:
    {"statusCode":"000",
    "slots":[{
    "locationName":"C7-102",
    "courseName":"IET1",
    "type":"tutorial",
    "time":3,
    "day":"wednesday"},
    "ReplacementRequests":
    [{"senderId":"ac-5",
    "slotId":"5fdd4c11936f566df24e2097",
    "targetDate":"2020-12-17T22:00:00.000Z",
    "dateSent":"2020-12-20T00:34:17.422Z",
    "status":"accepted"}]}

---

--Schedule Requests:

53. -Functionality: Send Linking Request (Only TA or Instructor can do this)
    -Route: /schedule/sendLinkingRequest
    -Request type: POST
    -Request body: {
    "slotId": "5fdeb83c7522de5af05b2567"
    } Note: slotId is required
    -Response: Status code "Success" and the record created
    Example:
    {
    "statusCode": "000",
    "request": {
    "\_id": "5fded461e164999692caf576",
    "slotId": "5fdeb83c7522de5af05b2567",
    "staffId": "5fdd2e8691d5f45f6cf84f23",
    "status": "pending",
    "type": "linking",
    "\_\_v": 0
    }
    }

---

54. -Functionality: Accept Linking Request (Only Course Coordinator can do this)
    -Route: /schedule/acceptLinkingRequest
    -Request type: PUT
    -Request body: {
    "id": "5fdeb9617522de5af05b2568"
    }Note: id is required
    -Response: Status code "Success"
    Example:
    {
    "statusCode": "000"
    }

---

55. -Functionality: Reject Linking Request (Only Course Coordinator can do this)
    -Route: /schedule/rejectLinkingRequest
    -Request type: PUT
    -Request body: {
    "id": "5fdeb9617522de5af05b2568"
    }Note: id is required
    -Response: Status code "Success"
    Example:
    {
    "statusCode": "000"
    }

---

56. -Functionality: View Linking Request of his courses (Only Course Coordinator can do this)
    -Route: /schedule/viewCourseLinkingRequest
    -Request type: GET
    -Request body: {}
    -Response: Status code "Success" and array of Requets
    Here is an example with one Request
    Example:
    {
    "statusCode": "000",
    "scheduleRequests": [
    {
    "_id": "5fdeb9617522de5af05b2568",
    "staffId": "5fdd2e6191d5f45f6cf84f21",
    "slotId": "5fdeb83c7522de5af05b2567",
    "type": "linking",
    "status": "pending"
    }
    ]
    }

---

57. -Functionality: Send a request to change the day off (Any Academic Member can do this)
    -Route: /schedule/requestChangeDayOff
    -Request type: POST
    -Request body: {
    "dayOff": "sunday"
    }Note: dayOff is required
    -Response: Status code "Success" and record created
    Example:
    {
    "statusCode": "000",
    "scheduleRequest": {
    "\_id": "5fe453d25b1ec79c3fa46faf",
    "dayOff": "tuesday",
    "staffId": "5fe23b101e79d98c58994efc",
    "status": "pending",
    "type": "changeDay",
    "\_\_v": 0
    }
    }
58. -Functionality: Accept a change day request of my department (Only HOD can do this)
    -Route: /schedule/acceptChangeDayOff
    -Request type: PUT
    -Request body: {
    "id": "5fdf3d0680cb7fa1e0a85726"
    }Note: id is required
    -Response: Status code "Success"
    Example:
    {
    "statusCode"": "000"
    }

---

59. -Functionality: Reject a change day request of my department (Only HOD can do this)
    -Route: /schedule/rejectChangeDayOff
    -Request type: PUT
    -Request body: {
    "id": "5fdf3d0680cb7fa1e0a85726"
    }Note: id is required
    -Response: Status code "Success"
    Example:
    {
    "statusCode"": "000"
    }

---

60. -Functionality: Cancel a change day request or a linking
    request (Only Owner of the request can do this)
    -Route: /schedule/cancelRequest
    -Request type: PUT
    -Request body: {
    "id": "5fdf3d0680cb7fa1e0a85726"
    }Note: id is required
    -Response: Status code "Success"
    Example:
    {
    "statusCode"": "000"
    }

---

61. -Functionality: View Change day off requests of his department (Only HOD can do this)
    -Route: /schedule/viewChangeDayOff
    -Request type: GET
    -Request body: {}
    -Response: Status code "Success"
    Example:
    {
    "statusCode": "000",
    "scheduleRequest":
    [{
    "_id": "5fdf3d0680cb7fa1e0a85726",
    "dayOff": "sunday",
    "staffId": "5fdd2e8691d5f45f6cf84f23",
    "status": "pending",
    "type": "changeDay",
    "__v": 0
    }]
    }

---

--Leave Requests:

62. -Functionality: View all the requests I sent (Any Academic Member can view his requests)
    -Route: /leave/viewAllMyRequests
    -Request type: POST
    -Request body: {
    "type": "leave"
    }Note: if the request is empty, the route will show all the requests (leave, schedule, replacement). You can specify the type
    between leave, schedule and replacement as a filter.
    -Response: if request is as above, Status code "Success" and an array of leave requests Here is an example with one Request
    if request is empty there will be Status code "Success" and an array of 3 arrays (leave,schedule and replacement)
    Example:
    {
    "statusCode": "000",
    "returnData": [
    {
    "type": {
    "enum": []
    },
    "replacementRequestId": [],
    "\_id": "5fde5989e2520ebd2b44623f",
    "senderId": "5fdd2e7891d5f45f6cf84f22"
    }
    ]
    }

---

63. -Functionality: View all requests in a department (Any HOD can see the requests in his department)
    -Route: /leave/viewAllRequests
    -Request type: POST
    -Request body: {
    "type": "leave"
    }Note: if the request is empty, the route will show all the requests (leave, schedule, replacement). You can specify the type
    between leave, schedule and replacement as a filter.
    -Response: if request is as above, Status code "Success" and an array of leave requests Here is an example with one Request
    if request is empty there will be Status code "Success" and an array of 3 arrays (leave,schedule and replacement)
    Example:
    {
    "statusCode": "000",
    "returnData": [
    {
    "type": {
    "enum": []
    },
    "replacementRequestId": [],
    "\_id": "5fde5989e2520ebd2b44623f",
    "senderId": "5fdd2e7891d5f45f6cf84f22"
    }
    ]
    }

---

64. -Functionality: Accept a leave request (Any HOD can accept leave requests sent to him)
    -Route: /leave/acceptRequest
    -Request type: PUT
    -Request body: {
    "leaveId":"5fde5f71e2520ebd2b446240"
    }Note: leaveId is required
    -Response statusCode: success
    Example:
    {
    "statusCode": "000",
    }

---

65. -Functionality: Reject a leave request (Any HOD can accept leave requests sent to him)
    -Route: /leave/rejectRequest
    -Request type: PUT
    -Request body: {
    "leaveId":"5fde5989e2520ebd2b44623f",
    "message":"3ashan elly enta 3amlo dah 3'alat"
    } Note: message is not required
    -Response statusCode: success
    Example:
    {
    "statusCode": "000",
    }

---

66. -Functionality: Send a leave request (Any Academic member can do this)
    -Route: /leave/sendLeaveRequest
    -Request type: PUT
    -Request body: {
    "replacementRequestId":["5fde5989e2520ebd2b44623f"],
    "targetStartDate":"2020-12-28",
    "targetEndDate":"2020-12-29",
    "type":"sick",
    "documentUrl":"https://www.facebook.com",
    "reason":"because"
    }Note: targetStartDate, targetEndDate, type are required. documentUrl is only required if type is "sick" or "maternity"
    -Response statusCode: success and the request created
    Example:
    {
    "statusCode": "000",
    "request": {
    "type": "sick",
    "replacementRequestId": [],
    "\_id": "5fde9170e95d7fa36b27a3a4",
    "targetStartDate": "2020-12-28T00:00:00.000Z",
    "targetEndDate": "2020-12-29T00:00:00.000Z",
    "documentUrl": "https://www.facebook.com",
    "senderId": "5fdd2e8691d5f45f6cf84f23",
    "receiverId": "5fdd0fce46f5a143c4e07555",
    "status": "pending",
    "dateSent": "2020-12-19T23:49:04.266Z",
    "\_\_v": 0
    }
    }

---

67. -Functionality: Cancel a leave request (Any Academic member can cancel a leave request he sent)
    -Route: /leave/rejectRequest
    -Request type: PUT
    -Request body: {
    "leaveId":"5fde5989e2520ebd2b44623f"
    } Note: leaveId is required
    -Response statusCode: success
    Example:
    {
    "statusCode": "000",
    }

---

--Replacement:

68. -Functionality: Create a replacement request (Only TAs and Instructors can do this)
    -Route: /replacement/createReplacementRequest
    -Request type: POST
    -Request body: {
    "targetDate": "2020-12-27",
    "receiverId": "5fe23b1c1e79d98c58994efd",
    "slotId": "5fe4548a36a9c67398f90262"
    }Note: everything is required
    -Response statusCode: success and the request created
    Example:
    {
    "statusCode": "000",
    "request": {
    "\_id": "5fe478b8ca43323a0c25d152",
    "targetDate": "2020-12-27T00:00:00.000Z",
    "receiverId": "5fe23b1c1e79d98c58994efd",
    "slotId": "5fe4548a36a9c67398f90262",
    "senderId": "5fe23b101e79d98c58994efc",
    "dateSent": "2020-12-24T11:17:11.784Z",
    "status": "pending",
    "\_\_v": 0
    }
    }

---

69. -Functionality: View replacement requests (Only TAs and Instructors can do this)
    -Route: /replacement/viewReplacementRequest
    -Request type: GET
    -Request body: no request is needed
    -Response statusCode: success and all the requests I sent or received
    Example:
    {
    "statusCode": "000",
    "request": [
    {
    "_id": "5fe475005235e4804cf62080",
    "targetDate": "2020-12-27T00:00:00.000Z",
    "receiverId": "5fe23b1c1e79d98c58994efd",
    "slotId": "5fe4548a36a9c67398f90262",
    "senderId": "5fe23b101e79d98c58994efc",
    "dateSent": "2020-12-24T11:01:19.904Z",
    "status": "pending",
    "__v": 0
    },
    {
    "_id": "5fe478b8ca43323a0c25d152",
    "targetDate": "2020-12-27T00:00:00.000Z",
    "receiverId": "5fe23b1c1e79d98c58994efd",
    "slotId": "5fe4548a36a9c67398f90262",
    "senderId": "5fe23b101e79d98c58994efc",
    "dateSent": "2020-12-24T11:17:11.784Z",
    "status": "pending",
    "__v": 0
    }
    ]
    }

---

70. -Functionality: Cancel a replacement request I sent (Only TAs and Instructors can do this)
    -Route: /replacement/cancelReplacementRequest
    -Request type: PUT
    -Request body: {
    "id":"5fe4855ad9ca3f8214be2bca"
    }Note: id is required
    -Response statusCode: success
    Example:{
    "statusCode": "000"
    }

---

71. -Functionality: Accept a replacement request sent to me (Only TAs and Instructors can do this)
    -Route: /replacement/acceptReplacementRequest
    -Request type: PUT
    -Request body: {
    "id":"5fe4855ad9ca3f8214be2bca"
    }Note: id is required
    -Response statusCode: success
    Example:{
    "statusCode": "000"
    }

---

72. -Functionality: Reject a replacement request sent to me (Only TAs and Instructors can do this)
    -Route: /replacement/rejectReplacementRequest
    -Request type: PUT
    -Request body: {
    "id":"5fe4855ad9ca3f8214be2bca"
    }Note: id is required
    -Response statusCode: success
    Example:{
    "statusCode": "000"
    }

---

--- Notifications:

73. -Functionality: View all my notifications (Anyone can see his own)
    -Route: /notification/viewNotifications
    -Request type: GET
    -Request body: No request is needed
    -Response statusCode: success and array of notifications
    Here is an example of one notificatio object
    Example:
    {
    "statusCode": "000",
    "notifications": [
    {
    "_id": "5fe47833bbe478659cd19e41",
    "type": "leave",
    "description": "One of your leave requests has been rejected",
    "seen": false,
    "staffId": "5fe23af11e79d98c58994efa",
    "redId": "5fe465f85eba1265bcaf648e",
    "__v": 0
    }
    ]
    }

---

74. -Functionality: remove a certain notifications (Anyone can see his own)
    -Route: /notification/removeNotification
    -Request type: DELETE
    -Request body: {
    "notificationId": "5fe47833bbe478659cd19e41"
    } Note: notificationId is required
    -Response statusCode: success
    Example:
    {
    "statusCode": "000",
    }

---

75. -Functionality: remove a certain notifications (Anyone can see his own)
    -Route: /notification/setNotificationSeen
    -Request type: PUT
    -Request body: {
    "notificationId": "5fe47833bbe478659cd19e41"
    } Note: notificationId is required
    -Response statusCode: success
    Example:
    {
    "statusCode": "000",
    }

---

--Salary:

76. -Functionality: view all salaries in the system (Only HR can do this)
    -Route: /salary/viewAllSalaries
    -Request type: GET
    -Request body: {
    "month":12,
    "year": 2020
    } Note: both are required
    -Response statusCode: success and an array of salary instances, here is an example of 2 salaries
    Example:{
    "statusCode": "000",
    "salaries": [
    {
    "_id": "5fe60ea3ccf44491ccba29cd",
    "staffId": "5fe2439d59130f6b5cdccbe0",
    "month": 12,
    "salary": 200,
    "year": 2020,
    "__v": 0
    },
    {
    "_id": "5fe60ea3ccf44491ccba29ce",
    "staffId": "5fe24421ab7cb7271ce28a90",
    "month": 12,
    "salary": 200,
    "year": 2020,
    "__v": 0
    }
    ]
    }

---

77. -Functionality: view my salary (Anyone can do this)
    -Route: /salary/viewSalary
    -Request type: GET
    -Request body: {
    "month":12,
    "year": 2020
    } Note: both are required
    -Response statusCode: success and my salary of the month I requested
    Example:{
    "statusCode": "000",
    "salary": {
    "\_id": "5fe60a28fd85506e08db0815",
    "staffId": "5fe224656a8fe3708487ef13",
    "month": 12,
    "salary": 333.3875694444441,
    "year": 2020,
    "\_\_v": 0
    }
    }
