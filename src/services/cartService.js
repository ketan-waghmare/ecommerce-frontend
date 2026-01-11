import axios from "axios";

import { getCartId } from "../utils/cartId";

const BASE_URL = "http://localhost:8080/api/cart";

export const addToCart = (productId,quantity = 1) => {
  console.log("Token == > " + localStorage.getItem("token"));
    const cartId = getCartId();
    return axios.post(`${BASE_URL}/add`,null,{
        params: {cartId,productId,quantity}
    });
};

// export const getCart = () => {
//   const token = localStorage.getItem("token");

//   if(token && token !== "null" && token !== "undefined") {
//      return getCartWithToken();
//   } else {
//     const cartId = getCartId();
//     if(!cartId) {
//       return Promise.reject("No Cart found");
//     } 

//     return getCartWithCartId();
//   }
// }

export const getCartWithCartId = () => {
    const cartId = getCartId();
    return axios.get(BASE_URL, {
        params: { cartId }
    });
};

export const getCartWithToken = () => {
  return axios.get(`${BASE_URL}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
};

// Remove item from cart
export const removeFromCart = (cartItemId) => {
  return axios.delete(`${BASE_URL}/remove/${cartItemId}`);
};

export const updateCartQuantity = (id, quantity) => {
  return axios.put(
    `${BASE_URL}/update/${id}?quantity=${quantity}`
  );
};

export const mergeCart = (guestCartId) => {
  return axios.post(
    `${BASE_URL}/merge/${guestCartId}`,
    {},
    {
      headers : {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );
};
