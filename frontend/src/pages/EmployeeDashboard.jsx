import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, Select, Layout, Menu, Button, Spin, Input, Drawer, Tooltip, notification, Card } from 'antd';
import { MenuUnfoldOutlined } from '@ant-design/icons';
import Navbar from '../components/NavBar';
import { Link } from 'react-router-dom';
import moment from 'moment';
import CompleteTasks from '../components/Employee/CompleteTasks';
import TasksInProgress from '../components/Employee/TasksInProgress';
import TaskAnalytics from '../components/Employee/TaskAnalytics';

const { Option } = Select;
const { Content } = Layout;
const { Search } = Input;

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedKey, setSelectedKey] = useState(localStorage.getItem('selectedKey') || '1');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const email = localStorage.getItem('email');

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/tasks');
      const userEmail = localStorage.getItem('email');
      const filteredTasks = res.data.tasks.filter(task =>
        task.assignedTo && task.assignedTo.email === userEmail
      );
      setTasks(filteredTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const taskToUpdate = tasks.find(task => task._id === taskId);
      await axios.put(`https://task-manager-elewa-94jv.vercel.app/api/tasks/update`, {
        taskId,
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        dueDate: taskToUpdate.dueDate,
        status
      });
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
      notification.success({
        message: 'Status Changed',
        description: `Task ${taskToUpdate.title} Status has been successfully changed to ${status}.`
      });
    } catch (error) {
      console.error('Error updating task status:', error);
      notification.error({
        message: 'Change status Error',
        description: 'Failed to change Task status.'
      });
    }
  };

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    localStorage.setItem('selectedKey', e.key);
    setDrawerVisible(false); 
  };

  const handleUpdate = () => {
    getTasks();
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

  const calculateTimeRemaining = (dueDate) => {
    const now = moment();
    const due = moment(dueDate);
    const duration = moment.duration(due.diff(now));

    if (duration.asMilliseconds() <= 0) {
      return 'Expired';
    }

    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours() % 24);
    const minutes = Math.floor(duration.asMinutes() % 60);

    return `${days}d ${hours}h ${minutes}m`;
  };

  const filterTasks = useCallback(() => {
    const filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredTasks(filtered);
  }, [tasks, searchText]);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchText, filterTasks]);

  const doneTasks = tasks.filter(task => task.status === 'done');
  const progressTasks = tasks.filter(task => task.status === 'in progress');

  const columns = [
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
      title: 'Date Added',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => (text ? moment(text).format('DD MMM, YYYY HH:mm') : 'N/A'),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => (text ? moment(text).format('DD MMM, YYYY') : 'N/A'),
    },
    {
      title: 'Time Remaining',
      dataIndex: 'dueDate',
      key: 'timeRemaining',
      render: (dueDate) => calculateTimeRemaining(dueDate),
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
      title: 'Change Status',
      key: 'changeStatus',
      render: (text, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record._id, value)}
          disabled={calculateTimeRemaining(record.dueDate) === 'Expired'}
        >
          <Option value="pending">Pending</Option>
          <Option value="in progress">In Progress</Option>
          <Option value="done">Done</Option>
        </Select>
      ),
    },
  ];

  const isAuthenticated = localStorage.getItem('token') !== null;
  const role = localStorage.getItem('role');
  return isAuthenticated && role === 'employee'  ? (
    <>
      <Navbar />
      <Layout>
        <Tooltip title="Open Menus" >
        <Button
          type="primary"
          onClick={() => setDrawerVisible(true)}
          style={{ position: 'fixed', top: 114, left: 65, zIndex: 1000 }}
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
            <Menu.Item key="2">Complete Tasks</Menu.Item>
            <Menu.Item key="3">Tasks InProgress</Menu.Item>
            <Menu.Item key="4">Analytics</Menu.Item>
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
                    <div style={{ padding: '24px' }}>
                      <h1 style={{ marginTop: "90px", textAlign: "center" }}>Employee Dashboard</h1>
                      <h1 style={{maxWidth:"100%"}}>Tasks for: {email}</h1>
                      <Search
                        placeholder="Search tasks by title"
                        onChange={e => setSearchText(e.target.value)}
                        style={{ marginBottom: '20px' }}
                      />
                      <Table columns={columns} dataSource={filteredTasks} rowKey="_id" style={{ marginTop: "20px", overflowX: "auto" }} />
                    </div>
                  </>
                )}
                {selectedKey === '2' && (
                  <CompleteTasks tasks={doneTasks} onUpdate={handleUpdate} />
                )}
                {selectedKey === '3' && (
                  <TasksInProgress tasks={progressTasks} onUpdate={handleUpdate} />
                )}
                {selectedKey === '4' && (
                  <TaskAnalytics onUpdate={handleUpdate} />
                )}
              </>
            )}
          </Content>
        </Layout>
      </Layout>
    </>
  ):(<Card style={{textAlign: "center", justifyContent:"center", alignItems:"center", margin:"100px 40px"}}>
    <h1>Login as Employee First</h1>
   <Link to='/login'>
   Back to Login</Link>

</Card>)
};

export default EmployeeDashboard;
