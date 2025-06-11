import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import db from './config/database.js';
import router from './Routes/index.js';
import connectCloudinary from './config/cloudinary.js';
import productrouter from './Routes/ProductRoutes.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Database connection
try {
    await db.authenticate();
    console.log('Database connected ');
     await db.sync();
     
} catch (error) {
    console.error('Database conection :',error);
}
connectCloudinary();


// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(router);

//api endpoints
app.use('/api', router);
app.use('/api/products', productrouter);

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

app.listen(PORT, () => console.log('Server is running on port' + PORT));


