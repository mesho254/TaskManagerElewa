import React, { useState, useEffect } from 'react';
import { Table, Select, message, Modal, Button, Card } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/NavBar';

const { Option } = Select;
const { confirm } = Modal;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/auth/allUsers');
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await axios.post('http://localhost:5000/api/auth/assign-role', { userId, role });
      message.success('Role assigned successfully');
      fetchUsers(); // Refresh users after role assignment
    } catch (error) {
      console.error('Error assigning role:', error);
      if (error.response && error.response.status === 401) {
        message.error('You are not authorized to perform this action');
      } else {
        message.error('Failed to assign role');
      }
    }
  };

  const showDeleteConfirm = (userId) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      onOk() {
        handleDelete(userId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/deleteUser/${userId}`);
      message.success('User deleted successfully');
      fetchUsers(); // Refresh users after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Failed to delete user');
    }
  };

  const isAdmin = localStorage.getItem('role') === 'admin';

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => (
        isAdmin && (
          <Select defaultValue={record.role} style={{ width: 120 }} onChange={(value) => handleRoleChange(record._id, value)}>
            <Option value="employee">Employee</Option>
            <Option value="manager">Manager</Option>
            <Option value="admin">Admin</Option>
          </Select>
        )
      ),
    },
    {
      title: 'Delete User',
      dataIndex: 'delete user',
      key: 'delete',
      render: (_, record) => (
        isAdmin && (
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record._id)}
          />
        )
      ),
    },
  ];

  const isAuthenticated = localStorage.getItem('token') !== null;
  const role = localStorage.getItem('role');
  return isAuthenticated && role === 'admin'  ? (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <h1 style={{ marginTop:"100px", textAlign:"center" }}>Admin Dashboard</h1>
        <Table columns={columns} dataSource={users} loading={loading} style={{ marginTop: '20px',marginBottom:"100px", overflowX: 'auto' }} />
      </div>
    </>
  ):(<Card style={{textAlign: "center", justifyContent:"center", alignItems:"center", margin:"100px 40px"}}>
    <h1>Login as Admin First</h1>
   <Link to='/login'>
   Back to Login</Link>

</Card>)
};

export default AdminDashboard;
