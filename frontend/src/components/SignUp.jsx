import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Typography, message, notification } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './NavBar';

const { Title } = Typography;

const SignUp = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (values) => {
    setIsLoading(true);
    try {
      const { name, email, password } = values;

      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        notification.success({
          message: 'Signup successful!',
          description: 'You have successfully signed up. Redirecting to login...',
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        message.error('Signup failed. Please try again.');
      }
    } catch (error) {
      message.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-page">
        <div className="signup-content">
          <Title level={2} style={{ marginBottom: '20px' }}>
            Employee Signup Page
          </Title>
          <div className="signup-card">
            <Form form={form} onFinish={handleSignup}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Name"
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
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
                <Button type="primary" htmlType="submit" loading={isLoading} block>
                  {isLoading ? 'Signing Up' : 'Signup'}
                </Button>
              </Form.Item>
            </Form>
            <div style={{ textAlign: 'center' }}>
              Already have an account? <Link to="/login">Login Here</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
