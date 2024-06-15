import React, { useState } from "react";
import axios from "axios";
import { Button, Input,  Spin, Form, Card, message } from "antd";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emptyFieldErrors, setEmptyFieldErrors] = useState({
    email: false,
  });

  const handleSubmit = async () => {
    const newEmptyFieldErrors = {
      email: !email,
    };

    setEmptyFieldErrors(newEmptyFieldErrors);

    if (Object.values(newEmptyFieldErrors).some((fieldError) => fieldError)) {
      message.error('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const url = `http://localhost:5000/api/auth/forgot-password1`;
      const { data } = await axios.post(url, { email });
      setEmail("");
      setIsLoading(false);
      message.success(data.message);
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setIsLoading(false);
        message.error(error.response.data.message);
      }
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Forgot Password" style={{ width: 400 }}>
        <Form onFinish={handleSubmit}>
          <Form.Item
            label="Email"
            validateStatus={emptyFieldErrors.email ? "error" : ""}
            help={emptyFieldErrors.email ? "Email is required" : ""}
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmptyFieldErrors({ ...emptyFieldErrors, email: false });
              }}
              required
            />
          </Form.Item>
          {isLoading ? (
            <div style={{ textAlign: "center" }}>
              <Spin />
            </div>
          ) : (
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          )}
          <Link to="/login">Back to Login</Link>
        </Form>
      </Card>
    </div>
  );
};

export default ForgotPassword;
