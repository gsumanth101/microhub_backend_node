const db = require('../lib/connection');
const {DataTypes} = require('sequelize');

const facultySchema = {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    section:{
        type: DataTypes.STRING,
        allowNull: false
    },
    dept:{
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinator:{
        type: DataTypes.STRING,
        defaultValue: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'faculty',
        validate: {
            isIn: [['faculty']]
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}

const Faculty = db.define('faculty', facultySchema);

module.exports = Faculty;
