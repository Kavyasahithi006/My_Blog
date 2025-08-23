import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function UserProfile() {
  return (
    <div className="container-fluid py-4">
      {/* Large User Profile Card */}
      <div className="card shadow mb-4">
        <div className="card-body text-center">
          <h2 className="card-title">User Dashboard</h2>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="bg-light shadow-sm mb-4 rounded">
        <ul className="d-flex justify-content-around list-unstyled mb-0 py-3">
          <li className="nav-item">
            <Link to="articles" className="nav-link fs-4 text-primary">Articles</Link>
          </li>
        </ul>
      </div>
      
      {/* Content Section */}
      <div className="card shadow">
        <div className="card-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserProfile;