import React, { useState, useEffect } from 'react';
import './maincontent.css';
import Widget from './Widget';
import { database, ref, onValue } from '../Firebase/Firebase';

const MainContent = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [anemometer, setAnemometer] = useState(0);
  const [batteryCurrent, setBatteryCurrent] = useState(0);
  const [windTurbineCurrent, setWindTurbineCurrent] = useState(0);
  const [batteryVoltage, setBatteryVoltage] = useState(0);
  const [windTurbineVoltage, setWindTurbineVoltage] = useState(0);

  useEffect(() => {
    const fetchSensorData = () => {
      const sensorDataRef = ref(database, 'data_baterai'); 
      onValue(sensorDataRef, (snapshot) => {
        const data = snapshot.val();
        console.log("Data received from Firebase:", data);

        if (data) {
          const latestEntry = Object.values(data).pop();
          console.log("Latest data entry:", latestEntry);

          setAnemometer(latestEntry?.kecepatan_meter_per_detik ? latestEntry.kecepatan_meter_per_detik.toFixed(2) : 0);
          setBatteryCurrent(latestEntry?.arus_baterai ? latestEntry.arus_baterai.toFixed(2) : 0);
          setWindTurbineCurrent(latestEntry?.arus_wind_turbine ? latestEntry.arus_wind_turbine.toFixed(2) : 0);
          setBatteryVoltage(latestEntry?.tegangan_baterai_1 ? latestEntry.tegangan_baterai_1.toFixed(2) : 0);
          setWindTurbineVoltage(latestEntry?.tegangan_baterai_2 ? latestEntry.tegangan_baterai_2.toFixed(2) : 0);
        }
      });
    };

    fetchSensorData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="main-content">
      <div id="dateTimeBox" className="date-time-box">
        {currentTime.toLocaleTimeString()}
      </div>
      <section className="widgets">
        <Widget title="Anemometer" value={anemometer} unit="m/s" id="anemometerValue" />
        <Widget title="Arus Baterai" value={batteryCurrent} unit="A" id="batteryCurrentValue" />
        <Widget title="Arus Wind Turbine" value={windTurbineCurrent} unit="A" id="windTurbineCurrentValue" />
        <Widget title="Tegangan Baterai" value={batteryVoltage} unit="V" id="batteryVoltageValue" />
        <Widget title="Tegangan Wind Turbine" value={windTurbineVoltage} unit="V" id="windTurbineVoltageValue" />
      </section>
    </main>
  );
};

export default MainContent;
