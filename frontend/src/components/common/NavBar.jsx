import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import "./NavBar.css";

function NavBar() {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Inflation Tracker
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Categories
            </NavLink>
          </li>

          {currentUser ? (
            <>
              <li className="nav-item">
                <NavLink
                  to="/preferences"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  My Preferences
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/notifications"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Notifications
                </NavLink>
              </li>
              <li className="nav-item user-section">
                <span className="user-email">{currentUser.email}</span>
                <button onClick={logout} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Login
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
