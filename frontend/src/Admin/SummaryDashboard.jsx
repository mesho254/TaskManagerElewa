import React, { useState, useEffect } from 'react';
import { Card, Typography, Progress, Spin } from 'antd';
import axios from 'axios';

const { Title } = Typography;

const SummaryDashboard = () => {
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/dashboard');
      setDashboardData(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Title level={2} style={{ textAlign: "center" }}>Task Summary</Title>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
            <Card style={{ width: '30%', textAlign: 'center' }}>
              <Title level={3}>Total Tasks</Title>
              <p>{dashboardData.totalTasks}</p>
            </Card>
            <Card style={{ width: '30%', textAlign: 'center' }}>
              <Title level={3}>Completed Tasks</Title>
              <Progress type="circle" percent={(dashboardData.completedTasks / dashboardData.totalTasks) * 100} />
              <p>{dashboardData.completedTasks}</p>
            </Card>
            <Card style={{ width: '30%', textAlign: 'center' }}>
              <Title level={3}>Pending Tasks</Title>
              <p>{dashboardData.pendingTasks}</p>
            </Card>
          </div>
          <Title level={2} style={{ textAlign: "center", marginTop: '50px' }}>Department Performance</Title>
          {dashboardData.departmentPerformance && dashboardData.departmentPerformance.map((deptPerf, index) => (
            <Card key={index} style={{ margin: '20px 0' }}>
              <Title level={4}>{deptPerf.department}</Title>
              <p>Total Tasks: {deptPerf.totalTasks}</p>
              <p>Completed Tasks: {deptPerf.completedTasks}</p>
              <p>Pending Tasks: {deptPerf.pendingTasks}</p>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default SummaryDashboard;
