import express from 'express'
import {getCartItems,addItemToCart,removeItemFromCart,clearCart,updateItemQuantity} from '../controllers/cartController.js'
import { protect } from '../middlewares/authMiddleware.js'
const router=express.Router()

// POST /api/cart/add-item
router.route('/add-item').post(addItemToCart)

// POST /api/cart/get-items  
router.route('/get-items').post(getCartItems)

// POST /api/cart/remove-item
router.route('/remove-item').post(removeItemFromCart)

// POST /api/cart/update-quantity
router.route('/update-quantity').post(updateItemQuantity)

// POST /api/cart/clear
router.route('/clear').post(protect, clearCart)

// DELETE /api/cart/clear (alternative method)
router.route('/clear').delete(protect, clearCart)

export default router