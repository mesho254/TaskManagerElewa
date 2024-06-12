// import React, { useState, useEffect } from 'react';
// import { Card, message } from 'antd';
// import { Pie } from '@ant-design/charts';
// import axios from 'axios';

// const Analytics = () => {
//   const [rolesData, setRolesData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     fetchRolesData();
//   }, []);

//   const fetchRolesData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get('http://localhost:5000/api/auth/allUsers');
//       const users = response.data.users;
//       const roleCounts = users.reduce((counts, user) => {
//         counts[user.role] = (counts[user.role] || 0) + 1;
//         return counts;
//       }, {});

//       const data = Object.keys(roleCounts).map((role) => ({
//         role,
//         count: roleCounts[role],
//       }));
      
//       setRolesData(data);
//     } catch (error) {
//       console.error('Error fetching roles data:', error);
//       message.error('Failed to fetch roles data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const config = {
//     appendPadding: 10,
//     data: rolesData,
//     angleField: 'count',
//     colorField: 'role',
//     radius: 0.8,
    
//     interactions: [{ type: 'element-active' }],
//   };

//   return (
//     <Card title="User Roles Distribution" loading={loading}>
//       <Pie {...config} />
//     </Card>
//   );
// };

// export default Analytics;
