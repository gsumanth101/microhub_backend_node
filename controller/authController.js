const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Admin = require('../models/admin.model');
const Faculty = require('../models/faculty.model');
const Student = require('../models/student.model');
dotenv.config();

/**
 * Author: Sumanth
 * Date: 2025-06-24
 * Description: Controller for handling authentication-related operations
*/

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: admin.id, role:'admin'}, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const facultyLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const faculty = await Faculty.findOne({ where: { username } });
        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, faculty.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: faculty.id,role:'faculty' }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            faculty: {
                id: faculty.id,
                name: faculty.name,
                email: faculty.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

const studentLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const student = await Student.findOne({ where: { username } });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: student.id,role:'student' }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            student: {
                id: student.id,
                name: student.name,
                email: student.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    adminLogin,
    facultyLogin,
    studentLogin
};