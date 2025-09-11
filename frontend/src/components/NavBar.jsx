import React from "react";
import { Link } from "react-router";

const NavBar = () => {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <div className="collapse navbar-collapse navbar-customs" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/trades">
                Trade Requests
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cards">
                Card List
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
