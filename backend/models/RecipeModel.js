import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Recipe = db.define("recipes", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  images: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const raw = this.getDataValue('images');
      return raw ? JSON.parse(raw) : [];
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value));
    }
  }
}, {
  freezeTableName: true
});

// Sync the model with the database
const syncDatabase = async () => {
  try {
    await db.sync();
    console.log('Recipe model synced successfully');
  } catch (error) {
    console.error('Error syncing Recipe model:', error);
  }
}

export default Recipe;
