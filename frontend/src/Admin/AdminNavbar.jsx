import React, { useState, useEffect } from 'react';
import { Button, Menu, Dropdown, Avatar } from 'antd';
import { MenuOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { logout } from '../utils/auth';
import {jwtDecode} from 'jwt-decode';


const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null;
  const email = user ? user.email : null;
  const role = user ? user.role : null;

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const updateMobileView = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    updateMobileView();
    window.addEventListener('resize', updateMobileView);
    return () => window.removeEventListener('resize', updateMobileView);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/adminLogin');
  };

  const NavAdminDashboard = () => {
    navigate('/adminDashboard');
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" onClick={NavAdminDashboard}>
        <UserOutlined />
        <span>Admin Dashboard</span>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <LogoutOutlined />
        <span>Logout</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <img src={Logo} alt="logo" className="logo" onClick={NavAdminDashboard} />
          <div className="heading">Admin Panel</div>
        </div>
        {isMobile && (
          <div className="menu-icon" onClick={handleMenuToggle}>
            <MenuOutlined />
          </div>
        )}
        <Menu
          mode={isMobile ? 'vertical' : 'horizontal'}
          className={`custom-navbar ${menuOpen ? 'open' : ''}`}
        >
          {isMobile && role === 'admin' && (
            <Menu.Item key="user" className="user-menu-item">
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar size="large" style={{ backgroundColor: '#87d068', cursor: 'pointer' }}>
                  {email ? email[0].toUpperCase() : ''}
                </Avatar>
              </Dropdown>
            </Menu.Item>
          )}
        </Menu>
        {!isMobile && (
          <div className="auth-section">
            {role === 'admin' ? (
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar size="large" style={{ backgroundColor: '#87d068', cursor: 'pointer' }}>
                  {email ? email[0].toUpperCase() : ''}
                </Avatar>
              </Dropdown>
            ) : (
              <Button className="register-button" onClick={() => navigate('/adminLogin')}>
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
