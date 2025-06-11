import express from 'express';
import { Addproduct, Updateproduct,GetAllProducts, Deleteproduct,GetProductById } from '../controller/ProductController.js';
import upload from '../middleware/multer.js';

const productrouter = express.Router();

productrouter.post('/products/add',upload.fields([{name: 'image1',maxCount:1},{name: 'image2',maxCount:1},{name: 'image3',maxCount:1},{name: 'image4',maxCount:1}]), Addproduct);
productrouter.get('/products/allproduct', GetAllProducts);
productrouter.get('/products/sigle', GetProductById);
productrouter.put(
    '/products/update',
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    Updateproduct
);

productrouter.delete('/products/delete', Deleteproduct);


export default productrouter;

