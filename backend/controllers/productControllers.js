import Product, { availableCategories } from '../models/productModel.js';
import Order from '../models/orderModel.js';

// Get available categories
export const getCategories = async (req, res) => {
    try {
        res.status(200).json(availableCategories);
    } catch (error) {
        res.status(500).json({ message: "Error getting categories", error: error.message });
    }
}


export const addProducts=async(req, res)=>{
    console.log(req.body)
    console.log(req.files) // Log uploaded files
    
    const {name,description,price,quantity,brand,category}=req.body;

    if(!name || !description || !price || quantity === undefined) {
        return res.status(400).json({message: "Name, description, price, and quantity are required"});
    }
    
    if(price <= 0) {
        return res.status(400).json({message: "Price must be greater than 0"});
    }
    
    if(quantity < 0) {
        return res.status(400).json({message: "Quantity cannot be negative"});
    }
    
    try {
        // Process uploaded images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/products/${file.filename}`);
        }
        
        const product = new Product({
            name,
            description,
            price,
            quantity,
            images: images,
            brand: brand || 'Generic',
            category: category || 'Other',
            owner: req.user.id
        });
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);

    } catch (error) {
        res.status(500).json({message: "Error adding product", error: error.message});
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, brand, category } = req.body;

        if (!name || !description || !price || quantity === undefined) {
            return res.status(400).json({ message: "Name, description, price, and quantity are required" });
        }

        if (price <= 0) {
            return res.status(400).json({ message: "Price must be greater than 0" });
        }

        if (quantity < 0) {
            return res.status(400).json({ message: "Quantity cannot be negative" });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user owns this product
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only update your own products" });
        }

        // Process uploaded images if any
        let images = product.images; // Keep existing images by default
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/products/${file.filename}`);
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                quantity,
                images,
                brand: brand || 'Generic',
                category: category || 'Other'
            },
            { new: true }
        );

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if the user owns this product
        if (product.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "You can only delete your own products" });
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error getting product", error: error.message });
    }
}

export const getProducts=async(req, res)=>{
    try {
        const { category } = req.query;
        
        // Build filter object
        let filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        
        const products = await Product.find(filter).populate('owner', 'fullname email');
        res.status(200).json(products);
        
    } catch (error) {
        console.error('getProducts - Error:', error);
        res.status(500).json({message: "Error getting products", error: error.message});
    }
}

// Get user's own products
export const getUserProducts = async (req, res) => {
    try {
        console.log('🔍 getUserProducts - User ID:', req.user.id);
        console.log('🔍 getUserProducts - User Role:', req.user.role);
        
        const products = await Product.find({ owner: req.user.id });
        console.log('🔍 getUserProducts - Found products:', products.length);
        
        // Calculate sales data for each product
        const productsWithStats = await Promise.all(products.map(async (product) => {
            // Aggregate sales data for this specific product
            const salesData = await Order.aggregate([
                {
                    $match: {
                        status: { $nin: ['cancelled'] } // Exclude cancelled orders
                    }
                },
                { $unwind: '$items' },
                {
                    $match: {
                        'items.productId': product._id,
                        'items.merchantId': req.user.id
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalSold: { $sum: '$items.quantity' },
                        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtTime'] } },
                        totalOrders: { $addToSet: '$_id' } // Get unique order IDs
                    }
                }
            ]);

            const stats = salesData[0] || { totalSold: 0, totalRevenue: 0, totalOrders: [] };

            return {
                ...product.toObject(),
                totalSold: stats.totalSold,
                totalRevenue: stats.totalRevenue,
                totalOrders: stats.totalOrders.length // Count of unique orders
            };
        }));
        
        res.status(200).json(productsWithStats);
    } catch (error) {
        console.error('Error getting user products with sales data:', error);
        res.status(500).json({ message: "Error getting user products", error: error.message });
    }
}
