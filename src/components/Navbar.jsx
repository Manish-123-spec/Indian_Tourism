import React from "react";
import { Link } from "react-router-dom";
import "../App.css"; // Make sure the CSS is included

const Navbar = () => {
  return (
    <nav className="custom-navbar-light shadow-sm">
      <div className="container nav-container">
        <Link className="navbar-brand fw-bold" to="/">India Tourism</Link>

        {/* Hamburger toggle for mobile */}
        <input type="checkbox" id="nav-toggle" className="nav-toggle"/>
        <label htmlFor="nav-toggle" className="nav-toggle-label">
          <span></span>
        </label>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          {/* Gallery now redirects to Google Images */}
          <li>
            <a
              href="https://www.google.com/search?tbm=isch&q=top+tourist+places+in+india"
              target="_blank"
              rel="noopener noreferrer"
            >
              Gallery
            </a>
          </li>
          <li><Link to="/chatbot">AI Chatbot</Link></li>
           <li><Link to="/recommend">PlaceRecommender</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;