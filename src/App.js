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
    console.log("Attendance submitted for:", decodedClassName);
    console.log(attendance);
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

// App Wrapper
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/class/:className" element={<ClassPage />} />
      </Routes>
    </Router>
  );
};

export default App;
