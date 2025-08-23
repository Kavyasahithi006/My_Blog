import { useContext, useEffect, useState } from "react";
import { UserAuthorContextObj } from "../../contexts/UserAuthorContext";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

function Home() {
  const { currentUser, setCurrentUser } = useContext(UserAuthorContextObj);
  const { isSignedIn, user, isLoaded } = useUser();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSelectRole(e) {
    setError("");
    setLoading(true);
    const selectedRole = e.target.value;

    try {
      if (!currentUser) {
        throw new Error("User data is missing.");
      }

      const updatedUser = {
        ...currentUser,
        role: selectedRole,
      };

      let res;
      const roleEndpoints = {
        author: "http://localhost:3000/author-api/author",
        user: "http://localhost:3000/user-api/user",
        admin: "http://localhost:3000/admin-api/admin",
      };

      if (roleEndpoints[selectedRole]) {
        res = await axios.post(roleEndpoints[selectedRole], updatedUser);
      } else {
        throw new Error("Invalid role selection.");
      }

      let { message, payload } = res.data;
      if (message === selectedRole) {
        setCurrentUser(payload);
        localStorage.setItem("currentuser", JSON.stringify(payload));
      } else {
        setError(message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isSignedIn && user) {
      setCurrentUser((prevUser) => ({
        ...prevUser,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        profileImageUrl: user.imageUrl,
      }));
    }
  }, [isSignedIn, user, setCurrentUser]);

  useEffect(() => {
    if (!error && currentUser?.role) {
      if (!currentUser.isActive) {
        alert("Your account is blocked. Please contact the admin.");
        return;
      }
  
      const roleRoutes = {
        user: `/user-profile/${currentUser.email}`,
        author: `/author-profile/${currentUser.email}`,
        admin: `/admin-profile`,
      };
  
      if (roleRoutes[currentUser.role]) {
        navigate(roleRoutes[currentUser.role]);
      }
    }
  }, [currentUser?.role, currentUser?.isActive, error, navigate]);
  

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 text-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/4402584/pexels-photo-4402584.jpeg?auto=compress&cs=tinysrgb&w=600')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff2db",
        textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
      }}
    >
      {!isSignedIn ? (
        <div className="text-center p-5 rounded shadow-lg bg-dark bg-opacity-75 animate__animated animate__fadeIn">
          <h1 className="display-4 fw-bold text-warning animate__animated animate__slideInDown">
            Welcome to My Blog
          </h1>
          <p className="lead animate__animated animate__fadeInUp">
            Discover, write, and share inspiring stories with the world.
          </p>
          <p className="lead animate__animated animate__fadeInUp animate__delay-1s">
            Join our community of passionate writers and readers.
          </p>
          <button className="btn btn-primary px-4 py-2 shadow-lg mt-3 animate__animated animate__pulse animate__infinite">
            Get Started
          </button>
        </div>
      ) : (
        <div className="text-center p-5 rounded shadow-lg bg-dark bg-opacity-75 animate__animated animate__fadeIn">
          <div className="d-flex align-items-center justify-content-center">
            <img
              src={user.imageUrl}
              width="100px"
              className="rounded-circle border border-light shadow-lg animate__animated animate__zoomIn"
              alt="Profile"
            />
            <h2 className="ms-3 text-light animate__animated animate__fadeInRight">
              {user.firstName}
            </h2>
          </div>
          <p className="mt-4 fw-semibold text-warning animate__animated animate__fadeInUp">
            Select Your Role
          </p>
          {error && <p className="text-danger fs-5">{error}</p>}

          <div className="d-flex justify-content-center mt-3">
            {["author", "user", "admin"].map((role, index) => (
              <div className="form-check me-4" key={role}>
                <input
                  type="radio"
                  name="role"
                  id={role}
                  value={role}
                  className={`form-check-input animate__animated animate__bounceIn animate__delay-${index}s`}
                  onChange={onSelectRole}
                  disabled={loading}
                />
                <label htmlFor={role} className="form-check-label text-light">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </label>
              </div>
            ))}
          </div>

          {loading && <p className="text-warning mt-3">Processing...</p>}
        </div>
      )}
    </div>
  );
}

export default Home;
