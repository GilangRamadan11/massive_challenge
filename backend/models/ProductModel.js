import db from '../config/database.js';
import { DataTypes } from 'sequelize';

const Product = db.define("products", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  variant: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productKey: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
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
    console.log('Product model synced successfully');
  } catch (error) {
    console.error('Error syncing Product model:', error);
  }
}

export default Product;
