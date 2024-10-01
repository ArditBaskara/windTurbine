import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { database, ref, onValue } from '../Firebase/Firebase';  // Import dari file konfigurasi Firebase

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Grafik = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [
      { label: 'Anemometer (m/s)', data: [], borderColor: '#8884d8', fill: false },
      { label: 'Baterai (%)', data: [], borderColor: '#82ca9d', fill: false },
      { label: 'Arus Baterai (A)', data: [], borderColor: '#ffc658', fill: false },
      { label: 'Arus Wind Turbine (A)', data: [], borderColor: '#ff7300', fill: false },
      { label: 'Tegangan Baterai (V)', data: [], borderColor: '#387908', fill: false },
      { label: 'Tegangan Wind Turbine (V)', data: [], borderColor: '#1f77b4', fill: false },
    ],
  });

  useEffect(() => {
    const fetchData = () => {
      const dataRef = ref(database, '/data_baterai'); // Path yang sesuai
      onValue(dataRef, (snapshot) => {
        const dataFromFirebase = snapshot.val();
        console.log("Data dari Firebase:", dataFromFirebase); // Log data dari Firebase
  
        if (dataFromFirebase) {
          const labels = [];
          const anemometer = [];
          const batteryPower = [];
          const batteryCurrent = [];
          const windTurbineCurrent = [];
          const batteryVoltage = [];
          const windTurbineVoltage = [];
  
          // Iterasi melalui objek data
          Object.keys(dataFromFirebase).forEach(key => {
            const entry = dataFromFirebase[key];
            console.log(`Entry ${key}:`, entry); // Log setiap entry
  
            labels.push(entry.time);
            anemometer.push(entry.anemometer);
            batteryPower.push(entry.batteryPower);
            batteryCurrent.push(entry.batteryCurrent);
            windTurbineCurrent.push(entry.windTurbineCurrent);
            batteryVoltage.push(entry.batteryVoltage);
            windTurbineVoltage.push(entry.windTurbineVoltage);
          });
  
          console.log("Labels:", labels); // Log labels
          console.log("Anemometer data:", anemometer); // Log data
          console.log("Battery Power data:", batteryPower);
          console.log("Battery Current data:", batteryCurrent);
          console.log("Wind Turbine Current data:", windTurbineCurrent);
          console.log("Battery Voltage data:", batteryVoltage);
          console.log("Wind Turbine Voltage data:", windTurbineVoltage);
  
          setData({
            labels: labels,
            datasets: [
              { label: 'Anemometer (m/s)', data: anemometer, borderColor: '#8884d8', fill: false },
              { label: 'Baterai (%)', data: batteryPower, borderColor: '#82ca9d', fill: false },
              { label: 'Arus Baterai (A)', data: batteryCurrent, borderColor: '#ffc658', fill: false },
              { label: 'Arus Wind Turbine (A)', data: windTurbineCurrent, borderColor: '#ff7300', fill: false },
              { label: 'Tegangan Baterai (V)', data: batteryVoltage, borderColor: '#387908', fill: false },
              { label: 'Tegangan Wind Turbine (V)', data: windTurbineVoltage, borderColor: '#1f77b4', fill: false },
            ],
          });
        }
      });
    };
  
    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sensor Data',
      },
    },
  };

  return <Line data={data} options={chartOptions} />;
};

export default Grafik;
