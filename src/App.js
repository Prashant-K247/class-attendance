import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useParams
} from "react-router-dom";

// Dummy user data
const dummyUsers = {
  Amit_Gupta: "Amit123"
};

// Updated dummy schedule
const dummySchedule = {
  Monday: ["CSE 1 - DBMS", "IT 2 - OOPS"],
  Tuesday: ["CSE 2 - OOPS", "IT 1 - DBMS"],
  Wednesday: ["CSE 1 - OOPS", "IT 2 - DBMS"],
  Thursday: ["CSE 2 - DBMS", "IT 1 - OOPS"],
  Friday: ["CSE 1 - DBMS", "CSE 2 - OOPS", "IT 1 - OOPS"]
};

// Updated students based on department-class mapping
const dummyStudents = {
  "CSE 1 - DBMS": ["Alice", "Bob", "Charlie"],
  "CSE 2 - OOPS": ["David", "Eve", "Frank"],
  "CSE 1 - OOPS": ["Alice", "Bob", "Charlie"],
  "CSE 2 - DBMS": ["David", "Eve", "Frank"],
  "IT 1 - DBMS": ["Mia", "Nate", "Olivia"],
  "IT 2 - DBMS": ["Paul", "Quincy", "Rachel"],
  "IT 1 - OOPS": ["Mia", "Nate", "Olivia"],
  "IT 2 - OOPS": ["Paul", "Quincy", "Rachel"]
};

// Login Page
const AuthPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (dummyUsers[username] === password) {
      navigate("/schedule");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <a href="#" className="forgot-password">Forgot Password?</a>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

// Schedule Page
const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekday = selectedDate.toLocaleDateString("en-US", { weekday: "long" });
  const classesToday = dummySchedule[weekday] || [];

  return (
    <div className="schedule-container">
      <h2>Classes on {weekday} ({selectedDate.toDateString()})</h2>

      {/* Date Picker */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Select Date:&nbsp;</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          className="datepicker"
        />
      </div>

      <ul>
        {classesToday.length === 0 ? (
          <li>No classes on this day</li>
        ) : (
          classesToday.map((cls) => (
            <li key={cls} onClick={() => navigate(`/class/${encodeURIComponent(cls)}`)} style={{ cursor: "pointer" }}>
              {cls}
            </li>
          ))
        )}
      </ul>

      <button onClick={() => navigate("/history")}>View Attendance History</button>
    </div>
  );
};

// Class Attendance Page
const ClassPage = () => {
  const { className } = useParams();
  const decodedClassName = decodeURIComponent(className);
  const students = dummyStudents[decodedClassName] || [];

  const [attendance, setAttendance] = useState(
    students.reduce((acc, student) => ({ ...acc, [student]: false }), {})
  );

  const handleCheckboxChange = (student) => {
    setAttendance((prev) => ({ ...prev, [student]: !prev[student] }));
  };

  const handleSubmit = () => {
    const date = new Date().toLocaleDateString();
    const newRecord = {
      className: decodedClassName,
      date,
      attendance,
    };
    const existingRecords = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");
    const updatedRecords = [...existingRecords, newRecord];
    localStorage.setItem("attendanceHistory", JSON.stringify(updatedRecords));
    alert("Attendance submitted!");
  };

  return (
    <div className="class-container">
      <h2>{decodedClassName} Attendance</h2>
      <ul>
        {students.map((student) => (
          <li key={student}>
            <label>
              <input
                type="checkbox"
                checked={attendance[student]}
                onChange={() => handleCheckboxChange(student)}
              />
              {student}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Submit Attendance</button>
    </div>
  );
};

// Attendance History Page
const HistoryPage = () => {
  const history = JSON.parse(localStorage.getItem("attendanceHistory") || "[]");

  return (
    <div className="attendance-history">
      <h2>Attendance History</h2>
      {history.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Present Students</th>
              <th>Absent Students</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record, idx) => {
              const present = Object.entries(record.attendance)
                .filter(([_, marked]) => marked)
                .map(([name]) => name);
              const absent = Object.entries(record.attendance)
                .filter(([_, marked]) => !marked)
                .map(([name]) => name);

              return (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td>{record.className}</td>
                  <td>{present.join(", ")}</td>
                  <td>{absent.join(", ")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

// App Wrapper
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/class/:className" element={<ClassPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;