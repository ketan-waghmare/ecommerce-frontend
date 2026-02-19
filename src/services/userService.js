import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const registerUser = (user) => {
  return axios.post(`${API_URL}/register`, user);
};

export const loginUser = (data) => {
  return axios.post(`${API_URL}/login`, data);
};
