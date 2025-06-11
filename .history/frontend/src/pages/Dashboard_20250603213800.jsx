import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    variant: false,
    price: '',
    productKey: '',
    description: '',
    sku: '',
    stock: '',
    minStock: ''
  });

  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    setImages({ ...images, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    for (const key in images) {
      if (images[key]) {
        data.append(key, images[key]);
      }
    }

    try {
      const res = await axios.post('http://localhost:5000/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('✅ Produk ditambahkan:', res.data);
      alert('Produk berhasil ditambahkan!');
    } catch (err) {
      console.error('❌ Gagal menambahkan produk:', err.response?.data || err);
      alert('Gagal menambahkan produk.');
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="text" name="name" placeholder="Nama Produk" onChange={handleInputChange} required />
      <input type="text" name="category" placeholder="Kategori" onChange={handleInputChange} required />
      <label>
        <input type="checkbox" name="variant" onChange={handleInputChange} />
        Produk memiliki varian?
      </label>
      <input type="number" name="price" placeholder="Harga" onChange={handleInputChange} required />
      <input type="text" name="productKey" placeholder="Product Key" onChange={handleInputChange} required />
      <textarea name="description" placeholder="Deskripsi" onChange={handleInputChange} required />
      <input type="text" name="sku" placeholder="SKU" onChange={handleInputChange} />
      <input type="number" name="stock" placeholder="Stock" onChange={handleInputChange} />
      <input type="number" name="minStock" placeholder="Minimum Stock" onChange={handleInputChange} />

      <input type="file" name="image1" onChange={handleImageChange} />
      <input type="file" name="image2" onChange={handleImageChange} />
      <input type="file" name="image3" onChange={handleImageChange} />
      <input type="file" name="image4" onChange={handleImageChange} />

      <button type="submit">Tambah Produk</button>
    </form>
  );
};


export default Dashboard;
