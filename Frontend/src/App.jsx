import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";
import GlobalStyles from "./styles/GlobalStyles";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
import AdminFarmerDetail from "./pages/admin/AdminFarmerDetail";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminExpenses from "./pages/admin/AdminExpenses";
import AdminPOS from "./pages/admin/AdminPOS";
import AdminCredit from "./pages/admin/AdminCredit";
import AdminFinances from "./pages/admin/AdminFinances";
import SalesReport from "./pages/admin/SalesReport";
import AdminSettings from "./pages/admin/AdminSettings";
import FloatingCart from "./components/FloatingCart";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <CartProvider>
            <GlobalStyles />
            <HashRouter>
              <Routes>
                {/* Farmer Routes with Navbar and Footer */}
                <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
                <Route path="/products" element={<><Navbar /><Products /><Footer /></>} />
                <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
                <Route path="/price-list" element={<><Navbar /><PriceList /><Footer /></>} />
                <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />
                <Route path="/login" element={<><Navbar /><Login /><Footer /></>} />
                <Route path="/register" element={<><Navbar /><Register /><Footer /></>} />
                <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /><Footer /></>} />
                <Route path="/reset-password/:token" element={<><Navbar /><ResetPassword /><Footer /></>} />
                
                <Route path="/my-orders" element={<PrivateRoute><Navbar /><MyOrders /><Footer /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Navbar /><Profile /><Footer /></PrivateRoute>} />
                <Route path="/soil-registry" element={<PrivateRoute><Navbar /><SoilRegistry /><Footer /></PrivateRoute>} />
                <Route path="/crop-doctor" element={<PrivateRoute><Navbar /><CropDoctor /><Footer /></PrivateRoute>} />
                <Route path="/invoice/:id" element={<PrivateRoute><Invoice /></PrivateRoute>} />

                {/* Admin Routes with AdminLayout (Internal Sidebar Navigation) */}
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="farmers" element={<AdminFarmers />} />
                  <Route path="farmers/:id" element={<AdminFarmerDetail />} />
                  <Route path="staff" element={<AdminStaff />} />
                  <Route path="accounts" element={<AdminAccounts />} />
                  <Route path="expenses" element={<AdminExpenses />} />
                  <Route path="pos" element={<AdminPOS />} />
                  <Route path="credit" element={<AdminCredit />} />
                  <Route path="finances" element={<AdminFinances />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="reports" element={<SalesReport />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                <Route path="*" element={<><Navbar /><NotFound /><Footer /></>} />
              </Routes>
              <FloatingCart />
            </HashRouter>
          </CartProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Sub-component for 404 to keep App clean
const NotFound = () => (
  <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "120px 20px", textAlign: "center" }}>
    <div style={{ fontSize: "5rem", marginBottom: "20px" }}>🔍</div>
    <h2 style={{ fontSize: "3rem", color: "var(--text-primary)", marginBottom: "12px" }}>Resource Not Discovered</h2>
    <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: "32px", fontWeight: 700 }}>The requested tactical endpoint does not exist within the current strategic matrix.</p>
    <Link to="/" style={{ display: "inline-block", padding: "18px 36px", background: "var(--primary)", color: "white", borderRadius: "10px", fontWeight: "900", textDecoration: "none", textTransform: 'uppercase', letterSpacing: '0.1em' }}>Return to Base</Link>
  </div>
);
import { Link } from "react-router-dom";

export default App;
