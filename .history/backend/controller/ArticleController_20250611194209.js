import Recipe from '../models/RecipeModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();

// Add recipe
const AddRecipe = async (req, res) => {
  const { title, category, des } = req.body;

  if (!title || !category || !ingredients || !recipeKey) {
    return res.status(400).json({ success: false, message: 'Judul, kategori, bahan, dan recipeKey harus diisi.' });
  }

  try {
    const exists = await Recipe.findOne({ where: { recipeKey } });
    if (exists) {
      return res.status(400).json({ success: false, message: 'recipeKey sudah ada' });
    }

    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'recipes' });
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

    const newRecipe = await Recipe.create({
      title, category, ingredients, instructions, recipeKey, estimatedTime, images: uploadedImages
    });

    res.status(201).json({ success: true, recipe: newRecipe });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update recipe
const UpdateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, category, ingredients, instructions, recipeKey, estimatedTime } = req.body;

  if (!id || typeof id !== 'string' || id.length < 1) {
    return res.status(400).json({ success: false, message: 'ID resep tidak valid.' });
  }

  if (!title || !category || !ingredients || !recipeKey) {
    return res.status(400).json({ success: false, message: 'Judul, kategori, bahan, dan recipeKey harus diisi.' });
  }

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan' });
    }

    const uploadImage = async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'recipes'
      });
      return result.secure_url;
    };

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

    await recipe.update({
      title, category, ingredients, instructions, recipeKey, estimatedTime, images: uploadedImages
    });

    res.json({ success: true, message: 'Resep berhasil diperbarui', recipe });
  } catch (error) {
    console.error('Gagal update resep:', error);
    res.status(500).json({ success: false, message: 'Gagal update resep: ' + error.message });
  }
};

// Delete recipe
const DeleteRecipe = async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.length < 1) {
    return res.status(400).json({ success: false, message: 'ID resep tidak valid.' });
  }

  try {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    }

    const deletedRecipe = await Recipe.destroy({ where: { id } });

    if (deletedRecipe === 0) {
      return res.status(500).json({ success: false, message: 'Gagal menghapus resep (mungkin sudah dihapus).' });
    }

    res.json({ success: true, message: 'Resep berhasil dihapus.' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus resep: ' + error.message });
  }
};

// Get all recipes
const GetAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.findAll();
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Failed to fetch recipes' });
  }
};

// Get recipe by ID
const GetRecipeById = async (req, res) => {
  const { id } = req.params;

  if (!id || typeof id !== 'string' || id.length < 1) {
    return res.status(400).json({ success: false, message: 'ID resep tidak valid.' });
  }

  try {
    const recipe = await Recipe.findOne({ where: { id } });

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Resep tidak ditemukan.' });
    }

    res.json({ success: true, recipe });
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data resep: ' + error.message });
  }
};

export {
  AddRecipe,
  UpdateRecipe,
  DeleteRecipe,
  GetAllRecipes,
  GetRecipeById
};
