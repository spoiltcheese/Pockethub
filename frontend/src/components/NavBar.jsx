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

            <li className="nav-item">
              <Link className="nav-link" to="/newtrade">
                New Trade
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/register">
                Register
              </Link>
            </li>

            <li className="nav-item">
              {localStorage.getItem("currentUserID") ? (
                <Link className="nav-link" to="/mytrades">
                  My Trades {`(${localStorage.getItem("currentUserID")})`}
                </Link>
              ) : null}
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/allusers">
                All Users
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
