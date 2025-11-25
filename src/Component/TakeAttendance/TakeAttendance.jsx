import React, { useEffect, useState, useRef } from "react";
import "./TakeAttendance.css";
import Dashboard from "../Dashboard/Dashboard";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import CameraEnhanceOutlinedIcon from "@mui/icons-material/CameraEnhanceOutlined";
import axios from "axios";

const TakeAttendance = () => {
  const [hasCamera, setHasCamera] = useState(null);
  const [isAllowed, setIsAllowed] = useState(false);
  const [clicked, setClicked] = useState(false);
  let attendanceRecords =
    JSON.parse(localStorage.getItem("attendanceRecords")) || {};
  const [status, setStatus] = useState("");

  const userData = JSON.parse(localStorage.getItem("userData"));
  
  // 8 to 10 am samman matra click garna milni
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      if (hour === 8 || hour === 9 || (hour === 10 && minutes === 0)) {
        setIsAllowed(true);
      } else {
        setIsAllowed(false);
      }
    };
    checkTime();
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

//everyday 10 am samman take attendance vutton click garena vane absent janxa

useEffect(() => {
  const checkAbsent = () => {
    const now = new Date();
    const today10AM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      10,
      0,
      0,
      0
    );

    if (now >= today10AM) {
      // Check if user already has attendance for today
      const checkExistingAttendance = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/attendance/todayAttendance/${userData._id}`);
          if (res.data.length === 0) { // No attendance record for today
            updateStatus("Absent");
          }
        } catch (err) {
          console.error("Error checking attendance:", err);
        }
      };
      checkExistingAttendance();
    }
  };
  checkAbsent();
}, []);

//for camera 
  useEffect(() => {
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setHasCamera(videoInputs.length > 0);
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setHasCamera(false);
      }
    };

    checkCamera();
  }, []);

  // open camera
  const videoRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const updateStatus = async (newStatus) => {
    setStatus(newStatus);
    const data = {
      userId: userData._id,
      Status: newStatus,
    };
    const data2 = {
      state: "Known",
    };

    try {
      const res = await axios.post("http://127.0.0.1:5000/recognize", data2); //python recognizer chalyo
      console.log(res.data);
      if (res?.data?.detected_name === userData?.username) {
        await axios.post(
          "http://localhost:5000/attendance/takeAttendance", // node backend ma present vayo 
          data
        );
        
        alert("Attendance marked as Present");
      } else {
        
        alert(
          "logged in user and the person in front of camera does not match"
        );
        return;
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  {/* UPDATE TRY DUMMY*/}
  const updateStatus1 = async () => {
    const data2 = {
      state: "Unknown",
    };
    try {
      await axios.post("http://127.0.0.1:5000/recognize", data2);
      alert("Unregistered User!");
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleTakeAttendanceClick = async () => {
    const now = Date.now(); //aaile ko date
    if (!userData || !userData._id) {
      alert("User data not found. Please log in again.");
      return;
    }

    if (attendanceRecords[userData._id]) {
      const lastClicked = new Date(attendanceRecords[userData._id]);
      const lastDate = lastClicked.toDateString();
      const todayDate = new Date().toDateString();
      if (lastDate === todayDate) {
        alert("You can only take attendance once per day");
        return;
      }
    }
    attendanceRecords[userData._id] = now; //attendanceRecord[tony] = 9/3/2025
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords)
    );
    await updateStatus("Present");
    setClicked(true);
  };

  {/*Handle submit DUMMY*/}
  const handleSubmit2 = async () => {
    console.log("Unknown");
    const now = Date.now();

    if (attendanceRecords[userData._id]) {
      const lastClicked = new Date(attendanceRecords[userData._id]);
      const lastDate = lastClicked.toDateString();
      const todayDate = new Date().toDateString();
      // if (lastDate === todayDate) {
      //   alert("You can only take attendance once per day");
      //   return;
      // }
    }
    attendanceRecords[userData._id] = now;
    localStorage.setItem(
      "attendanceRecords",
      JSON.stringify(attendanceRecords)
    );
    await updateStatus1("Present");
    setClicked(true);
  };

  return (
    <div>
      <div className="take-attendance-container">
        <Dashboard />
        <div className="main-content">
          <div>
          {/*Practice*/}
            <button className="take-atten-2"
              // disabled={isAllowed}
              onClick={() => handleSubmit2()}
            >
              tendance
            </button>

          </div>
          <div className="top-bar">
            <div className="top-bar-title">
              <span className="section-heading">AI Attendance System</span>
              <span className="section-subtext">
                Secure, fast, and accurate attendance tracking system!
              </span>
            </div>
            <div className="top-bar-cameraCheck">
              {hasCamera === null && <span>🔍 Checking..</span>}
              {hasCamera === true && <span>🟢 Camera Ready</span>}
              {hasCamera === false && <span>🔴 No camera</span>}
            </div>
          </div>
          <div className="center-content-take-attendance">
            <div className="left-container">
              <div className="initialize-camera-container">
                <div
                  className="initialize-camera"
                  style={{ display: cameraStarted ? "none" : "flex" }}
                >
                  <div className="camera-icon">
                    <CameraAltOutlinedIcon
                      sx={{
                        fontSize: 50,
                        borderRadius: "8px",
                        padding: "4px",
                      }}
                    />
                  </div>
                  <div className="camera-text">
                    Position yourself in front of the camera.
                  </div>
                </div>
                <div
                  className="take-attendance-btn"
                  style={{ display: cameraStarted ? "none" : "flex" }}
                >
                  <CameraEnhanceOutlinedIcon sx={{ fontSize: 28 }} />

                  <button
                    style={{
                      backgroundColor: "#061536",
                      outline: "0px",
                      color: " #b9c4d4",
                      cursor: "pointer",
                      padding: "0px",
                      border: "0px",  
                      fontSize: "16px",
                    }}
                    onClick={() => handleTakeAttendanceClick()}
                    // disabled={!isAllowed}
                  >
                    Take Attendance
                  </button>
                </div>
                
                {/* Camera preview */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    maxWidth: "500px",
                    marginTop: "20px",
                    marginBottom: "3 5px",
                    border: "2px solid red",
                    background: "black",
                    zIndex: "10000",
                    display: cameraStarted ? "block" : "none",
                  }}
                />
                <div className="subtext-section">
                  <div className="face-detect">
                    <VisibilityOutlinedIcon />
                    Face Detection
                  </div>
                  <div className="face-recog">
                    <BoltOutlinedIcon />
                    Instant Recognition
                  </div>
                </div>
              </div>
            </div>

            <div className="right-container">
              <div className="howto-title">...</div>
              <div className="right-gif">
                <img
                  src="/gifs/ho-to-video.gif"
                  alt="My GIF"
                  style={{
                    width: "350px",
                    height: "275px",
                    borderRadius: "15px",
                  }}
                />
              </div>
              <div className="right-userDetails">
                <div className="username typing-text typing-delay-1">
                  User: {userData?.username} <br />
                  Email:{userData?.email} <br /> User ID: {userData?._id}
                </div>
                {/* <div className="gmail typing-text typing-delay-2">Email: rose@gmail.com</div>
                <div className="userid typing-text typing-delay-3">User ID: 28684</div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
