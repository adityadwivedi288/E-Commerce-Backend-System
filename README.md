# 🛒 E-Commerce Backend System

This is a **Node.js + Express.js + MongoDB** backend system for an E-Commerce application.  
It includes authentication, product management, cart system, order handling, and other essential features.  

---

## 🚀 Features
- User Authentication (Signup, Login, JWT, Refresh Token)
- Secure Password Hashing with **bcrypt**
- Product CRUD (Create, Read, Update, Delete)
- Categories & Subcategories
- Cart Management
- Order Placement & Tracking
- Role-based Access (Admin / User)
- File Uploads (Product Images) using **Multer**
- Secure APIs with **JWT Middleware**
- MongoDB Database with Mongoose

---

## 🛠️ Tech Stack
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT (JSON Web Tokens)**
- **bcrypt.js**
- **Multer** (file uploads)
- **dotenv** (environment variables)

---

## 📂 Project Structure
ecommerce-backend/
│── config/ # DB connection and configs
│── controllers/ # API controllers (business logic)
│── middlewares/ # Auth and other middlewares
│── models/ # MongoDB models (User, Product, Order)
│── routes/ # API routes
│── uploads/ # Uploaded product images
│── .env # Environment variables
│── .gitignore # Ignored files
│── package.json # Dependencies
│── server.js # Entry point

---
