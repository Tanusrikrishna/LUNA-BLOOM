const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path"); // <-- Add this line
const userRoutes = require("./routes/user");
const ProductRoutes = require("./routes/product");
const cors = require("cors");
const connect = require("./config/connectionDB");
const app = express();

const PORT = process.env.PORT || 5000; // It's better to use 5000 to match the frontend config
connect();

// Middleware
app.use(express.json());

// Specific CORS for better security (recommended)
const allowedOrigins = [
  "http://localhost:5173",             // Vite dev
  process.env.CLIENT_URL               // Vercel URL from Render env
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// API Routes
app.use("/", userRoutes); // Handles /login, /signUp
app.use("/", ProductRoutes); // Handles /Product, /Products/:id

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});

