const logins = require('../controller/authController');
const auth = require('../middleware/auth');
const student = require('../controller/studentController');
const express = require('express');
const router = express.Router();

router.post('/login', logins.studentLogin);
router.get('/profile',auth.authenticate,student.getStudentProfile);
router.put('/change-password', auth.authenticate, student.changeStudentPassword);



module.exports = router;