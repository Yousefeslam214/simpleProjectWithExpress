const { body, validationResult } = require('express-validator')
let Course = require('../models/course.modes')
const httpStatusText = require('../utilts/httpStatusTest')

const getAllCourses = async (req, res) => {
  // i want __v don't show
  const courses = await Course.find({}, {"__v": false});
  res.json({ status: httpStatusText.SUCCESS, data: { courses } })
}
const getCourse = async (req, res) => {
  // console.log(req.params); // courseId
  try {

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ status: httpStatusText.FAIL, data: { course: null } })
    }
    return res.json({ status: httpStatusText.SUCCESS, data: { course } });
  } catch (err) {
    return res.status(400).json({ status: httpStatusText.ERROR, data: null, message: "invalid Object ID", code: 400 })

  }

}

const addCourse = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: httpStatusText.FAIL, data: errors.array() })
  }
  const newCourse = new Course(req.body)
  await newCourse.save();
  res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } })
}

const UpdateCourse = async (req, res) => {
  const courseId = req.params.courseId
  try {

    const UpdateCourse = await Course.updateOne({ _id: courseId }, { $set: { ...req.body } });
    // const UpdateCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } })
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course: UpdateCourse } })

  } catch (e) {
    return res.status(400).json({ status: httpStatusText.ERROR, message: e.message})
  }


}

const deleteCourse = async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId })

  res.status(200).json({ status: httpStatusText.SUCCESS, data: null })
}


module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  UpdateCourse,
  deleteCourse
}