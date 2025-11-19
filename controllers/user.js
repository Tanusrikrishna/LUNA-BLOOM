// backend/controllers/user.js

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP and LOGIN functions are correct, but include them for a complete file
const userSignUp = async (req, res) => {
    // ... your existing correct signup code
    try {
        const { name, email, password, isAdmin } = req.body;
        if (!name || !email || !password) { // isAdmin is not required for signup
            return res.status(400).json({ message: "Please fill all required fields" });
        }
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const hashPwd = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashPwd, isAdmin });
        
        // Don't automatically log in on signup, just confirm success
        return res.status(201).json({ message: "User registered successfully. Please log in." });

    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
};

const userLogin = async (req, res) => {
    // ... your existing correct login code
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }
        let user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.status(200).json({ message: "Logged in successfully", token, user });
        } else {
            return res.status(400).json({ error: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
};

// ## FIX: This function is now secure and sends all necessary data ##
const getUser = async (req, res) => {
    try {
        // Find the user by the ID from the URL parameter
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Security check: Only the logged-in user can get their own details
        if (req.user.id !== user.id) {
            return res.status(401).json({ message: "Not authorized to view this profile" });
        }

        res.status(200).json({ user });

    } catch (error) {
        console.error("Error in getUser:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ## FIX: This function is now secure and correctly handles password changes ##
const editUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Security check: Only the logged-in user can edit their own profile
        if (req.user.id !== user.id) {
            return res.status(401).json({ message: "Not authorized to edit this profile" });
        }
        
        // Update user fields
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If the user is updating their password, hash it before saving
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile edited successfully",
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
            }
        });

    } catch (error) {
        console.error("Error in editUser:", error);
        res.status(500).json({ message: "Server error while editing profile" });
    }
}

module.exports = { userSignUp, userLogin, getUser, editUser };