const db = require('../lib/connection');
const { DataTypes } = require('sequelize');

const projectEvent = db.define('event', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    short_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinators: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
    },
    max_team_size: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: 'project_events',
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
});
module.exports = projectEvent;

    

