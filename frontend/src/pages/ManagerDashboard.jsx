import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, List, Typography, Button, Spin } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import Navbar from '../components/NavBar';
import Departments from '../components/Departments';

const { Sider, Content } = Layout;
const { Title } = Typography;

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || '1');
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchTasks();
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedKey', selectedKey);
  }, [selectedKey]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/departments');
      setDepartments(res.data.departments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
  };

  const handleUpdate = () => {
    fetchDepartments();
  };

  return (
    <>
      <Navbar />
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={200}
          style={{ 
            position: 'fixed', 
            height: '100vh',
            zIndex: 1000,
            overflow: 'auto',
            left: 0,
            top: 112,
            bottom: 0,
            background: '#001529'
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              color: 'white',
              margin: '10px',
              display: 'block',
            }}
          />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{ borderRight: 0 }}
          >
            <Menu.Item key="1">Dashboard</Menu.Item>
            <Menu.Item key="2">Departments</Menu.Item>
            <Menu.Item key="3">Tasks</Menu.Item>
            <Menu.Item key="4">Users</Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: '16px 16px 0',
              overflow: 'auto',
            }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', paddingTop: '50px' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                {selectedKey === '1' && (
                  <>
                    <h1 style={{ textAlign: 'center' , marginTop:"100px"}}>Manager Dashboard</h1>
                    <Title level={2}>Departments</Title>
                    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginBottom: '24px', marginTop:"50px" }}>
                      {departments.map((dept) => (
                        <Card
                          key={dept._id}
                          title={dept.name}
                          style={{ width: 300, margin: '0 24px 24px 0', cursor: 'pointer' }}
                        >
                          <p>{dept.description}</p>
                        </Card>
                      ))}
                    </div>
                    <Title level={2}>Tasks</Title>
                    <List
                      grid={{ gutter: 16, column: 1 }}
                      dataSource={tasks}
                      renderItem={task => (
                        <List.Item>
                          <Card title={task.title}>
                            <p><strong>Description:</strong> {task.description}</p>
                            <p><strong>Status:</strong> {task.status}</p>
                            <p><strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                            <p><strong>Assigned To:</strong> {task.assignedTo.name}</p>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </>
                )}
                {selectedKey === '2' && (
                  <Departments onUpdate={handleUpdate} />
                )}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default ManagerDashboard;
