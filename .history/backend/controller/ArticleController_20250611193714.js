import React from 'react'
import Recipe from '../models/RecipeModel.js';
import { v2 as cloudinary } from 'cloudinary';
import connectCloudinary from '../config/cloudinary.js';

connectCloudinary();


const ArticleController = () => {
  return (
    <div>ArticleController</div>
  )
}

export default ArticleController