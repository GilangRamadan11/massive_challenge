import Article from '../models/ArticleModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();

const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, { folder: 'articles' });
  return result.secure_url;
};

// Add Article
const AddArticle = async (req, res) => {
  const { title, content, category, articleKey } = req.body;

  if (!title || !content || !category || !articleKey) {
    return res.status(400).json({ success: false, message: 'Field wajib diisi.' });
  }

  try {
    const exists = await Article.findOne({ where: { articleKey } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'articleKey sudah digunakan.' });
    }

    const imageFiles = [];
    const files = req.files;
    ['image1', 'image2', 'image3', 'image4'].forEach(key => {
      if (files && files[key]) {
        imageFiles.push(files[key][0]);
      }
    });

    const uploadedImages = [];
    for (const file of imageFiles) {
      const url = await uploadImage(file);
      uploadedImages.push(url);
    }

    const newArticle = await Article.create({
      title, content, category, articleKey, images: uploadedImages
    });

    res.status(201).json({ success: true, article: newArticle });
  } catch (error) {
    console.error('Add article error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Article
const UpdateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, articleKey } = req.body;

  if (!id || !title || !content || !category || !articleKey) {
    return res.status(400).json({ success: false, message: 'Field wajib diisi.' });
  }

  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    const imageFiles = [];
    const files = req.files;
    ['image1', 'image2', 'image3', 'image4'].forEach(key => {
      if (files && files[key]) {
        imageFiles.push(files[key][0]);
      }
    });

    let uploadedImages = article.images;
    if (imageFiles.length > 0) {
      uploadedImages = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImages.push(url);
      }
    }

    await article.update({
      title, content, category, articleKey, images: uploadedImages
    });

    res.json({ success: true, message: 'Artikel diperbarui', article });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Article
const DeleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    await Article.destroy({ where: { id } });
    res.json({ success: true, message: 'Artikel dihapus.' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Articles
const GetAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Article by ID
const GetArticleById = async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Artikel tidak ditemukan.' });
    }

    res.json({ success: true, article });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  AddArticle,
  UpdateArticle,
  DeleteArticle,
  GetAllArticles,
  GetArticleById
};
