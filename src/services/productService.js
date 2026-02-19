import axios from "axios";

const API_URL = "http://localhost:8080/api/products";

export const getAllProducts = () => {
  return axios.get(API_URL);
};

export const getProductById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const updateProduct = (id, product) =>
  axios.put(`${API_URL}/${id}`, product);

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/${id}`, {
  });

export const deleteProductById = (id) => {
  return axios.delete(
    `${API_URL}/${id}`,
    {
    headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
     }
    }
);
};

export const addProduct = (product) => {
  return axios.post(
    API_URL,
    product,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
}