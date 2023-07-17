const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Create users
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;

    // Make API call to the external service to create a user
    const response = await axios.post(
      "https://crudcrud.com/api/08b2782a3f5d441ebadde01f557b89c1/user",
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
      `https://crudcrud.com/api/08b2782a3f5d441ebadde01f557b89c1/user/${userId}`,
      updatedUser
    );

    res.json(updatedUser);
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
      `https://crudcrud.com/api/08b2782a3f5d441ebadde01f557b89c1/user/${userId}`
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
      "https://crudcrud.com/api/08b2782a3f5d441ebadde01f557b89c1/user"
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
