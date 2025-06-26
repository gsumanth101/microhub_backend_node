const Admin = require('../models/admin.model');
const Faculty = require('../models/faculty.model');
const Student = require('../models/student.model');
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');
const multer = require('multer');
const { Op } = require('sequelize'); 


/* 
 * Author: Sumanth
 * Date: 2024-06-24
 * Description: Controller for handling admin-related operations
 * Version: 1.0.0
*/

// Create a new admin
const createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Admin created successfully',
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                email: newAdmin.email
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Create Faculty

const createFaculty = async (req, res) => {
    try {
        const { username, name, email, section, dept, coordinator, password } = req.body;
        const existingFaculty = await Faculty.findOne({ where: { username  } });
        if (existingFaculty) {
            return res.status(400).json({ message: 'Faculty already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newFaculty = await Faculty.create({
            username,
            name,
            email,
            section,
            dept,
            coordinator,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Faculty created successfully',
            faculty: {
                id: newFaculty.id,
                username: newFaculty.username,
                name: newFaculty.name,
                email: newFaculty.email,
                section: newFaculty.section,
                dept: newFaculty.dept,
                coordinator: newFaculty.coordinator
            }
        });
    } catch (error) {
        console.error('Error creating faculty:', error);
        res.status(500).json({ message: 'Internal server error' });
} 
}

//Create a new Student
const createStudent = async(req, res) =>{
    try{
        const { username, name, email, section, dept, password } = req.body;
        const existingStudent = await Student.findOne({ where: { username } });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newStudent = await Student.create({
            username,
            name,
            email,
            section,
            dept,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: newStudent.id,
                username: newStudent.username,
                name: newStudent.name,
                email: newStudent.email,
                section: newStudent.section,
                dept: newStudent.dept
            }
        });
    }catch(error) {
        console.error('Error creating student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//profile of logged-in admin
const getAdminDetails = async (req, res) => {
    try {
        // Use req.user injected by the common auth middleware
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }
        const adminId = req.user.id;
        const admin = await Admin.findByPk(adminId, {
            attributes: ['id', 'name', 'email']
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            message: 'Admin details fetched successfully',
            admin
        });

    } catch (error) {
        console.error('Error fetching admin details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//change password of admin
const changeAdminPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const adminId = req.user.id;
        const admin = await Admin.findByPk(adminId);

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, admin.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedNewPassword;
        await admin.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Error changing admin password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get All Admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.findAll({
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
        });

        if (admins.length === 0) {
            return res.status(404).json({ message: 'No admins found' });
        }

        res.status(200).json({
            message: 'Admins fetched successfully',
            admins
        });

    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get Students 
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept', 'createdAt', 'updatedAt', 'role']
        });

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found' });
        }

        res.status(200).json({
            message: 'Students fetched successfully',
            students
        });

    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Get Faculty
const getAllFaculty = async (req, res) => {
    try {
        const faculty = await Faculty.findAll({
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept', 'coordinator', 'createdAt', 'updatedAt', 'role']
        });

        if (faculty.length === 0) {
            return res.status(404).json({ message: 'No faculty found' });
        }

        res.status(200).json({
            message: 'Faculty fetched successfully',
            faculty
        });

    } catch (error) {
        console.error('Error fetching faculty:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//update admin details
const updateAdminDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const adminId = req.user.id;
        const { name, email } = req.body;

        const admin = await Admin.findByPk(adminId);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        admin.name = name || admin.name;
        admin.email = email || admin.email;

        await admin.save();

        res.status(200).json({
            message: 'Admin details updated successfully',
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (error) {
        console.error('Error updating admin details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update Faculty Details
const updateFacultyDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const facultyId = req.params.id;
        const { username, name, email, section, dept, coordinator } = req.body;

        const faculty = await Faculty.findByPk(facultyId);
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        faculty.username = username || faculty.username;
        faculty.name = name || faculty.name;
        faculty.email = email || faculty.email;
        faculty.section = section || faculty.section;
        faculty.dept = dept || faculty.dept;
        faculty.coordinator = coordinator || faculty.coordinator;

        await faculty.save();

        res.status(200).json({
            message: 'Faculty details updated successfully',
            faculty: {
                id: faculty.id,
                username: faculty.username,
                name: faculty.name,
                email: faculty.email,
                section: faculty.section,
                dept: faculty.dept,
                coordinator: faculty.coordinator
            }
        });

    } catch (error) {
        console.error('Error updating faculty details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Update Student Details
const updateStudentDetails = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const studentId = req.params.id;
        const { username, name, email, section, dept } = req.body;

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        student.username = username || student.username;
        student.name = name || student.name;
        student.email = email || student.email;
        student.section = section || student.section;
        student.dept = dept || student.dept;

        await student.save();

        res.status(200).json({
            message: 'Student details updated successfully',
            student: {
                id: student.id,
                username: student.username,
                name: student.name,
                email: student.email,
                section: student.section,
                dept: student.dept
            }
        });

    } catch (error) {
        console.error('Error updating student details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


// view Admin 
const viewAdmin = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const adminId = req.user.id;
        const admin = await Admin.findByPk(adminId, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
        });

        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        res.status(200).json({
            message: 'Admin profile retrieved successfully',
            admin
        });

    } catch (error) {
        console.error('Error retrieving admin profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// view Faculty
const viewFaculty = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const facultyId = req.params.id;
        const faculty = await Faculty.findByPk(facultyId, {
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept', 'coordinator', 'createdAt', 'updatedAt']
        });

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        res.status(200).json({
            message: 'Faculty profile retrieved successfully',
            faculty
        });

    } catch (error) {
        console.error('Error retrieving faculty profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// view Student
const viewStudent = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        const studentId = req.params.id;
        const student = await Student.findByPk(studentId, {
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept', 'createdAt', 'updatedAt']
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({
            message: 'Student profile retrieved successfully',
            student
        });

    } catch (error) {
        console.error('Error retrieving student profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Upload Student data from Excel
const uploadStudentData = async (req, res) => {
    try {

        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }


        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }


        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            return res.status(400).json({ message: 'Invalid file format. Please upload Excel file (.xlsx or .xls)' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or has no valid data' });
        }

        const results = {
            success: [],
            errors: [],
            total: data.length
        };

        // Process each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                const requiredFields = ['username', 'name', 'email', 'section', 'dept', 'password'];
                const missingFields = requiredFields.filter(field => !row[field]);

                if (missingFields.length > 0) {
                    results.errors.push({
                        row: i + 2, 
                        error: `Missing required fields: ${missingFields.join(', ')}`,
                        data: row
                    });
                    continue;
                }


                const existingStudent = await Student.findOne({ 
                    where: { 
                        [Op.or]: [
                            { username: row.username },
                            { email: row.email }
                        ]
                    } 
                });

                if (existingStudent) {
                    results.errors.push({
                        row: i + 2,
                        error: 'Student with this username or email already exists',
                        data: row
                    });
                    continue;
                }


                const hashedPassword = await bcrypt.hash(row.password.toString(), 10);

                const newStudent = await Student.create({
                    username: row.username.toString().trim(),
                    name: row.name.toString().trim().toUpperCase(),
                    email: row.email.toString().trim().toLowerCase(),
                    section: row.section.toString().trim().toUpperCase(),
                    dept: row.dept.toString().trim().toUpperCase(),
                    password: hashedPassword
                });

                results.success.push({
                    row: i + 2,
                    student: {
                        id: newStudent.id,
                        username: newStudent.username,
                        name: newStudent.name,
                        email: newStudent.email,
                        section: newStudent.section,
                        dept: newStudent.dept
                    }
                });

            } catch (error) {
                results.errors.push({
                    row: i + 2,
                    error: error.message || 'Unknown error occurred',
                    data: row
                });
            }
        }

        const statusCode = results.errors.length === 0 ? 201 : 207; // 207 = Multi-Status
        res.status(statusCode).json({
            message: `Upload completed. ${results.success.length} students created successfully, ${results.errors.length} errors occurred.`,
            results: {
                totalRows: results.total,
                successCount: results.success.length,
                errorCount: results.errors.length,
                successfulStudents: results.success,
                errors: results.errors
            }
        });

    } catch (error) {
        console.error('Error uploading student data:', error);
        res.status(500).json({ message: 'Internal server error during file upload' });
    }
}

// Upload Faculty data from Excel
const uploadFacultyData = async (req, res) => {
    try {
        if (!req.user || !req.user.id || req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Unauthorized: Admin not authenticated' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        if (!['xlsx', 'xls'].includes(fileExtension)) {
            return res.status(400).json({ message: 'Invalid file format. Please upload Excel file (.xlsx or .xls)' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
            return res.status(400).json({ message: 'Excel file is empty or has no valid data' });
        }

        const results = {
            success: [],
            errors: [],
            total: data.length
        };

        // Process each row
        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            try {
                const requiredFields = ['username', 'name', 'email', 'section', 'dept', 'coordinator', 'password'];
                const missingFields = requiredFields.filter(field => !row[field]);

                if (missingFields.length > 0) {
                    results.errors.push({
                        row: i + 2, 
                        error: `Missing required fields: ${missingFields.join(', ')}`,
                        data: row
                    });
                    continue;
                }

                const existingFaculty = await Faculty.findOne({ 
                    where: { 
                        [Op.or]: [
                            { username: row.username },
                            { email: row.email }
                        ]
                    } 
                });

                if (existingFaculty) {
                    results.errors.push({
                        row: i + 2,
                        error: 'Faculty with this username or email already exists',
                        data: row
                    });
                    continue;
                }

                const hashedPassword = await bcrypt.hash(row.password.toString(), 10);

                const newFaculty = await Faculty.create({
                    username: row.username.toString().trim(),
                    name: row.name.toString().trim().toUpperCase(),
                    email: row.email.toString().trim().toLowerCase(),
                    section: row.section.toString().trim().toUpperCase(),
                    dept: row.dept.toString().trim().toUpperCase(),
                    coordinator: row.coordinator.toString().trim().toLowerCase(),
                    password: hashedPassword
                });

                results.success.push({
                    row: i + 2,
                    faculty: {
                        id: newFaculty.id,
                        username: newFaculty.username,
                        name: newFaculty.name,
                        email: newFaculty.email,
                        section: newFaculty.section,
                        dept: newFaculty.dept,
                        coordinator: newFaculty.coordinator
                    }
                });

            } catch (error) {
                results.errors.push({
                    row: i + 2,
                    error: error.message || 'Unknown error occurred',
                    data: row
                });
            }
        }

        const statusCode = results.errors.length === 0 ? 201 : 207; // 207 = Multi-Status
        res.status(statusCode).json({
            message: `Upload completed. ${results.success.length} faculty created successfully, ${results.errors.length} errors occurred.`,
            results: {
                totalRows: results.total,
                successCount: results.success.length,
                errorCount: results.errors.length,
                successfulFaculty: results.success,
                errors: results.errors
            }
        });

    } catch (error) {
        console.error('Error uploading faculty data:', error);
        res.status(500).json({ message: 'Internal server error during file upload' });
    }
}


module.exports = {
    createAdmin,
    createFaculty,
    createStudent,
    getAdminDetails,
    changeAdminPassword,
    getAllAdmins,
    getAllStudents,
    getAllFaculty,
    updateAdminDetails,
    updateFacultyDetails,
    updateStudentDetails,
    viewAdmin,
    viewFaculty,
    viewStudent,
    uploadStudentData,
    uploadFacultyData
};