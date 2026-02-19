import {v4 as uuidv4} from "uuid";

export const getCartId = () => {
    let cartId = localStorage.getItem("cartId");

    if(!cartId) {
        cartId = uuidv4();
        localStorage.setItem("cartId",cartId);
    }

    return cartId;
}