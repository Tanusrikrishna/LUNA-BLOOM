const express = require("express");
const router = express.Router();
const { addProduct, getProducts, getProduct,getMyProducts, editProduct, deleteProduct } = require("../controllers/product");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// --- IMPORTANT: The order and specificity of these routes matter ---

// GET /Product -> This route specifically handles fetching ALL products.
// It MUST come before the dynamic '/Products/:id' route.
router.get("/products", getProducts);

router.get("/myproducts",protect,getMyProducts);

// GET /Products/:id -> This route handles fetching a SINGLE product by its ID.
router.get("/products/:id", getProduct);

// POST /Products -> This route handles creating a NEW product.
// I've used the same base as the single product for consistency.
router.post("/products", protect, upload.single("productImage"), addProduct);

// PUT /Products/:id -> This route handles updating a product.
router.put("/products/:id", protect, upload.single("productImage"), editProduct);

// DELETE /Products/:id -> This route handles deleting a product.
router.delete("/products/:id", protect, deleteProduct);

module.exports = router;

