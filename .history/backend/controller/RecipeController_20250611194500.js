import Recipe from '../models/RecipeModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();

// Upload Helper
const uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path, { folder: 'recipes' });
  return result.secure_url;
};

// Add Recipe
const AddRecipe = async (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ success: false, message: 'Judul, kategori, dan deskripsi harus diisi.' });
  }

  try {
    const files = req.files;
    const imageFiles = [];

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

    const newRecipe = await Recipe.create({
      title,
      category,
      description,
      images: uploadedImages
    });

    res.status(201).json({ success: true, recipe: newRecipe });
  } catch (error) {
    console.error('Add recipe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Recipes
const GetAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json({ success: true, recipes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data.' });
  }
};

// Get by ID
const GetRecipeById = async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    res.json({ success: true, recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal mengambil resep.' });
  }
};

// Update
const UpdateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, category, description } = req.body;

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });

    const files = req.files;
    const imageFiles = [];

    ['image1', 'image2', 'image3', 'image4'].forEach(key => {
      if (files && files[key]) {
        imageFiles.push(files[key][0]);
      }
    });

    let uploadedImages = recipe.images;
    if (imageFiles.length > 0) {
      uploadedImages = [];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        uploadedImages.push(url);
      }
    }

    await recipe.update({ title, category, description, images: uploadedImages });

    res.json({ success: true, message: 'Resep berhasil diperbarui.', recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui resep.' });
  }
};

// Delete
const DeleteRecipe = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Recipe.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    res.json({ success: true, message: 'Resep berhasil dihapus.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Gagal menghapus resep.' });
  }
};

export {
  AddRecipe,
  GetAllRecipes,
  GetRecipeById,
  UpdateRecipe,
  DeleteRecipe
};
