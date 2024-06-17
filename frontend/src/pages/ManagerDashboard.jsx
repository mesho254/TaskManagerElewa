import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Typography, Button, Spin, Table, List, Drawer, Tooltip, Carousel } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Departments from '../components/Departments';
import Tasks from '../components/Tasks';
import Users from '../components/Users';

const { Content } = Layout;
const { Title } = Typography;

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || '1');
  const [drawerVisible, setDrawerVisible] = useState(false);
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
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/departments');
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
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/tasks');
      setTasks(res.data.tasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    localStorage.setItem('selectedKey', e.key);
    setDrawerVisible(false); 
  };

  const handleUpdate = () => {
    fetchDepartments();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'grey';
      case 'in progress':
        return 'blue';
      case 'done':
        return 'green';
      default:
        return 'grey';
    }
  };

  const getStatusTextColor = (status) => {
    return { color: getStatusColor(status) };
  };

  const taskColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => (text ? moment(text).format('DD MMM, YYYY') : 'N/A'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={getStatusTextColor(status)}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: getStatusColor(status),
            marginRight: 8
          }}></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'email'], 
      key: 'assignedTo',
      render: (assignedTo) => assignedTo ? assignedTo : 'Unassigned',
    },
  ];

  const carouselSettings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        }
      }
    ]
  };

  const isAuthenticated = localStorage.getItem('token') !== null;
  const role = localStorage.getItem('role');
  return isAuthenticated && role === 'manager'  ? (
    <>
      <Navbar />
      <Layout style={{ minHeight: '100vh' }}>
      <Tooltip title="Open Menus" >
        <Button
          type="primary"
          onClick={() => setDrawerVisible(true)}
          style={{ position: 'fixed', top: 114, left: 58, zIndex: 1000 }}
          className='menu-task'
        >
          <MenuUnfoldOutlined /> Open Menu
        </Button>
        </Tooltip>
        <Drawer
          title="Close"
          placement="left"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          style={{marginTop:"110px"}}
        >
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="1">Dashboard</Menu.Item>
            <Menu.Item key="2">Departments</Menu.Item>
            <Menu.Item key="3">Tasks</Menu.Item>
            <Menu.Item key="4">Employees</Menu.Item>
          </Menu>
        </Drawer>
        <Layout style={{ marginLeft: 0, transition: 'margin-left 0.2s' }}>
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
                    <h1 style={{ textAlign: 'center', marginTop: "100px" }}>Manager Dashboard</h1>
                    <Title level={2} style={{textAlign:"center"}}>Departments</Title>
                    <div style={{ marginTop: '50px', marginLeft: 'auto', marginRight: 'auto' }}>
                      <Carousel {...carouselSettings}>
                        {departments.map((dept) => (
                          <div key={dept._id}>
                            <Card
                              title={dept.name}
                              style={{ minWidth: "300px", margin: '20px 10px', cursor: 'pointer', borderRadius: "30px" }}
                            >
                              <List
                                dataSource={dept.employees ? dept.employees.slice(0, 3) : []}
                                renderItem={(employee) => (
                                  <List.Item key={employee._id}>
                                    <List.Item.Meta
                                      title={employee.name}
                                      description={employee.email}
                                    />
                                    <p>{employee.role}</p>
                                  </List.Item>
                                )}
                              />
                            </Card>
                          </div>
                        ))}
                      </Carousel>
                    </div>
                    <Title level={2}>Tasks</Title>
                    <div style={{ overflowY: 'auto', maxHeight: '500px', marginBottom: "100px", marginLeft: "auto", marginRight: "auto" }}>
                      <Table
                        columns={taskColumns}
                        dataSource={tasks}
                        rowKey={(record) => record._id}
                        pagination={false}
                      />
                    </div>
                  </>
                )}
                {selectedKey === '2' && (
                  <Departments onUpdate={handleUpdate} />
                )}
                {selectedKey === '3' && (
                  <Tasks onUpdate={handleUpdate} />
                )}
                {selectedKey === '4' && (
                  <Users onUpdate={handleUpdate} />
                )}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  ): (<Card style={{textAlign: "center", justifyContent:"center", alignItems:"center", margin:"100px 40px"}}>
    <h1>Login as Manager First</h1>
   <Link to='/login'>
   Back to Login</Link>

</Card>)
};

export default ManagerDashboard;
