import axios from "axios";

import { getCartId } from "../utils/cartId";

const BASE_URL = "http://localhost:8080/api/cart";

export const addToCart = async (productId,quantity = 1) => {
  try {
    const token =  localStorage.getItem("token");

     if(token && token !== "null" && token !== "undefined") {
        console.log('🔐 User is logged in, NOT sending cartId');
      
      const response = await axios.post(
        `${BASE_URL}/add`,
        null,
        {
          params: { 
            productId, 
            quantity 
            // cartId is NOT included here
          },
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('✅ Added to cart (authenticated):', response.data);
      return response.data;
     } else {
       // 
      // ANONYMOUS USER - SEND CARTID
      // 
      const cartId = getCartId();
      console.log('👤 Anonymous user, sending cartId:', cartId);
      
      const response = await axios.post(
        `${BASE_URL}/add`,
        null,
        {
          params: { 
            cartId: cartId || '',
            productId, 
            quantity 
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Store cartId for next time
      // if (response.data.cartId) {
      //   this.setCartId(response.data.cartId);
      // }
      
      console.log('✅ Added to cart (anonymous):', response.data);
      return response.data;
     }

  } catch (error) {
    console.error('❌ Failed to add to cart:', error);
    throw error;
  }
}

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
