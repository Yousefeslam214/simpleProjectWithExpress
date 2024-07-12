const { body, validationResult } = require('express-validator')
let Course = require('../models/course.modes')

const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses)
}
const getCourse = async (req, res) => {
  // console.log(req.params); // courseId
  try {

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: "course not found" })
    }
    res.json(course);
  } catch (err) {
    return res.status(400).json({ msg: "invalid Object ID" })
  }

}

const addCourse = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  }
  const newCourse = new Course(req.body)
  await newCourse.save();
  res.status(201).json(newCourse)
}

const UpdateCourse = async (req, res) => {
  const courseId = req.params.courseId
  try {

    const UpdateCourse = await Course.updateOne({_id: courseId}, {$set: {...req.body}});
    // const UpdateCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } })
    return res.status(200).json(UpdateCourse)

  } catch (e) {
    return res.status(400).json({ error: e })
  }


}

const deleteCourse = async (req, res) => {
const data = await Course.deleteOne({_id: req.params.courseId})

  res.status(200).json({ success: true , msg: data})
}


module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  UpdateCourse,
  deleteCourse
}