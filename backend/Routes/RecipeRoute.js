import express from 'express';
import {
  AddRecipe,
  UpdateRecipe,
  GetAllRecipes,
  DeleteRecipe,
  GetRecipeById
} from '../controller/RecipeController.js';

import upload from '../middleware/multer.js';

const reciperouter = express.Router();

// Tambah resep
reciperouter.post(
  '/recipes/add',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  AddRecipe
);

reciperouter.get('/recipes/all', GetAllRecipes);
reciperouter.get('/recipes/single/:id', GetRecipeById);

// Update resep
reciperouter.put(
  '/recipes/update/:id',
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  UpdateRecipe
);

// Hapus resep
reciperouter.delete('/recipes/delete/:id', DeleteRecipe);

export default reciperouter;
