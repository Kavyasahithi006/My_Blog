import React, { useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthorProfile = () => {
  const { email } = useParams(); 
  const [hovered, setHovered] = useState(null); 

  return (
    <div
      className="p-5 text-center"
      style={{
        backgroundColor: "#B5A8D5", 
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        animation: "fadeIn 0.8s ease-in-out", 
      }}
    >
      {/* Header */}
      <h2 className="mb-4" style={{ color: "#211C84", fontWeight: "bold" }}>
        Author Dashboard
      </h2>

      {/* Navigation Buttons */}
      <ul className="d-flex justify-content-center list-unstyled gap-4">
        <li className="nav-item">
          <NavLink
            to={`/author-profile/${email}/articles`}
            className="btn"
            style={{
              backgroundColor: hovered === "articles" ? "#4D55CC" : "#211C84",
              color: "#fff",
              padding: "12px 20px",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "0.3s ease-in-out",
              borderRadius: "8px",
            }}
            onMouseEnter={() => setHovered("articles")}
            onMouseLeave={() => setHovered(null)}
          >
            Articles
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to={`/author-profile/${email}/article`}
            className="btn"
            style={{
              backgroundColor: hovered === "newArticle" ? "#7A73D1" : "#4D55CC",
              color: "#fff",
              padding: "12px 20px",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "0.3s ease-in-out",
              borderRadius: "8px",
            }}
            onMouseEnter={() => setHovered("newArticle")}
            onMouseLeave={() => setHovered(null)}
          >
            Add New Article
          </NavLink>
        </li>
      </ul>

      {/* Nested Route Rendering */}
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthorProfile;
