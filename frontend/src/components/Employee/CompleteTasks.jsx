import React from 'react';
import { Table } from 'antd';
import moment from 'moment';

const CompleteTasks = ({ tasks }) => {
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
        title: 'Completed At',
        dataIndex: 'completedAt',
        key: 'completedAt',
        render: (text) => (text ? moment(text).format('DD MMM, YYYY HH:mm') : 'N/A'),
      },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginTop: "90px", textAlign: "center" }}>Complete Tasks</h1>
      <Table columns={columns} dataSource={tasks} rowKey="_id" style={{ marginTop: "20px", overflowX: "auto" }} />
    </div>
  );
};

export default CompleteTasks;
