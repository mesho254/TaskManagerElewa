import React, { useState, useEffect } from 'react';
import { Button, Menu, Dropdown, Avatar } from 'antd';
import { HomeOutlined, UserOutlined, MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.png';
import { logout } from '../utils/auth';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const user = localStorage.getItem('token') !== null;
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role')

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
    navigate('/login');
  };

  const NavLogin = () => {
    navigate("/login")
  }

  const NavHome = () => {
    navigate('/')
  }

  const NavAbout = () =>{
    navigate('/about')
  }

  const NavProf = () => {
    navigate('/profile')
  }

  const userMenu = (
    <Menu>
      {role === 'admin' && (
        <Menu.Item key="adminDashboard" onClick={() => navigate('/adminDashboard')}>
          Admin Dashboard
        </Menu.Item>
      )}
      {role === 'manager' && (
        <Menu.Item key="managerDashboard" onClick={() => navigate('/managerDashboard')}>
          Manager Dashboard
        </Menu.Item>
      )}
      {role === 'employee' && (
        <Menu.Item key="EmployeeDashboard" onClick={() => navigate('/EmployeeDashboard')}>
          Employee Dashboard
        </Menu.Item>
      )}
      <Menu.Item key="profile" onClick={NavProf}>
        <UserOutlined />
        <span>Profile</span>
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
        <div className="logo-container" >
          <img src={Logo} alt="logo" className="logo" onClick={NavHome} />
         <div className="heading">ElewaTaskManager</div>
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
          <Menu.Item key="home" icon={<HomeOutlined />} onClick={NavHome}>
            Home
          </Menu.Item>
          <Menu.Item key="about" icon={<UserOutlined />} onClick={NavAbout}>
            About
          </Menu.Item>
          {isMobile && user && (
            <Menu.Item key="user" className="user-menu-item">
              <Dropdown overlay={userMenu} trigger={['click']}>
              <Avatar size="large" style={{ backgroundColor: '#87d068', cursor:"pointer" }}>
                  {email ? email[0].toUpperCase() : ''}
                </Avatar>
              </Dropdown>
            </Menu.Item>
          )}
          {isMobile && !user && (
            <Menu.Item key="login" className="register-menu-item">
              <Button className="register-button" onClick={NavLogin} >Login</Button>
            </Menu.Item>
          )}
        </Menu>
        {!isMobile &&  (
          <div className="auth-section">
            {user ? (
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar size="large" style={{ backgroundColor: '#87d068', cursor:"pointer" }}>
                  {email ? email[0].toUpperCase() : ''}
                </Avatar>
              </Dropdown>
            ) : (
              <Button className="register-button" onClick={NavLogin} >
                Login
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
