# 📸 Instabook (Backend) - Social Media Platform

## 🚀 Project Overview

Instabook is a full-featured social media platform built with modern web technologies, offering a comprehensive social networking experience.

### 🔧 Tech Stack

- **Backend:**
  - Express.js
  - Node.js
- **Database:**
  - MySQL
  - Sequelize ORM
- **Real-time Communication:**
  - Socket.io
- **Authentication:**
  - JWT
  - Two-Factor Authentication
- **Security:**
  - bcrypt
  - Helmet
  - Express-rate-limit

## 📦 Features

### User Management

- User Registration and Authentication
- Profile Creation and Customization
- Two-Factor Authentication
- Role-based Access Control

### Social Features

- Post Creation and Sharing
- Follow/Unfollow Functionality
- Like and Comment System
- Direct Messaging
- Real-time Notifications

### Additional Capabilities

- Image Upload
- Hashtag Support
- Activity Tracking

## 🛠 Installation

### Prerequisites

- Node.js (v16+ recommended)
- MySQL
- npm or yarn

### Steps to Setup

1. Clone the repository

   ```bash
   git clone https://github.com/Sandeep-Petwal/insta_server
   cd instabook-server
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create .env file

   ```env
   PORT = 3005
   SERVER_URL =
   CLIENT_URL =

   JWT_SECRET =
   SMTP_SERVER = smtp.gmail.com
   SMTP_PORT= 587

   SMTP_USER =
   SMTP_PASSWORD =
   CLOUDINARY_CLOUD_NAME =
   CLOUDINARY_API_KEY =
   CLOUDINARY_API_SECRET =
   DATABASE =
   DATABASE_USERNAME =
   DATABASE_PASSWORD =
   DATABASE_HOST =
   DATABASE_DIALECT =mysql
   ```


4. Start the server

   ```bash
   # Development mode
   npm run st

   # Production mode
   npm start
   ```

## 🔒 Environment Configuration

- `PORT`: Server running port
- `JWT_SECRET`: Secret for JSON Web Token
- `SOCKET_SECRET`: Secret for Socket.io connections



## 📊 Project Structure

```
insta_server/
│
├── ADMIN/              # Admin related files
├── config/             # Configuration files
├── controller/         # Route controllers
├── database/          # Database related files
├── middleware/        # Custom middlewares
├── model/             # Database models
├── node_modules/      # Project dependencies
├── routes/            # API route definitions
├── socket/            # Socket.io related files
├── temp/             # Temporary files / Features
├── uploads/          # File upload directory + now Cloudinary
├── util/             # Utility functions
│
├── .env              # Environment variables
├── index.js         # Main application file

```

## 🔍 Monitoring & Logging

- Winston for logging

## 🚨 Error Handling

- Centralized error handling
- Detailed error logging
- Secure error responses

## 🔐 Security Measures

- Rate limiting
- CORS configuration
- Helmet for secure HTTP headers
- Input validation
- Two-factor authentication
- JWT token management

## 📈 Performance Optimization

- Efficient database queries
- Pagination support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📞 Contact

Sandeep Prasad - sandeepprasad.tech

Project Link: https://github.com/Sandeep-Petwal/instabook-server
