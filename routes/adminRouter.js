const admin = require('../controller/adminController');
const logins = require('../controller/authController');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();


router.post('/create-admin', admin.createAdmin);
router.post('/login', logins.adminLogin);
router.get('/profile', auth.authenticate, admin.getAdminDetails);
router.get('/all-admins', auth.authenticate, admin.getAllAdmins);
router.get('/all-students', auth.authenticate, admin.getAllStudents);
router.get('/all-faculty', auth.authenticate, admin.getAllFaculty);
router.put('/change-password', auth.authenticate, admin.changeAdminPassword);
router.post('/create-faculty',auth.authenticate, admin.createFaculty);
router.post('/create-student',auth.authenticate, admin.createStudent);


module.exports = router;