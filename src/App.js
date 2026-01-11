import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList";
import AddProduct from "./pages/AddProduct";
import Navbar from "./components/Navbar";
import EditProduct from "./pages/EditProduct";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { useState, useEffect } from "react";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { getCartWithCartId, getCartWithToken } from "./services/cartService";



function App() {

  const [cartCount, setCartCount] = useState(0);

  // 🔥 Load cart count on app load
  const loadCartCount = () => {
    // getCart()
    //   .then(res => {
    //     const count = res.data.items.reduce(
    //       (sum, item) => sum + item.quantity,
    //       0
    //     );
    //     setCartCount(count);
    //   })
    //   .catch(() => setCartCount(0));


    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    console.log("Token ==> " + token + "cartId ==>" +cartId);

    if (token && token !== "null" && token !== "undefined") {

      // ✅ USER MODE
      getCartWithToken()
        .then(res => {
          const count = res.data.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    } else if (cartId) {
      // ✅ GUEST MODE
      getCartWithCartId(cartId)
        .then(res => {
          const count = res.data.items.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          setCartCount(count);
        })
        .catch(() => setCartCount(0));
    } else {
      // ✅ NO CART YET
      setCartCount(0);
    }

  };

  useEffect(() => {
    loadCartCount();
  }, []);


  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} />

      <Routes>

        <Route
          path="/"
          element={<ProductList refreshCart={loadCartCount} />}
        />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/edit-product/:id" element={<EditProduct />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/cart" element={<Cart />} /> */}
        <Route path="/cart" element={<Cart refreshCart={loadCartCount} />} />
        <Route path="/checkout" element={<Checkout refreshCart={loadCartCount} />} />
        <Route path="/order-success" element={<OrderSuccess />} />

      </Routes>


    </BrowserRouter>
  );
}

export default App;
