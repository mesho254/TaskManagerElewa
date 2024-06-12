import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, Space, message, notification } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import Navbar from './NavBar';

const { Title, Text } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const { email, password, role } = values;

      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
        role,
      });

      if (response.status === 200) {
        const decodedToken = jwtDecode(response.data.token);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', decodedToken.email);
        localStorage.setItem('role', decodedToken.role);
        localStorage.setItem('id', decodedToken.id);

        const redirectPath = role === 'manager' ? '/managerDashboard' : '/EmployeeDashboard';
        navigate(redirectPath);

        notification.success({
          message: 'Login successful!',
          description: 'You have successfully logged in.',
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
      <Navbar />
      <div className="login-page">
        <div className="login-content">
          <Title level={2} style={{ marginBottom: '20px' }}>
            Login
          </Title>
          <div className="login-card">
            <Title level={4}>Login as an Employee or a Manager</Title>
            <Form form={form} onFinish={handleLogin}>
              {/* <Form.Item name="role" initialValue="other">
                <Radio.Group>
                  <Radio value="employee">OTHER_EMPLOYEE</Radio>
                  <Radio value="manager">MANAGER</Radio>
                </Radio.Group>
              </Form.Item> */}
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
                  <Form.Item>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  Don't have an account? <Link to="/signup" style={{color:"darkblue"}}>Sign up here</Link>
                </div>
              </Form.Item>
                  <Link to="/forgotPassword">
                    <Text style={{color:"darkblue"}}>Forgot Password?</Text>
                  </Link>
                </Space>
              </Form.Item>
              {form.getFieldError('loginError') && (
                <Text type="danger">{form.getFieldError('loginError').join(', ')}</Text>
              )}
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;