import React from 'react';
import { Table } from 'antd';
import moment from 'moment';

const TasksInProgress = ({ tasks }) => {

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
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => (text ? moment(text).format('DD MMM, YYYY') : 'N/A'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
        title: 'Time Remaining',
        dataIndex: 'dueDate',
        key: 'timeRemaining',
        render: (dueDate) => calculateTimeRemaining(dueDate),
      },
  ];

  return (
    <div style={{ padding: '24px', height:"100vh" }}>
      <h1 style={{ marginTop: "90px", textAlign: "center" }}>Tasks In Progress</h1>
      <Table columns={columns} dataSource={tasks} rowKey="_id" style={{ marginTop: "20px", overflowX: "auto", overflowY:"auto" }} />
    </div>
  );
};

export default TasksInProgress;
