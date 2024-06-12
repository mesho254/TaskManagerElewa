import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, notification, Space } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import {  useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AdminNavbar from '../AdminNavbar';

const { Title} = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const { email, password } = values;

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.token);
        
        if (decodedToken.role !== 'admin') {
          message.error('You are not an admin');
          return;
        }

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('id', decodedToken.userId);

        navigate('/adminDashboard');

        notification.success({
          message: 'Login successful!',
          description: 'You have successfully logged in as an admin.',
        });
      } else {
        message.error('Login failed. Please try again.');
      }
    } catch (error) {
      message.error('Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="admin-login-page">
        <div className="admin-login-content">
          <Title level={2} style={{ marginBottom: '20px' }}>
            Admin Login
          </Title>
          <div className="admin-login-card">
            <Form form={form} onFinish={handleLogin}>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                />
              </Form.Item>
              <Form.Item>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button type="primary" htmlType="submit" loading={isLoading} block>
                    {isLoading ? 'Logging In' : 'Login'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
