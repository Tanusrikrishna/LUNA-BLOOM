const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        // You could use an enum to restrict categories to a predefined list
        enum: ['Dresses', 'Tops', 'Accessories', 'Shoes']
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    }
    
   
}, {
    // This option adds 'createdAt' and 'updatedAt' fields automatically
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

