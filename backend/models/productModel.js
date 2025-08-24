import mongoose from "mongoose";

// Define available categories
const availableCategories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports & Outdoors',
  'Health & Beauty',
  'Toys & Games',
  'Automotive',
  'Food & Beverages',
  'Office Supplies',
  'Other'
];

const productSchema=mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true,min:0},
    quantity:{type:Number,required:true,min:0},
    images:{type:[String],default:[]},
    brand:{type:String,default:'Generic'},
    category:{
        type:String,
        enum: availableCategories,
        default:'Other'
    },
    ratings:{type:Number},
    reviews:{type:String},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps:true})

const Product=mongoose.model("Product",productSchema)

// Export both the model and categories
export { availableCategories }
export default Product