import express from 'express'
import {getProducts,addProducts,getCategories,updateProduct,deleteProduct,getProductById,getUserProducts} from '../controllers/productControllers.js'
import upload from '../middlewares/upload.js'
import { protect, requireMerchant } from '../middlewares/authMiddleware.js'
const router=express.Router()

router.route('/products').get(getProducts)
router.route('/categories').get(getCategories)
router.route('/add-product').post(protect, requireMerchant, upload.array('images', 5), addProducts)
router.route('/user-products').get(protect, requireMerchant, getUserProducts)
router.route('/product/:id').get(getProductById).put(protect, requireMerchant, upload.array('images', 5), updateProduct).delete(protect, requireMerchant, deleteProduct)

export default router