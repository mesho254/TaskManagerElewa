import React, { useState, useEffect } from 'react';
import { Table, Select, message } from 'antd';
import axios from 'axios';
import Navbar from '../components/NavBar';

const { Option } = Select;

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
      // Refresh users after role assignment
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      if (error.response && error.response.status === 401) {
        message.error('You are not authorized to perform this action');
      } else {
        message.error('Failed to assign role');
      }
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
  ];

  return (
    <>
      <Navbar/>
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard</h1>
        <Table columns={columns} dataSource={users} loading={loading} style={{marginTop:"100px", overflowX:"auto"}}/>
      </div>
    </>
  );
};

export default AdminDashboard;
