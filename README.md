# E-Commerce Web Application (MERN Stack - MVC Architecture)

This repository houses a full-featured e-commerce web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) following the **MVC (Model-View-Controller)** architecture. This project is designed to be modular, scalable, and easily maintainable, supporting the following key features:

## Features

- **User Authentication & Authorization**: Secure login, registration, and access management using JWTs and OAuth options.
- **Admin Panel**: An exclusive, accessible panel for managing products, categories, users, and orders with real-time data updates.
- **Product Management**: Allows admins to add, categorize, and update product details with full CRUD operations.
- **Shopping Cart & Checkout**: Provides users with a seamless shopping experience, including cart management, order placement, and payment integration.
- **Offers, Coupons & Discounts**: Dynamic handling of promotions and discount codes, configurable through the admin panel.
- **Responsive Design**: Built to provide an optimal experience across devices using a modern frontend design.

## Architecture Overview

This e-commerce application is structured into two primary parts: `backend` and `frontend`, following the MVC (Model-View-Controller) architecture.

- **Backend** (`/backend`): Built with Node.js and Express, this section handles server-side logic, including API routes, authentication, database interactions, and core application functionality.
- **Frontend** (`/frontend`): Developed with React and Vite, the frontend provides a responsive and interactive user interface. Styling is managed with Tailwind CSS for a modern, mobile-friendly design.

Each part of the application is organized to maximize modularity, scalability, and ease of maintenance, enabling seamless interaction between the frontend and backend while keeping a clean separation of concerns.

## Key Technologies & Tools

- **MongoDB**: For data storage and efficient querying.
- **Express.js**: For server-side API logic and middleware handling.
- **React**: For a responsive, interactive user interface.
- **Node.js**: For the backend runtime environment.
- **Tailwind CSS**: For clean, responsive design.
- **JWT (JSON Web Token)**: For secure authentication and authorization management.
- **RBAC (Role-Based Access Control)**: To enforce different access levels for users and admins.
- **PayPal Integration**: Provides secure online payment handling.
- **Nodemailer**: For sending transactional emails, such as order confirmations or password resets.
- **TanStack Query (React Query)**: For efficient server-state management and data fetching on the frontend.
- **Redux Toolkit**: Simplifies state management for complex applications.
- **React Toastify**: For customizable toast notifications.
- **Cloudinary**: Optimized image storage, management, and delivery with transformation options.
- **Multer**: For handling image uploads.
- **Formik & Yup**: For robust form validation and handling.

## Setup & Deployment

1. **Install Dependencies**: Run `npm install` in both the root and client directories.
2. **Environment Variables**: Configure environment files for MongoDB URI, JWT secret, and other API keys.
3. **Run the Application**: Use `npm run dev` to start both the client and server concurrently.

This application is an ideal foundation for anyone looking to build or extend a scalable e-commerce platform.
