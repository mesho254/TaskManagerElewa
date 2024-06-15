import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Upload, Avatar, Card, Tooltip, notification, Modal, Form, Input } from 'antd';
import { UploadOutlined, UserOutlined, LogoutOutlined, EditOutlined, SettingOutlined } from '@ant-design/icons';
import Navbar from '../components/NavBar';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../utils/auth';

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
      const { profileImage, userId, name } = res.data.user;
      setProfileImage(profileImage);
      setUserId(userId);
      setUserName(name);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      notification.error({ message: 'Failed to fetch profile.' });
    }
  }, [email]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleUpload = async () => {
    if (!selectedFile) {
      notification.error({ message: 'No file selected for upload.' });
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedFile);
    formData.append('email', email);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/uploadProfileImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfileImage(res.data.profileImage);
      notification.success({
        message: 'Profile Uploaded',
        description: 'Profile image uploaded successfully.'
      });
      window.location.reload(); // Refresh to update the navbar
    } catch (error) {
      console.error('Error uploading profile image:', error);
      notification.error({
        message: 'Failed To Upload Profile',
        description: 'Failed to upload profile image.'
      });
    }
  };

  const handleChange = info => {
    if (info.file.status === 'done') {
      setSelectedFile(info.file.originFileObj);
      notification.success({
        message: 'Image File Selected',
        description: `${info.file.filename} file selected successfully`
      });
    } else if (info.file.status === 'error') {
      notification.error({
        message: 'Failed to Select Image',
        description: `${info.file.filename} file selection failed.`
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleEdit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/updateUser/${userId}`, values);
      localStorage.setItem('email', values.email); // Update local storage with new email
      notification.success({ message: 'Profile updated successfully' });
      setIsEditModalVisible(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      notification.error({ message: 'Failed to update profile' });
    }
  };

  const handleChangePassword = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/changePassword`, { email, ...values });
      notification.success({ message: 'Password changed successfully' });
      setIsPasswordModalVisible(false);
    } catch (error) {
      console.error('Error changing password:', error);
      notification.error({ message: 'Failed to change password' });
    }
  };

  const showEditModal = () => {
    setIsEditModalVisible(true);
    form.setFieldsValue({ email, role, name: userName });
  };

  const showPasswordModal = () => {
    setIsPasswordModalVisible(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };

  const handleCancelPassword = () => {
    setIsPasswordModalVisible(false);
  };

  const isAuthenticated = localStorage.getItem('token') !== null;

  return isAuthenticated ? (
    <>
      <Navbar />
      <div className="profile-container">
        <h1 style={{ textAlign: 'center' }}>Profile</h1>
        <Card className="profile-card">
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            {profileImage ? (
              <Avatar size={150} src={`http://localhost:5000/uploads/${profileImage}`} />
            ) : (
              <Avatar size={150} icon={<UserOutlined />} />
            )}
          </div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <p><strong>Name:</strong> {userName}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Role:</strong> {role}</p>
          </div>
          <Tooltip title="Select Profile Image">
            <Upload
              beforeUpload={file => {
                setSelectedFile(file);
                return false;
              }}
              onChange={handleChange}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />} color='lightblue'>Select File</Button>
            </Upload>
          </Tooltip>
          <Tooltip title="Choose a file to upload">
            <Button type="primary" onClick={handleUpload} disabled={!selectedFile} style={{ marginLeft: '10px' }}>
              Upload
            </Button>
          </Tooltip>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Tooltip title="Edit Profile">
              <Button icon={<EditOutlined />} onClick={showEditModal} style={{ marginRight: '10px' }} />
            </Tooltip>
            <Tooltip title="Change Password">
              <Button icon={<SettingOutlined />} onClick={showPasswordModal} />
            </Tooltip>
          </div>
          <Button type="danger" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: '20px', width: '100%', border:"1px solid green" }}>
            Logout
          </Button>
        </Card>
        <Modal
          title="Edit Profile"
          visible={isEditModalVisible}
          onCancel={handleCancelEdit}
          footer={[
            <Button key="cancel" onClick={handleCancelEdit}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" form="editForm" htmlType="submit">
              Save
            </Button>,
          ]}
        >
          <Form form={form} onFinish={handleEdit} id="editForm">
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input your name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Role" name="role">
              <Input disabled />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Change Password"
          visible={isPasswordModalVisible}
          onCancel={handleCancelPassword}
          footer={[
            <Button key="cancel" onClick={handleCancelPassword}>
              Cancel
            </Button>,
            <Tooltip title="Not working for now">
            <Button key="submit" type="primary" form="passwordForm" htmlType="submit" disabled>
              Change Password
            </Button>
            </Tooltip>,
          ]}
        >
          <Form form={passwordForm} onFinish={handleChangePassword} id="passwordForm">
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please input your new password!' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your new password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  ) : (
    <Card style={{ textAlign: 'center', justifyContent: 'center', alignItems: 'center', margin: '100px' }}>
      <p>Please log in to view your profile.</p>
      <Link to="/login">
        <Button type="primary">Go to Login</Button>
      </Link>
    </Card>
  );
};

export default Profile;
