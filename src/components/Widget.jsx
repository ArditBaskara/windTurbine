import React from 'react';
import './widget.css';

const Widget = ({ title, value, unit, id, onClick }) => {
  console.log("Widget props:", { title, value, unit, id });
  return (
    <div className="widget">
      <h3>{title}</h3>
      <p id={id}>{value} {unit}</p>
    </div>
  );
};

export default Widget;
