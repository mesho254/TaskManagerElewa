import React from 'react';
import { Card, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import { logout } from '../utils/auth';

const Home = () => {
  const navigate = useNavigate();

  const user = localStorage.getItem('token') !== null;
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderDashboardLink = () => {
    switch (role) {
      case 'admin':
        return (
          <Link to="/adminDashboard">
            <Button type="primary" size="large" style={{ marginRight: 10 }}>
              Go to AdminDashboard
            </Button>
          </Link>
        );
      case 'manager':
        return (
          <Link to="/managerDashboard">
            <Button type="primary" size="large" style={{ marginRight: 10 }}>
              Go to ManagerDashboard
            </Button>
          </Link>
        );
      case 'employee':
        return (
          <Link to="/employeeDashboard">
            <Button type="primary" size="large" style={{ marginRight: 10 }}>
              Go to EmployeeDashboard
            </Button>
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="home-content">
          <h1>Welcome to ElewaTaskManager</h1>
          <p>This is a simple and amazing app for Assigning Tasks to Employees efficiently.</p>
          {user ? (
            <div>
              <h1>Logged In as: {email} ({role})</h1>
              {renderDashboardLink()}
              <Button variant="contained" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Card className="home-card" bordered={false}>
              <div className="card-header"></div>
              <Link to="/login">
                <Button type="primary" size="large" className="home-button">
                  Login
                </Button>
              </Link>
              <span className="or-divider">or</span>
              <Link to="/signup">
                <Button type="default" size="large" className="home-button">
                  Sign Up
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
