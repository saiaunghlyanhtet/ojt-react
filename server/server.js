const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const API_URL = 'https://crudcrud.com/api/64e0a2cdd3f04d20a5ad67c2757f33fa'

// Create users
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;

    
    const response = await axios.post(
      `${API_URL}/user`,
      newUser
    );
    const createdUser = response.data;

    res.json(createdUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update a user
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    // Make API call to the external service to update the user
    await axios.put(
      `${API_URL}/user/${userId}`,
      updatedUser
    );

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Update a user
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Make API call to the external service to get the user
    const response = await axios.get(
      `${API_URL}/user/${userId}`
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Make API call to the external service to delete the user
    await axios.delete(
      `${API_URL}/user/${userId}`
    );

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    // Make API call to the external service to get all users
    const response = await axios.get(
      `${API_URL}/user`
    );
    const users = response.data;

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Start the server
app.listen(3001, () => {
  console.log("Express backend is running on port 3001");
});
