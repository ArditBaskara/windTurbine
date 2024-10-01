import React from 'react';
import "./navbar.css";
import { useLocation } from "react-router-dom";
import { auth } from "../Firebase/Firebase";

const Navbar = () => {
  const location = useLocation();
  const routePath = location.pathname;

  // Default image URL in case the user's photoURL is not available
  const defaultImageUrl = "/path/to/default-avatar.png";
  const userProfileImage = auth?.currentUser?.photoURL || defaultImageUrl;
  const userName = auth?.currentUser?.displayName || 'User';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a className="navbar-logo">Monitoring Wind Turbine</a>
        {routePath === "/" ? null : (
          <div className="user-profile">
            <img
              src={userProfileImage}
              alt="user-profile"
              className="user-profile-image"
            />
            <h6>{userName}</h6>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
