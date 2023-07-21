import axios from "axios";

const baseURL = "http://localhost:3001/api";

// pass a user object to create a new user and return response object
export const createUser = async (newUser) => {
  try {
    const response = await axios.post(`${baseURL}/users`, newUser);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user");
  }
};

// pass the user id and updated user information to update the existing user and return the response object
export const updateUser = async (userId, updatedUser) => {
  try {
    const response = await axios.put(`${baseURL}/users/${userId}`, updatedUser);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

// get the user by passing the user id
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${baseURL}/users/${userId}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get user");
  }
};

// pass the user id to delete the user
export const deleteUser = async (userId) => {
  try {
    await axios.delete(`${baseURL}/users/${userId}`);
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

// get all users
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${baseURL}/users`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

const TEAM_API_URL =
  "https://crudcrud.com/api/bd07e3eb54e64f8da17e9996a45a4c41";
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
