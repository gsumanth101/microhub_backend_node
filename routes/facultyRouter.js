const logins = require('../controller/authController');
const auth = require('../middleware/auth');
const faculty = require('../controller/facultyController');
const express = require('express');
const router = express.Router();

router.post('/login', logins.facultyLogin);
router.get('/profile',auth.authenticate, faculty.getFacultyProfile );
router.put('/change-password', auth.authenticate, faculty.changeFacultyPassword);

module.exports = router;