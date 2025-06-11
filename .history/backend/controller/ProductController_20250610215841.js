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
  const {
    name,
    category,
    variant,
    price,
    productKey,
    description,
    sku,
    stock,
    minStock
  } = req.body;

  try {
    // Cari produk berdasarkan ID
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Produk tidak ditemukan' });
    }

    // Fungsi upload ke Cloudinary
    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'products'
      });
      return result.secure_url;
    };

    // Proses gambar baru jika dikirim
    const files = req.files;
    const imageFiles = [];

    ['image1', 'image2', 'image3', 'image4'].forEach(key => {
      if (files && files[key]) {
        imageFiles.push(files[key][0]);
      }
    });

    let uploadedImages = product.images; 
    if (imageFiles.length > 0) {
      uploadedImages = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImages.push(url);
      }
    }

    // Update data produk
    await product.update({
      name,
      category,
      variant,
      price,
      productKey,
      description,
      sku,
      stock,
      minStock,
      images: uploadedImages
    });

    res.json({
      success: true,
      message: 'Produk berhasil diperbarui',
      product
    });
  } catch (error) {
    console.error('Gagal update produk:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal update produk'
    });
  }
};


//delete product
const Deleteproduct = async (req, res) => {
  try {
    await productModel.findByIdandDelete(req.body.id);
    
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