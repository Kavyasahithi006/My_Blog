import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";
import { UserAuthorContextObj } from "../../contexts/UserAuthorContext";

function Header() {
  const { signOut } = useClerk();
  const { isSignedIn, user, isLoaded } = useUser();
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const navigate = useNavigate();

  async function handleSignout() {
    await signOut();
    setCurrentUser(null);
    navigate("/");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow" style={{ backgroundColor: "#211C84" }}>
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT68Djyr_FLi1kiWs1dfnTrfYsCJGAShjLgPw&s"
            alt="Logo"
            width="50px"
            className="ms-4 rounded-circle"
          />
          <span className="ms-2 fw-bold text-white">My Blog</span>
        </Link>

        {/* Toggle Button for Mobile View */}
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

        {/* Navigation Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            {!isSignedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link text-white fw-semibold hover-effect">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signin" className="nav-link text-white fw-semibold hover-effect">
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link text-white fw-semibold hover-effect">
                    Sign Up
                  </Link>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  <img
                    src={user.imageUrl}
                    width="40px"
                    className="rounded-circle border border-light"
                    alt="User"
                  />
                  <p
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-light text-dark"
                    style={{ fontSize: "12px" }}
                  >
                    {currentUser.role}
                  </p>
                </div>
                <p className="mb-0 text-white fw-semibold me-3">{user.firstName}</p>
                <button className="btn btn-danger btn-sm" onClick={handleSignout}>
                  Sign Out
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
