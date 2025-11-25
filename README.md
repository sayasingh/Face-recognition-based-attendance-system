Face Recognition Based Attendance System

A Face Detection & Recognition Attendance System built using:

React.js (Frontend)

Node.js + Express (API Backend)

MongoDB (Database)

Flask + Python + OpenCV (Face Recognition Module)

The system detects faces (Haarcascade), recognizes them (LBPH), and marks attendance automatically.

Features

✔️ Student Registration with Face Capture

✔️ Live Camera Detection Using OpenCV

✔️ LBPH-based Face Recognition

✔️ Automatic Attendance Marking

✔️ Admin Dashboard & Student Dashboard

✔️ Separate Teacher Dashboard

✔️ Daily & Last 7 Days Attendance View

✔️ MERN + Flask Integration

✔️ Works on Local Network

 System Architecture
React (Frontend)
      │
      │ HTTP (Axios)
      ▼
Node.js + Express (Backend API)
      │
      │ REST API Communication
      ▼
Flask (Python/OpenCV Recognition Module)
      │
      ▼
MongoDB (User + Attendance Storage)

Technologies Used
Frontend

React.js

Axios

CSS

Backend

Node.js

Express.js

MongoDB / Mongoose

Recognition Module

Python

Flask

OpenCV

Haarcascade

LBPH Face Recognizer

Project Structure
/frontend          → React User Interface
/backend           → Node.js API
/recognition       → Flask + OpenCV Face Recognition
/dataset           → Stored training images
/model             → LBPH trained model file


How the System Works

Registration

User enters details → uploads face image

Image sent to Flask → saved in dataset

LBPH model retrains

Attendance

React opens camera → sends frame to Flask

Flask predicts user ID

Node.js saves attendance record in MongoDB

Dashboard

Admin/Teacher/Student sees real-time attendance data




Add anti-spoofing (blink detection)

Add mobile app version

Multi-classroom real-time monitoring

Cloud deployment (AWS / Render)
