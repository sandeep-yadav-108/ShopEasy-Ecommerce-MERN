import mongoose, { mongo } from "mongoose";
const cartSchema=mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        priceAtTime: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        default: 0
    }
},{timestamps:true})

const Cart=mongoose.model("Cart",cartSchema)
export default Cart