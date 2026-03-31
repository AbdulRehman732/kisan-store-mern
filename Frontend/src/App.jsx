import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";
import GlobalStyles from "./styles/GlobalStyles";

import Navbar from "./components/Navbar";
import Home from "./pages/farmer/Home";
import Products from "./pages/farmer/Products";
import Cart from "./pages/farmer/Cart";
import PriceList from "./pages/farmer/PriceList";
import MyOrders from "./pages/farmer/MyOrders";
import Contact from "./pages/farmer/Contact";
import Login from "./pages/farmer/Login";
import Register from "./pages/farmer/Register";
import Profile from "./pages/farmer/Profile";
import Invoice from "./pages/farmer/Invoice";
import ForgotPassword from "./pages/farmer/ForgotPassword";
import ResetPassword from "./pages/farmer/ResetPassword";
import SoilRegistry from "./pages/farmer/SoilRegistry";
import CropDoctor from "./pages/farmer/CropDoctor";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminFarmers from "./pages/admin/AdminFarmers";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReviews from "./pages/admin/AdminReviews";
import SalesReport from "./pages/admin/SalesReport";

import FloatingCart from "./components/FloatingCart";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GlobalStyles />
        <HashRouter>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Home />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <Products />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Navbar />
                  <Cart />
                </>
              }
            />
            <Route
              path="/price-list"
              element={
                <>
                  <Navbar />
                  <PriceList />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <Contact />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <Register />
                </>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <>
                  <Navbar />
                  <ForgotPassword />
                </>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <>
                  <Navbar />
                  <ResetPassword />
                </>
              }
            />
            <Route
              path="/my-orders"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <MyOrders />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <Profile />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/soil-registry"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <SoilRegistry />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/crop-doctor"
              element={
                <PrivateRoute>
                  <>
                    <Navbar />
                    <CropDoctor />
                  </>
                </PrivateRoute>
              }
            />
            <Route
              path="/invoice/:id"
              element={
                <PrivateRoute>
                  <Invoice />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="farmers" element={<AdminFarmers />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="reports" element={<SalesReport />} />
            </Route>
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <div
                    style={{
                      maxWidth: "1200px",
                      margin: "0 auto",
                      padding: "60px 20px",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: "3.5rem", marginBottom: "12px" }}>
                      🔍
                    </div>
                    <h3
                      style={{
                        fontSize: "1.1rem",
                        color: "#616161",
                        marginBottom: "6px",
                      }}
                    >
                      Page Not Found
                    </h3>
                    <a
                      href="/"
                      style={{
                        display: "inline-block",
                        marginTop: "16px",
                        padding: "10px 22px",
                        background: "#2d7a47",
                        color: "white",
                        borderRadius: "10px",
                        fontWeight: "700",
                      }}
                    >
                      Go Home
                    </a>
                  </div>
                </>
              }
            />
          </Routes>
          <FloatingCart />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}


export default App;

