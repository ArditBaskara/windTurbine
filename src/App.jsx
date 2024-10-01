import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Intro from './components/Intro';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MonitoringPage from './components/MonitoringPage';
import ChartPage from './components/ChartPage'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          {isLoggedIn && <Sidebar />}
          <div className={`content ${isLoggedIn ? 'with-sidebar' : ''}`}>
            <Routes>
              <Route
                path="/"
                element={<Intro onLogin={handleLogin} />}
              />
              <Route
                path="/monitoring"
                element={
                  isLoggedIn ? <MonitoringPage /> : <Navigate to="/" />
                }
              />
              <Route
                path="/chart"
                element={
                  isLoggedIn ? <ChartPage /> : <Navigate to="/" />
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
