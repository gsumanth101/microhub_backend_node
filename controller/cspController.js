const Project_Event = require('../models/events.model');

// Function to create a new CSP event
const createCSPEvent = async (req, res) => {
    try {
        const { short_name, name, coordinators, max_team_size, isEnabled } = req.body;

        // Validate required fields
        if (!short_name || !name || !max_team_size) {
            return res.status(400).json({ message: 'Short name, name, and max team size are required.' });
        }

        // Create the event
        const newEvent = await Project_Event.create({
            short_name,
            name,
            coordinators: coordinators || [],
            max_team_size,
            isEnabled: isEnabled !== undefined ? isEnabled : true
        });

        return res.status(201).json({ message: 'CSP event created successfully', event: newEvent });
    } catch (error) {
        console.error('Error creating CSP event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Function to assign coordinators to a CSP event
const assignCSPCoordinators = async (req, res) => {
    try {
        const { eventId, coordinators } = req.body;

        // Validate required fields
        if (!eventId || !coordinators || !Array.isArray(coordinators)) {
            return res.status(400).json({ message: 'Event ID and coordinators are required.' });
        }

        // Find the event
        const event = await Project_Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'CSP event not found.' });
        }

        // Update the coordinators
        event.coordinators = coordinators;
        await event.save();

        return res.status(200).json({ message: 'Coordinators assigned successfully', event });
    } catch (error) {
        console.error('Error assigning CSP coordinators:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
