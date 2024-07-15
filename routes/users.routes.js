const express = require('express')

const router = express.Router();

const multer = require('multer')
// const upload = multer({ dest: 'uploads/' })
const diskStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log("FILE", file);
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user~${Date.now()}.${ext}`
        cb(null, fileName)
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0]
    if (imageType === 'image') {
      return cb(null, true)
    } else {
      return cb(appError.create('file must be an image', 400 ),false)
    }
}
const upload = multer({storage: diskStorage, fileFilter })

const usersControllers = require('../controllers/users.controllers')
const verifyToken = require('../middlewares/verifiyToken');
const { statusText } = require('../utilts/appError');
// get all users
// register
// login


router.route('/')
    .get(verifyToken, usersControllers.getAllUsers)

router.route('/register')
    .post(upload.single('avatar'), usersControllers.register)

router.route('/login')
    .post(usersControllers.login)

module.exports = router;
