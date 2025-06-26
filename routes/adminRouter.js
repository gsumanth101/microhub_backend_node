const admin = require('../controller/adminController');
const logins = require('../controller/authController');
const auth = require('../middleware/auth');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// Configure multer for file uploads (memory storage - files are not saved to disk)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.xlsx', '.xls'];
        const fileExtension = '.' + file.originalname.split('.').pop().toLowerCase();
        
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files (.xlsx, .xls) are allowed'), false);
        }
    }
});


router.post('/create-admin', admin.createAdmin);
router.post('/login', logins.adminLogin);
router.get('/profile', auth.authenticate, admin.getAdminDetails);
router.get('/all-admins', auth.authenticate, admin.getAllAdmins);
router.get('/all-students', auth.authenticate, admin.getAllStudents);
router.get('/all-faculty', auth.authenticate, admin.getAllFaculty);
router.put('/change-password', auth.authenticate, admin.changeAdminPassword);
router.post('/create-faculty',auth.authenticate, admin.createFaculty);
router.post('/create-student',auth.authenticate, admin.createStudent);

router.put('/update-faculty/:id', auth.authenticate, admin.updateFacultyDetails);
router.put('/update-student/:id', auth.authenticate, admin.updateStudentDetails);
router.put('/update-admin/:id', auth.authenticate, admin.updateAdminDetails);

router.post('/upload-student', auth.authenticate, upload.single('file'), admin.uploadStudentData);
router.post('/upload-faculty', auth.authenticate, upload.single('file'), admin.uploadFacultyData);


module.exports = router;