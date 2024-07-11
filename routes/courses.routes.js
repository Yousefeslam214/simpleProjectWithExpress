const express = require('express')
const { body } = require('express-validator')
const coursesControllers = require('../controllers/courses.controllers');
const validationSchema = require('../middlewares/validationSchema'); // Update import

const router = express.Router();


// // get all courses
// // Route -> Resource
// router.get('/', coursesControllers.getAllCourses)

// // get single course
// router.get('/:courseId', coursesControllers.getCourse)

// // create or add new course
// router.post('/courses', body('title').notEmpty().withMessage("title is require").isLength({ min: 2 }), coursesControllers.addCourse)

// // Update a course
// router.patch('/:courseId', coursesControllers.UpdateCourse)

// // delete course
// router.delete('/:courseId', coursesControllers.deleteCourse)

// get all courses
// Route -> Resource
router.route('/')
    .get(coursesControllers.getAllCourses)
    .post(validationSchema(), coursesControllers.addCourse)
// get single course

// create or add new course

// Update a course
router.route('/:courseId')
        .get( coursesControllers.getCourse)
        .patch( coursesControllers.UpdateCourse)
        .delete( coursesControllers.deleteCourse)

// delete course

module.exports = router;
