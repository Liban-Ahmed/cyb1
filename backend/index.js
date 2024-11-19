require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");

console.log("MongoDB URI:", process.env.MONGODB_URI); // Add this for debugging

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    console.log("Mongoose connected to MongoDB database successfully")
  )
  .catch((error) => console.error("Error connecting Mongoose:", error));

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("MongoDB client connected successfully");
  } catch (error) {
    console.error("Error connecting MongoDB client:", error);
  }
}
connectToMongoDB();

// Middleware

// Configure CORS to allow credentials
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
  })
);

// Parse incoming request bodies
app.use(bodyParser.json());

// Initialize session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// Initialize Passport and restore authentication state from the session
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy Configuration
passport.use(
  new LocalStrategy(
    { usernameField: "email" }, // Use 'email' instead of 'username' field
    async (email, password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        // If everything is good, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Serialize and deserialize user instances to and from the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// User Authentication Routes

// User Registration Route
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// User Login Route
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Error during login:", err);
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(400).json({ message: info.message });
    }

    // Log the user in
    req.logIn(user, (err) => {
      if (err) {
        console.error("Error during login:", err);
        return next(err);
      }
      return res.json({ message: "Logged in successfully." });
    });
  })(req, res, next);
});

// User Logout Route
app.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out successfully." });
  });
});

// Check Authentication Status Route
app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// Middleware to Ensure the User is Authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please log in to access this resource." });
}
// Update user profile
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Check if 'uploads' directory exists, if not, create it
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Serve static files from the 'uploads' folder
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Update profile route
app.put(
  "/profile",
  ensureAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { name, bio } = req.body;
      const avatar = req.file ? req.file.filename : null;

      const updateData = { name, bio };
      if (avatar) {
        updateData.avatar = avatar;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Error updating profile" });
    }
  }
);

// Get profile route
app.get("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId, "username email name bio avatar");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving profile:", error);
    res.status(500).json({ message: "Error retrieving profile" });
  }
});

// Product Routes using Native MongoDB Driver

// Get all products
app.get("/catalog", async (req, res) => {
  try {
    const db = client.db(dbName);
    const products = await db
      .collection("fakestore_catalog")
      .find({})
      .toArray();
    res.json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get product by ID
app.get("/catalog/id/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = parseInt(req.params.id);
    const product = await db.collection("fakestore_catalog").findOne({ id });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error("Error getting product by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get products by category (with partial match search)
app.get("/catalog/category/:category", async (req, res) => {
  try {
    const db = client.db(dbName);
    const categoryQuery = req.params.category;
    const regex = new RegExp(categoryQuery, "i"); // Case-insensitive regex for partial match
    const products = await db
      .collection("fakestore_catalog")
      .find({ category: regex })
      .toArray();
    if (!products || products.length === 0) {
      res.status(404).json({ error: "Products not found for this category" });
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error("Error getting products by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product (Protected Route)
app.post("/catalog", ensureAuthenticated, async (req, res) => {
  try {
    const db = client.db(dbName);
    const product = req.body;

    // Validate and process the product data as needed

    await db.collection("fakestore_catalog").insertOne(product);
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a product by ID (Protected Route)
app.put("/catalog/:id", ensureAuthenticated, async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = parseInt(req.params.id);
    const updatedProduct = req.body;
    const result = await db
      .collection("fakestore_catalog")
      .updateOne({ id }, { $set: updatedProduct });
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ message: "Product updated successfully" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a product by ID (Protected Route)
app.delete("/catalog/:id", ensureAuthenticated, async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = parseInt(req.params.id);
    const result = await db.collection("fakestore_catalog").deleteOne({ id });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cart Routes using Native MongoDB Driver

// Add or Update Cart for a User
app.post("/cart", ensureAuthenticated, async (req, res) => {
  const userId = req.user._id.toString(); // Convert ObjectId to string
  const { items } = req.body; // items should be an array of { productId, quantity }
  try {
    const db = client.db(dbName);
    const cart = await db
      .collection("user_carts")
      .updateOne({ userId }, { $set: { items } }, { upsert: true });
    res.json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Cart for a User
app.get("/cart", ensureAuthenticated, async (req, res) => {
  const userId = req.user._id.toString(); // Convert ObjectId to string
  try {
    const db = client.db(dbName);
    const cart = await db.collection("user_carts").findOne({ userId });
    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
    } else {
      res.json(cart);
    }
  } catch (error) {
    console.error("Error retrieving cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Cart for a User
app.delete("/cart", ensureAuthenticated, async (req, res) => {
  const userId = req.user._id.toString(); // Convert ObjectId to string
  try {
    const db = client.db(dbName);
    const result = await db.collection("user_carts").deleteOne({ userId });
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Cart not found" });
    } else {
      res.json({ message: "Cart deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Cart Items for a User
app.put("/cart", ensureAuthenticated, async (req, res) => {
  const userId = req.user._id.toString(); // Convert ObjectId to string
  const { items } = req.body; // items should be an array of { productId, quantity }
  try {
    const db = client.db(dbName);
    const result = await db
      .collection("user_carts")
      .updateOne({ userId }, { $set: { items } });
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "Cart not found or no update needed" });
    } else {
      res.json({ message: "Cart updated successfully" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the Server
const port = process.env.PORT || 2000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
