import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, Upload, Avatar,  Card, Tooltip, notification } from 'antd';
import { UploadOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import Navbar from '../components/NavBar'; 
import { useNavigate } from 'react-router-dom';
import { logout } from '../utils/auth'; 

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const fetchUserProfileImage = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/user/${email}`);
      setProfileImage(res.data.user.profileImage);
    } catch (error) {
      console.error('Error fetching user profile image:', error);
      notification.error('Failed to fetch profile image.');
    }
  }, [email]);

  useEffect(() => {
    fetchUserProfileImage();
  }, [fetchUserProfileImage]);

  const handleUpload = async () => {
    if (!selectedFile) {
      notification.error('No file selected for upload.');
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
      notification.success({
        message: 'Failed to Select Image',
        description: `${info.file.filename} file selection failed.`
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
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
          <Button type="danger" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginTop: '20px', width: '100%' , border:"solid 1px green" }}>
            Logout
          </Button>
        </Card>
      </div>
    </>
  );
};

export default Profile;
