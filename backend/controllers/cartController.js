import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
export const getCartItems=async(req,res)=>{
        try {
        const { userId } = req.body; 
        
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            // Create an empty cart if none exists
            cart = {
                userId,
                items: [],
                totalAmount: 0
            };
        }
        
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: "Error getting cart items", error: error.message });
    }
}
export const addItemToCart=async(req,res)=>{
    try {
        const { userId, productId, quantity } = req.body;
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        // Prevent merchants from adding their own products to cart
        if (product.owner.toString() === userId) {
            return res.status(400).json({ 
                message: "You cannot add your own products to cart" 
            });
        }
        
        let cart = await Cart.findOne({ userId });
        
        if (!cart) {

            cart = new Cart({
                userId,
                items: [{
                    productId,
                    quantity,
                    priceAtTime: product.price
                }],
                totalAmount: product.price * quantity
            });
        } else {

            const existingItemIndex = cart.items.findIndex(
                item => item.productId.toString() === productId
            );
            
            if (existingItemIndex > -1) {

                cart.items[existingItemIndex].quantity += quantity;
            } else {

                cart.items.push({
                    productId,
                    quantity,
                    priceAtTime: product.price
                });
            }
            

            cart.totalAmount = cart.items.reduce((total, item) => {
                return total + (item.priceAtTime * item.quantity);
            }, 0);
        }
        
        const savedCart = await cart.save();
        
        // Populate the cart with product details before returning
        const populatedCart = await Cart.findById(savedCart._id).populate('items.productId');
        res.status(200).json(populatedCart);
        
    } catch (error) {
        res.status(500).json({ message: "Error adding item to cart", error: error.message });
    }
}
export const removeItemFromCart=async(req,res)=>{
    try {
        const { userId, productId } = req.body;
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.priceAtTime * item.quantity);
        }, 0);
        
        const savedCart = await cart.save();
        
        // Populate the cart with product details before returning
        const populatedCart = await Cart.findById(savedCart._id).populate('items.productId');
        res.status(200).json(populatedCart);
        
    } catch (error) {
        res.status(500).json({ message: "Error removing item from cart", error: error.message });
    }
}
export const clearCart=async(req,res)=>{
    try {
        // Get userId from authenticated user or request body
        const userId = req.user?.id || req.body.userId;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        cart.items = [];
        cart.totalAmount = 0;
        
        const savedCart = await cart.save();
        res.status(200).json({ message: "Cart cleared successfully", cart: savedCart });
        
    } catch (error) {
        res.status(500).json({ message: "Error clearing cart", error: error.message });
    }
}

export const updateItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        if (quantity <= 0) {
            return res.status(400).json({ message: "Quantity must be greater than 0" });
        }
        
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        
        // Update quantity
        cart.items[itemIndex].quantity = quantity;
        
        // Recalculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => {
            return total + (item.priceAtTime * item.quantity);
        }, 0);
        
        const savedCart = await cart.save();
        
        // Populate the cart with product details before returning
        const populatedCart = await Cart.findById(savedCart._id).populate('items.productId');
        res.status(200).json(populatedCart);
        
    } catch (error) {
        res.status(500).json({ message: "Error updating item quantity", error: error.message });
    }
}