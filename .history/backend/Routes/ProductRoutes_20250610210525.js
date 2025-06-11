import express from 'express';
import { Addproduct, Updateproduct,GetAllProducts, Deleteproduct,GetProductById } from '../controller/ProductController.js';
import upload from '../middleware/multer.js';

const productrouter = express.Router();

productrouter.post('/products',upload.fields([{name: 'image1',maxCount:1},{name: 'image2',maxCount:1},{name: 'image3',maxCount:1},{name: 'image4',maxCount:1}]), Addproduct);
productrouter.get('/products', GetAllProducts);
productrouter.get('/products/:id', GetProductById);
productrouter.put(
    '/products/:id',// Contoh: Memerlukan otentikasi// Contoh: Hanya admin yang boleh memperbarui produk
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    Updateproduct
);

productrouter.delete('/products/:id', Deleteproduct);


export default productrouter;

