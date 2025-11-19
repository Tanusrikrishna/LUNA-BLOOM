// backend/controllers/product.js

const Product = require("../models/product");

// CREATE a new Product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Product image is required." });
        }
        if (!name || !description || !price || !category || !countInStock) {
            return res.status(400).json({ message: "All text fields are required." });
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            productImage: req.file.path,
            category,
            countInStock,
            user: req.user._id // This comes from the 'protect' middleware
        });

        res.status(201).json({
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error in addProduct controller:", error);
        res.status(500).json({ message: "Server error while adding product." });
    }
};

// READ all Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error("Error in getProducts controller:", error);
        res.status(500).json({ message: "Server error while fetching products." });
    }
};

// READ a single Product by ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error("Error in getProduct controller:", error);
        res.status(500).json({ message: "Server error while fetching single product." });
    }
};

// READ all products for the logged-in user
const getMyProducts = async (req, res) => {
    try {
        const products = await Product.find({ user: req.user._id });
        res.status(200).json({
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error("Error in getMyProducts controller:", error);
        res.status(500).json({ message: "Server error while fetching user's products." });
    }
}

// UPDATE a Product by ID
const editProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // ✨ FIX: Add a check for product.user to prevent crashes on old data
        if (!product.user || product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized" });
        }
        
        const updateData = { ...req.body };
        if (req.file) {
            updateData.productImage = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ message: "Product edited successfully", product: updatedProduct });

    } catch (error) {
        console.error("Error in editProduct controller:", error);
        res.status(500).json({ message: "Server error while editing product." });
    }
}

// DELETE a Product by ID
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found." });
        }

        // ✨ FIX: Add a check for product.user to prevent crashes on old data
        if (!product.user || product.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "User not authorized." });
        }

        // ✨ FIX: Correctly call the deleteOne method
        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Error in deleteProduct controller:", error);
        res.status(500).json({ message: "Server error while deleting product." });
    }
}

module.exports = { addProduct, getProducts, getProduct, getMyProducts, editProduct, deleteProduct };