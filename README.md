# KisanStore - Fertilizer & Seed Management System

A high-performance MERN (MongoDB, Express, React, Node.js) stack application designed for Fertilizer Dealers and Farmers.

## 🚀 Key Features

*   **Farmer Portal**: Catalog browsing, secure purchase lifecycle, and soil report management.
*   **Admin Command Center**: Real-time sales analytics, inventory CRUD, and order fulfillment.
*   **Audit Subsystem**: Comprehensive functional and visual verification suite using Playwright.
*   **Security**: Rate-limiting, Helmet headers, and HTTP-only cookie-based authentication.

## 📁 Repository Structure

*   `/Frontend`: React + Vite application (UI/UX).
*   `/Backend`: Node.js + Express API (Business logic).
*   `/screenshots_admin`: Evidence of the latest administrative audit.
*   `Backend/*_v2.js`: Finalized verification scripts for the production-ready state.

## 🛠️ Getting Started

### 1. Prerequisites
*   Node.js (v18+)
*   MongoDB running locally on port 27017

### 2. Setup Backend
```bash
cd Backend
npm install
# Ensure .env is populated with MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Setup Frontend
```bash
cd Frontend
npm install
npm run dev
```

### 4. Run Audits
```bash
cd Backend
node final_integrity_check_v2.js
node admin_visual_audit_v2.js
```

## 📜 License
ISC License
