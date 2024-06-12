import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, List, notification, Spin } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { confirm } = Modal;

const Departments = ({ onUpdate }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [addedEmployees, setAddedEmployees] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/departments/');
      setDepartments(res.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/allUsers');
      setEmployees(res.data.users);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/departments/create', { ...values, employees: addedEmployees.map(emp => emp._id) });
      fetchDepartments();
      setIsAddModalVisible(false);
      notification.success({
        message: 'Department Added',
        description: 'Department has been successfully added.'
      });
    } catch (error) {
      console.error('Error adding department:', error);
      notification.error({
        message: 'Add Error',
        description: 'Failed to add department.'
      });
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const showDeleteConfirm = (departmentId) => {
    confirm({
      title: 'Are you sure you want to delete this department?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteDepartment(departmentId);
      }
    });
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`http://localhost:5000/api/departments/delete/${departmentId}`);
      fetchDepartments();
      if (onUpdate) onUpdate();
      notification.success({
        message: 'Department Deleted',
        description: 'Department has been successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting department:', error);
      notification.error({
        message: 'Delete Error',
        description: 'Failed to delete department.'
      });
    }
  };

  const showRemoveEmployeeConfirm = (departmentId, userId) => {
    confirm({
      title: 'Are you sure you want to remove this employee?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRemoveEmployee(departmentId, userId);
      }
    });
  };

  const handleRemoveEmployee = async (departmentId, userId) => {
    try {
      await axios.post('http://localhost:5000/api/departments/remove-employee', {
        departmentId,
        userId
      });
      fetchDepartments();
      if (onUpdate) onUpdate();
      notification.success({
        message: 'Employee Removed',
        description: 'Employee has been successfully removed from the department.'
      });
    } catch (error) {
      console.error('Error removing employee:', error);
      notification.error({
        message: 'Remove Error',
        description: 'Failed to remove employee from the department.'
      });
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>Departments</h1>
      <Button type="primary" style={{ marginBottom: '16px' }} onClick={showAddModal}>
        Create Department <PlusCircleOutlined/>
      </Button>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {departments.map((dept) => (
            <Card
              key={dept._id}
              title={dept.name}
              style={{ width: '300px', marginBottom: '16px', zIndex: "1" }}
              extra={<Button type="text" danger onClick={() => showDeleteConfirm(dept._id)}>Delete</Button>}
            >
              <List
                dataSource={dept.employees || []}
                renderItem={(employee) => (
                  <List.Item key={employee._id}>
                    <List.Item.Meta
                      title={employee.name}
                      description={employee.email}
                    />
                    <p>{employee.role}</p>
                    <Button type="text" danger onClick={() => showRemoveEmployeeConfirm(dept._id, employee._id)}>
                      <DeleteOutlined />
                    </Button>
                  </List.Item>
                )}
              />
            </Card>
          ))}
        </div>
      )}

      {/* Add Department Modal */}
      <Modal
        title="Create Department"
        visible={isAddModalVisible}
        footer={null}
        onCancel={handleAddModalCancel}
      >
        <Form onFinish={handleAddModalOk}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="employees" label="Employees">
            <Select
              mode="multiple"
              placeholder="Select employees"
              onChange={(value) => setAddedEmployees(employees.filter(user => value.includes(user._id)))}
            >
              {employees.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Department
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
