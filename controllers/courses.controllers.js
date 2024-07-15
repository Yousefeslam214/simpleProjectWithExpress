const { body, validationResult } = require('express-validator')
let Course = require('../models/course.modes')
const httpStatusText = require('../utilts/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utilts/appError')


const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;

  console.log(query)
  let limit = query.limit || 10;
  let page = query.page || 1;
  const skip = (page - 1) * limit;
  // i want __v don't show
  const courses = await Course.find({}, { "__v": false }).limit(limit).skip(skip);
  res.json({ status: httpStatusText.SUCCESS, data: { courses } })
})
const getCourse = asyncWrapper(
  async (req, res, next) => {
    // console.log(req.params); // courseId

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      const error = appError.create('course not found', 404, httpStatusText.FAIL)
      return next(error)
    }
    return res.json({ status: httpStatusText.SUCCESS, data: { course } });

  }
)

const addCourse = asyncWrapper(

  async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = appError.create(errors.array(), 400, httpStatusText.FAIL)
      return next(error)
      // return res.status(400).json({ status: httpStatusText.FAIL, data: errors.array() })
    }
    const newCourse = new Course(req.body)
    await newCourse.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } })
  }

)

const UpdateCourse = asyncWrapper(
  async (req, res) => {
    const courseId = req.params.courseId

    const UpdateCourse = await Course.updateOne({ _id: courseId }, { $set: { ...req.body } });
    // const UpdateCourse = await Course.findByIdAndUpdate(courseId, { $set: { ...req.body } })
    return res.status(200).json({ status: httpStatusText.SUCCESS, data: { course: UpdateCourse } })

    // try {
    // } catch (e) {
    //   return res.status(400).json({ status: httpStatusText.ERROR, message: e.message })
    // }


  })

const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId })

  res.status(200).json({ status: httpStatusText.SUCCESS, data: null })
})


module.exports = {
  getAllCourses,
  getCourse,
  addCourse,
  UpdateCourse,
  deleteCourse
}