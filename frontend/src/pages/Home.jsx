import React from 'react';
import { Card, Button } from 'antd';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';


const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home-page">
        <div className="home-content">
          <h1>Welcome to ElewaTaskManager</h1>
          <p>This is a simple and amazing app for Assigning Tasks to Employees efficiently.</p>
          <Card className="home-card" bordered={false}>
            <div className="card-header">
            <a href="/adminLogin" target="_blank" rel="noopener noreferrer">
                <Button type="link" className="admin-button">Admin Panel</Button>
              </a>
            </div>
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
        </div>
      </div>
    </>
  );
};

export default Home;
