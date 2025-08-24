import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectMongoDb from './db/connectDb.js'
import { validateEnvironment } from './utils/envValidation.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

// Validate environment variables
validateEnvironment();

const PORT=process.env.PORT ||5000
const app=express();

// Enable CORS for all routes and origins
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/shop/',productRoutes)
app.use('/api/users/',userRoutes)
app.use('/api/cart/',cartRoutes)
app.use('/api/orders/',orderRoutes)
app.use('/api/payments/',paymentRoutes)

app.listen(PORT,()=>{
    console.log('server started at ',PORT)
    connectMongoDb();
})