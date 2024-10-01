import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Grafik from '../components/Grafik';
import './chartpage.css';

const ChartPage = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="dashboard">
        <div className="main-content">
          <h1>Grafik Data Sensor</h1>
          <Grafik />
        </div>
      </div>
    </div>
  );
};

export default ChartPage;
