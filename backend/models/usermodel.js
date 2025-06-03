import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const User = db.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // memastikan nama tidak kosong
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // mencegah email duplikat
    validate: {
      notEmpty: true,
      isEmail: true, // validasi email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [6, 100], 
    },
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true, 
  },
}, {
  freezeTableName: true,
});

export default User;
