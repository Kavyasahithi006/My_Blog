import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="text-white pt-4 pb-3" style={{ backgroundColor: "#211C84" }}>
      <div className="container text-center">
        {/* Top Section */}
        <div className="row mb-3">
          {/* About Section */}
          <div className="col-md-4">
            <h5 style={{ color: "#B5A8D5" }}>About My Blog</h5>
            <p style={{ fontSize: "14px" }}>
              My Blog is a platform to share knowledge, insights, and experiences across various domains. Join us to
              explore new perspectives and ideas.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4">
            <h5 style={{ color: "#B5A8D5" }}>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" className="text-decoration-none text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-decoration-none text-white">
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to="/signin" className="text-decoration-none text-white">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4">
            <h5 style={{ color: "#B5A8D5" }}>Get in Touch</h5>
            <p>
              ✉️ Email: <a href="kavyasahithi2006@gmail.com" className="text-white text-decoration-none">kavyasahithi2006@gmail.com</a> <br />
              📞 Phone: +91 8330980217
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <hr style={{ borderColor: "#7A73D1" }} />
        <p className="mb-0" style={{ fontSize: "14px", color: "#B5A8D5" }}>
          &copy; {new Date().getFullYear()} My Blog | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default Footer;
