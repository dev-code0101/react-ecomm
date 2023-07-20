import React from "react";
import ReactDOM from "react-dom/client";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";

import { Home, Product, Products, Cart, Checkout, PageNotFound } from "./pages";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/*" element={<PageNotFound />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
