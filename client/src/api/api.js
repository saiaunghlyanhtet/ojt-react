import { message } from "antd";
import { Messages } from "../data/message";

const API_BASE_URL =
  "https://crudcrud.com/api/08b2782a3f5d441ebadde01f557b89c1";

// Create a new user
const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    message.error(Messages.M001);
    console.error("Error creating user:", error);
  }
};

// Get all users
const getUsers = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user`);
    const data = await response.json();
    return data;
  } catch (error) {
    message.error(Messages.M001);
    console.error("Error getting users:", error);
  }
};

// Update a user
const updateUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(userData),
      mode: "cors",
      credentials: "same-origin",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

// Delete a user
const deleteUser = async (userId, userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

const TEAM_API_URL =
  "https://crudcrud.com/api/0cc810d624454bc394f22f56e54a2d22";
// Get all teams
const getAllTeams = async () => {
  try {
    const response = await fetch(`${TEAM_API_URL}/teams`);
    const data = await response.json();
    return data;
  } catch (error) {
    message.error(Messages.M001);
    console.error("Error getting teams:", error);
  }
};

export { createUser, getUsers, updateUser, deleteUser, getAllTeams };
