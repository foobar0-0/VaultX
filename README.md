VaultX
Overview
VaultX is a secure file storage application that allows users to store, manage, and retrieve files from any location with an internet connection. The application is built with a robust backend and a user-friendly frontend, ensuring data security, integrity, and ease of access.

Features
User Authentication: Secure login and registration using JWT tokens.
File Upload & Download: Users can upload files to and download files from AWS S3 storage.
File Encryption: Files are encrypted for additional security.
Account Management: Users can manage their accounts, reset passwords, and delete their accounts.
Secure Access: Data and file access are protected with strong authentication and authorization measures.

Project Structure
VaultX
│
├── backend
│   ├── controllers
│   │   └── userControllers.js
│   ├── middleware
│   │   └── auth.js
│   ├── models
│   │   ├── File.js
│   │   └── User.js
│   ├── node_modules
│   ├── routes
│   │   ├── auth.js
│   │   ├── files.js
│   │   └── user.js
│   ├── .env
│   ├── index.js
│   └── package.json
│
├── frontend
│   ├── assets
│   ├── auth.html
│   ├── auth.js
│   ├── index.html
│   ├── index.js
│   ├── settings.html
│   ├── settings.js
│   └── style.css
│
└── .gitignore

Installation

Node.js (v14+)
MongoDB (For user and file metadata storage)
AWS Account (For S3 storage)

Steps

Clone the Repository:
git clone https://github.com/yourusername/vaultx.git
cd vaultx

Backend Setup:
Navigate to the backend directory:
cd backend
Install the required dependencies:
npm install
Create a .env file and configure your environment variables:
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
S3_BUCKET_NAME=your_s3_bucket_name
Start the backend server:
npm start

Frontend Setup:
No additional setup is required for the frontend.
Simply open the HTML files (index.html, auth.html, settings.html) in a browser or serve them using a static server for a better experience.

Usage
Registration & Login: Users can register and log in through the auth.html page.
File Upload/Download: Users can upload and download files securely from the index.html page.
Account Management: Users can manage their accounts from the settings.html page, including password reset and account deletion.

System Architecture
The system architecture of VaultX is divided into three main components:
Frontend: Provides the user interface and handles client-side operations.
Backend: Manages server-side operations, including authentication, file management, and communication with external services.
External Services: AWS S3 for file storage and MongoDB for user and file metadata storage.

Security Measures
JWT Authentication: Ensures secure communication between the client and server.
Encrypted File Storage: Files are encrypted before being stored on AWS S3.
Middleware Protection: Authentication middleware to protect routes and data.
