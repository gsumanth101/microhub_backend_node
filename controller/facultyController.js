const Faculty = require('../models/faculty.model');
const Student = require('../models/student.model');

//Profile of logged in faculty
const getFacultyProfile = async (req, res) => {
    try {
        const facultyId = req.user.id; // Assuming user ID is stored in req.user
        const faculty = await Faculty.findByPk(facultyId, {
            attributes: ['id', 'username', 'name', 'email', 'section', 'dept', 'coordinator']
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

//change password of faculty
const changeFacultyPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (!req.user || !req.user.id || req.user.role !== 'faculty') {
            return res.status(401).json({ message: 'Unauthorized: Faculty not authenticated' });
        }

        const facultyId = req.user.id;
        const faculty = await Faculty.findByPk(facultyId);

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const isOldPasswordValid = await bcrypt.compare(oldPassword, faculty.password);
        if (!isOldPasswordValid) {
            return res.status(401).json({ message: 'Invalid old password' });
        }

        faculty.password = await bcrypt.hash(newPassword, 10);
        await faculty.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing faculty password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//get students from his section
const getStudentsFromSection = async (req, res) => {
    try {
        const facultyId = req.user.id; 
        const faculty = await Faculty.findByPk(facultyId, {
            attributes: ['section']
        });

        if (!faculty) {
            return res.status(404).json({ message: 'Faculty not found' });
        }

        const students = await Student.findAll({
            where: { section: faculty.section },
            attributes: ['id', 'name', 'email', 'section']
        });

        res.status(200).json({
            message: 'Students from section retrieved successfully',
            students
        });
    } catch (error) {
        console.error('Error retrieving students from section:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


module.exports = {
    getFacultyProfile,
    changeFacultyPassword,
    getStudentsFromSection
};