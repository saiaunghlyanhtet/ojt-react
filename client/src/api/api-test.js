import axios from "axios";

const baseURL = "http://localhost:3001/api"; // Update with the appropriate URL of your Express backend

export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${baseURL}/users`, newUser);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${baseURL}/users/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${baseURL}/users/${userId}`);
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

const TEAM_API_URL =
  "https://crudcrud.com/api/0cc810d624454bc394f22f56e54a2d22";
// Get all teams
export const getAllTeams = async () => {
  try {
    const response = await fetch(`${TEAM_API_URL}/teams`);
    const data = await response.json();
    return data;
  } catch (error) {
    
    console.error("Error getting teams:", error);
  }
};
