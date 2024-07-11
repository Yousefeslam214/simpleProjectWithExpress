let { courses } = require("../data/courses")
const { body, validationResult } = require('express-validator')

const getAllCourses = (req, res) => {
    res.json(courses)
}
const getCourse = (req, res) => {
    // console.log(req.params); // courseId
    const courseId = +req.params.courseId
    const course = courses.find((course) => course.id === courseId);
    if (!course) {
        return res.status(404).json({ msg: "course not found" })
    }
    res.json(course);
}

const addCourse = (req, res) => {
    console.log(req.body)
    const errors = validationResult(req)
    if (!errors.isEmpty())
    {
        return res.status(400).json(errors.array())
    }
    // if (!req.body.title) {
    //     return res.status(400).json({ error: 'title not provided' })
    // }
    // if (!req.body.price) {
    //     return res.status(400).json({ error: 'price not provided' })
    // }
    courses.push({ id: courses.length + 1, ...req.body })
    res.status(201).json(courses)
}
const UpdateCourse = (req, res) => {
    const courseId = +req.params.courseId;
    let course = courses.find((course) => course.id === courseId);

    if (!course) {
        return res.status(404).json({ msg: "course not found" })

    }
    course = { ...course, ...req.body }
    res.status(200).json(course)
}

const deleteCourse = (req, res) => {
    const courseId = +req.params.courseId;
    courses = courses.filter((course) => course.id !== courseId)
    res.status(200).json({ success: true })
}


module.exports = {
    getAllCourses,
    getCourse,
    addCourse,
    UpdateCourse,
    deleteCourse
}