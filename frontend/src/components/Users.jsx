import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import axios from 'axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/auth/allUsers');
      setUsers(res.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/departments/');
      setDepartments(res.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const getDepartmentName = (userId) => {
    const department = departments.find(dep => dep.employees.includes(userId));
    return department ? department.name : 'No Department';
  };

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
      title: 'Department',
      dataIndex: ['userId', 'name'], 
      key: 'department',
      render: (userId) => getDepartmentName(userId),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
  ];

  const formattedUsers = users.map(user => ({
    ...user,
    key: user._id,
  }));

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '100px' }}>Employees</h1>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table dataSource={formattedUsers} columns={columns} />
      )}
    </div>
  );
};

export default Users;
