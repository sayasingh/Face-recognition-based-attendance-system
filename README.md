# Face-recognition-based-attendance-system

This is a Face Detection & Recognition Attendance System built using:

  -React.js (Frontend)
  
  -Node.js + Express (Backend)
  
  -MongoDB (Database)
  
  -Flask + Python + OpenCV (Recognition Module)
  
The system detects faces using Haarcascade and recognizes them using LBPH, then marks attendance automatically.



Features:

  -Face registration with image upload
  
  -Live face detection from webcam
  
  -LBPH-based face recognition
  
  -Automatic attendance marking
  
  -Admin dashboard (view students + attendance)
  
  -MERN + Flask integration
  
  -Works offline on local network


Tech Used:

Frontend: React, Axios

Backend: Node.js, Express

Recognition: Python, Flask, OpenCV, Haarcascade, LBPH

Database: MongoDB


How It Works:

1) User registers → uploads face image

2) Backend sends image to Flask

3) Flask saves image → updates dataset → retrains LBPH

4) When taking attendance:

     Webcam opens

     Flask recognizes face

     Node.js stores attendance in MongoDB
