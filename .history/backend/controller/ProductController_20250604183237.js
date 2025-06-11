import Product from '../models/ProductModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();
//add product
const Addproduct = async (req, res) => {
  const { name, category, variant, price, productKey, description, sku, stock, minStock } = req.body;

  try {
    const exists = await Product.findOne({ where: { productKey } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'productKey sudah ada' });
    }

    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'products' });
      return result.secure_url;
    };

    const files = req.files;
    const imageFiles = [];

    ['image1', 'image2', 'image3', 'image4'].forEach(key => {
      if (files[key]) {
        imageFiles.push(files[key][0]);
      }
    });

    const uploadedImages = [];
    for (const file of imageFiles) {
      const url = await uploadImage(file);
      uploadedImages.push(url);
    }

    const newProduct = await Product.create({
      name,category,variant,price,productKey,description,sku,stock,minStock,images: uploadedImages
    });

    res.status(201).json({ success: true, product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};




//update product

const Updateproduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, variant, price, productKey, description, sku, stock, minStock,images} = req.body;

    try {
        const updatedProduct = await Product.update({
            name,category,variant,price,productKey,description,sku,stock,minStock,images
    publicId
        }, {
            where: { id }
        });

        if (updatedProduct[0] === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Failed to update product' });
    }
}

//delete product
const Deleteproduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.destroy({
            where: { id }
        });

        if (deletedProduct === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Failed to delete product' });
    }
}

//get all products /list products
const GetAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
}

//sigle product
const GetProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findOne({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Failed to fetch product' });
    }
}

export {
    Addproduct,
    Updateproduct,
    Deleteproduct,
    GetAllProducts,
    GetProductById
};