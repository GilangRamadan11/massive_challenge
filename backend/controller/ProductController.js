import Product from '../models/ProductModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();
//add product
const Addproduct = async (req, res) => {
  const { name, category, variant, price, productKey, description, sku, stock, minStock } = req.body;

  // Validasi Input
  if (!name || !category || !price || !productKey) {
    return res.status(400).json({ success: false, message: 'Nama, kategori, harga, dan productKey harus diisi.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ success: false, message: 'Harga harus berupa angka positif.' });
  }

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
  const {name,category,variant,price,productKey,description,sku,stock,minStock
  } = req.body;

  // Validasi ID
  if (!id || typeof id !== 'string' || id.length < 1) {
    return res.status(400).json({ success: false, message: 'ID produk tidak valid.' });
  }

  // Validasi Input
  if (!name || !category || !price || !productKey) {
    return res.status(400).json({ success: false, message: 'Nama, kategori, harga, dan productKey harus diisi.' });
  }

  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ success: false, message: 'Harga harus berupa angka positif.' });
  }

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
      name,category,variant,price,productKey,description,sku,stock,minStock,images: uploadedImages
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
      message: 'Gagal update produk: ' + error.message
    });
  }
};

//delete product
const Deleteproduct = async (req, res) => {
    const { id } = req.params;

    // Validasi ID
    if (!id || typeof id !== 'string' || id.length < 1) {
        return res.status(400).json({
            success: false,
            message: 'ID produk tidak valid.'
        });
    }

    try {
        // Cek apakah produk ada sebelum dihapus
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Produk tidak ditemukan.'
            });
        }

        const deletedProduct = await Product.destroy({
            where: { id }
        });

        if (deletedProduct === 0) {
            // Ini seharusnya tidak terjadi jika findByPk berhasil, tapi tetap ada untuk berjaga-jaga
            return res.status(500).json({
                success: false,
                message: 'Gagal menghapus produk '
            });
        }

        res.json({
            success: true,
            message: 'Produk berhasil dihapus.'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus produk: ' + error.message
        });
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

    // Validasi ID
    if (!id || typeof id !== 'string' || id.length < 1) {
        return res.status(400).json({
            success: false,
            message: 'ID produk tidak valid.'
        });
    }

    try {
        const product = await Product.findOne({
            where: { id }
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.json({
            success: true,
            product: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product: ' + error.message
        });
    }
}


export {
    Addproduct,
    Updateproduct,
    Deleteproduct,
    GetAllProducts,
    GetProductById
};