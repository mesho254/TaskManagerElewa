import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Select } from 'antd';
import Navbar from '../components/NavBar';

const { Option } = Select;

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await axios.put(`/api/tasks/update:${taskId}`, { status });
      // Update the status in the local tasks state
      setTasks(tasks.map(task => task._id === taskId ? { ...task, status } : task));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Select
          value={text}
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">Pending</Option>
          <Option value="in progress">In Progress</Option>
          <Option value="done">Done</Option>
        </Select>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => (text ? new Date(text).toLocaleDateString() : 'N/A'),
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h1>Employee Dashboard</h1>
        <Table columns={columns} dataSource={tasks} rowKey="_id" />
      </div>
    </>
  );
};

export default EmployeeDashboard;
