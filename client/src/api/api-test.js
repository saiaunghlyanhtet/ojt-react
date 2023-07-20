import axios from "axios";

const baseURL = "http://localhost:3001/api";

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

export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get user");
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
  "https://crudcrud.com/api/68441e8165c24f6ca0d19a2b689665eb";
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
