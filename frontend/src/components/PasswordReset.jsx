import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Input,
  Typography,
  Card,
  Alert,
  Spin,
  notification,
} from "antd";
import { LoadingOutlined } from '@ant-design/icons';

const { Title } = Typography;

const PasswordReset = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyFieldErrors, setEmptyFieldErrors] = useState({
    password: false,
  });
  const param = useParams();
  const url = `https://task-manager-elewa-94jv.vercel.app/api/auth/password-reset/${param.id}/${param.token}`;

  useEffect(() => {
    const verifyUrl = async () => {
      try {
        await axios.get(url);
        setValidUrl(true);
      } catch (error) {
        setValidUrl(false);
      }
    };
    verifyUrl();
  }, [param, url]);

  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmptyFieldErrors = {
      password: !password,
    };

    setEmptyFieldErrors(newEmptyFieldErrors);

    if (Object.values(newEmptyFieldErrors).some((fieldError) => fieldError)) {
      setError('Please fill in all required fields.');
      openNotification('error', 'Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axios.post(url, { password });
      setMsg(data.message);
      setError("");
      setIsLoading(false);
      openNotification('success', data.message);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
        setMsg("");
        openNotification('error', error.response.data.message);
      }
    }
  };

  return (
    <Fragment>
      {validUrl ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <Card style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <Title level={3}>Add New Password</Title>
            <form onSubmit={handleSubmit}>
              <Input.Password
                type="password"
                placeholder="Password (Should contain at least one uppercase and character)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setEmptyFieldErrors({ ...emptyFieldErrors, password: false });
                }}
                required
                status={emptyFieldErrors.password ? 'error' : ''}
                style={{ marginBottom: '16px' }}
              />
              {error && (
                <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />
              )}
              {msg && (
                <Alert message={msg} type="success" showIcon style={{ marginBottom: '16px' }} />
              )}
              {isLoading ? (
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              ) : (
                <Button type="primary" htmlType="submit" block>
                  Submit
                </Button>
              )}
            </form>
          </Card>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '200px' }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      )}
    </Fragment>
  );
};

export default PasswordReset;
