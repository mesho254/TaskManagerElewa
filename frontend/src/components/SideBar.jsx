import React from 'react';
import { Layout, Menu, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const SideBar = ({ toggleSidebar, showSidebar }) => {
  return (
    <Sider
      width={200}
      className="site-layout-background"
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        height: 'auto',
        zIndex: 1001, // Higher z-index
        display: showSidebar ? 'block' : 'none',
      }}
    >
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={toggleSidebar}
        style={{ position: 'absolute', left: '16px', top: '16px', zIndex: '999' }}
      />
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1">Dashboard</Menu.Item>
        <Menu.Item key="2">Departments</Menu.Item>
        <Menu.Item key="3">Tasks</Menu.Item>
        <Menu.Item key="4">Users</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SideBar;
