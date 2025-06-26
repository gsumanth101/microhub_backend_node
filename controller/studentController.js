const Student = require('../models/student.model');

//Profile of logged in student
const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.user.id; // Assuming user ID is stored in req.user
        const student = await Student.findByPk(studentId, {
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept']
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

// Change password of student
const changeStudentPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!req.user || !req.user.id || req.user.role !== 'student') {
            return res.status(401).json({ message: 'Unauthorized: Student not authenticated' });
        }

        const studentId = req.user.id;
        const student = await Student.findByPk(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, student.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        student.password = await bcrypt.hash(newPassword, 10);
        await student.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing student password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    getStudentProfile,
    changeStudentPassword
};