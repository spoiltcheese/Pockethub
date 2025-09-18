import React, { useContext } from "react";
import { Link } from "react-router";
import UserContext from "../context/user";

const NavBar = () => {
  const userCtx = useContext(UserContext);
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <Link className="navbar-brand" to="/">
            Pockethub
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse navbar-customs"
            id="navbarNav"
          >
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
                    My Trades
                  </Link>
                ) : null}
              </li>
              {userCtx.role === "admin" ? (
                <li className="nav-item">
                  <Link className="nav-link" to="/allusers">
                    All Users
                  </Link>
                </li>
              ) : null}
              <li className="nav-item">
                {localStorage.getItem("currentUserID") ? (
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                ) : null}
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default NavBar;
