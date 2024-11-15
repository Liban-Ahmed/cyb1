const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 2000;

// MongoDB Connection
const url = 'mongodb://localhost:27017';
const dbName = 'reactdata';
const client = new MongoClient(url);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

// MongoDB Connection
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('MongoDB database connection established successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}
connectToMongoDB();

// Get all products
app.get('/catalog', async (req, res) => {
    try {
      const db = client.db(dbName);
      const products = await db.collection('fakestore_catalog').find({}).toArray();
      res.json(products);
    } catch (error) {
      console.error('Error getting products:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Get product by ID
app.get('/catalog/id/:id', async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = parseInt(req.params.id);
    const product = await db.collection('fakestore_catalog').findOne({ id });
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error getting product by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}); 

// Get products by category (with partial match search)
app.get('/catalog/category/:category', async (req, res) => {
  try {
    const db = client.db(dbName);
    const categoryQuery = req.params.category; // Get category from request params
    const regex = new RegExp(categoryQuery, 'i'); // Case-insensitive regex for partial match
    const products = await db.collection('fakestore_catalog').find({ category: regex }).toArray();
    if (!products || products.length === 0) {
      res.status(404).json({ error: 'Products not found for this category' });
    } else {
      res.json(products);
    }
  } catch (error) {
    console.error('Error getting products by category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




  
  // Add a new product
  app.post('/catalog', async (req, res) => {
    try {
      const db = client.db(dbName);
      const product = req.body;
      await db.collection('fakestore_catalog').insertOne(product);
      res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Update a product by ID
  app.put('/catalog/:id', async (req, res) => {
    try {
      const db = client.db(dbName);
      const id = parseInt(req.params.id);
      const updatedProduct = req.body;
      const result = await db.collection('fakestore_catalog').updateOne({ id }, { $set: updatedProduct });
      if (result.modifiedCount === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Product updated successfully' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Delete a product by ID
  app.delete('/catalog/:id', async (req, res) => {
    try {
      const db = client.db(dbName);
      const id = parseInt(req.params.id);
      const result = await db.collection('fakestore_catalog').deleteOne({ id });
      if (result.deletedCount === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Product deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// Additional Cart Endpoints
app.post("/cart", async (req, res) => {
  const { userId, items } = req.body; // items should be an array of { productId, quantity }
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

app.get("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
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

app.delete("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
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

app.put("/cart/:userId", async (req, res) => {
  const { userId } = req.params;
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
