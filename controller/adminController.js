const Admin = require('../models/admin.model');
const Faculty = require('../models/faculty.model');
const Student = require('../models/student.model');
const bcrypt = require('bcrypt');


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







module.exports = {
    createAdmin,
    createFaculty,
    createStudent,
    getAdminDetails,
    changeAdminPassword,
    getAllAdmins,
    getAllStudents,
    getAllFaculty
};