import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* toggle button */}
      <button className="menu-toggle" onClick={toggleSidebar}>
        <i className={`fas fa-${isOpen ? 'times' : 'bars'}`}></i>
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? '' : 'closed'}`}>
        <div className="menu">
          <ul>
            <li className="active">
              <Link to="/monitoring">Monitoring</Link>
            </li>
            <li>
              <Link to="/chart">Grafik</Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
