import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const TaskAnalytics = () => {
  const [statusData, setStatusData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/tasks');
      const userEmail = localStorage.getItem('email');
      prepareData(res.data.tasks.filter(task =>
        task.assignedTo && task.assignedTo.email === userEmail
      ));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const prepareData = (tasks) => {
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
    const statusData = Object.keys(statusCounts).map(status => ({
      name: status,
      value: statusCounts[status]
    }));
    setStatusData(statusData);

    const completedTasks = tasks.filter(task => task.status === 'done' && task.completedAt);
    const timeData = completedTasks.map(task => {
      const startTime = new Date(task.createdAt);
      const endTime = new Date(task.completedAt);
      const timeTaken = (endTime - startTime) / (1000 * 60 * 60);
      return {
        name: task.title,
        hours: timeTaken
      };
    });
    setTimeData(timeData);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginTop: "90px", textAlign: "center" }}>Analytics</h1>
      <div style={styles.chartContainer}>
        <div style={styles.chartWrapper}>
          <h2 style={{ textAlign: 'center' }}>Task Status Distribution</h2>
          <PieChart width={400} height={400} style={styles.chart}>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div style={styles.chartWrapper}>
          <h2 style={{ textAlign: 'center' }}>Time Taken to Finish Tasks (hours)</h2>
          <BarChart
            width={500}
            height={400}
            data={timeData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
            style={styles.chart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

const styles = {
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: '50px',
  },
  chartWrapper: {
    flex: '1 1 45%',
    marginBottom: '20px',
    textAlign: 'center',
  },
  chart: {
    maxWidth: '100%',
  },
};

export default TaskAnalytics;
