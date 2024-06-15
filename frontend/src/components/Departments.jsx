import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, List, notification, Spin, Tooltip } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined, PlusCircleOutlined, EditOutlined, UserAddOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { confirm } = Modal;

const Departments = ({ onUpdate }) => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [addedEmployees, setAddedEmployees] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAddEmployeeModalVisible, setIsAddEmployeeModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newDepartmentId, setNewDepartmentId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      form.setFieldsValue({
        name: selectedDepartment.name,
      });
    }
  }, [selectedDepartment, form]);

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
      form.resetFields();
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

  const showEditModal = (department) => {
    setSelectedDepartment(department);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/departments/update/${selectedDepartment._id}`, { name: values.name });
      fetchDepartments();
      setIsEditModalVisible(false);
      notification.success({
        message: 'Department Updated',
        description: 'Department has been successfully updated.'
      });
    } catch (error) {
      console.error('Error updating department:', error);
      notification.error({
        message: 'Update Error',
        description: 'Failed to update department.'
      });
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const showAddEmployeeModal = (department) => {
    setSelectedDepartment(department);
    setIsAddEmployeeModalVisible(true);
  };

  const handleAddEmployeeModalOk = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/departments/add-employee', {
        departmentId: selectedDepartment._id,
        userId: values.employee,
      });
      fetchDepartments();
      setIsAddEmployeeModalVisible(false);
      form.resetFields()
      notification.success({
        message: 'Employee Added',
        description: `Employee has been successfully added to the ${selectedDepartment.name}`
      });
    } catch (error) {
      console.error('Error adding employee to department:', error);
      notification.error({
        message: 'Add Employee Error',
        description: 'Failed to add employee to the department.'
      });
    }
  };

  const handleAddEmployeeModalCancel = () => {
    setIsAddEmployeeModalVisible(false);
  };

  const showViewModal = (department) => {
    setSelectedDepartment(department);
    setIsViewModalVisible(true);
  };

  const handleViewModalCancel = () => {
    setIsViewModalVisible(false);
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
        description: `Employee has been successfully removed from the ${selectedDepartment.name} .`
      });
    } catch (error) {
      console.error('Error removing employee:', error);
      notification.error({
        message: 'Remove Error',
        description: `Failed to remove employee from the ${selectedDepartment.name}.`
      });
    }
  };

  const showMoveModal = (employee) => {
    setSelectedEmployee(employee);
    setIsMoveModalVisible(true);
  };

  const handleMoveModalOk = async () => {
    try {
      await axios.post('http://localhost:5000/api/departments/move-employee', {
        oldDepartmentId: selectedEmployee.departmentId,
        newDepartmentId,
        userId: selectedEmployee._id
      });
      fetchDepartments();
      setIsMoveModalVisible(false);
      form.resetFields()
      notification.success({
        message: 'Employee Moved',
        description: 'Employee has been successfully moved to the new department.'
      });
    } catch (error) {
      console.error('Error moving employee:', error);
      notification.error({
        message: 'Move Error',
        description: 'Failed to move employee to the new department.'
      });
    }
  };

  const handleMoveModalCancel = () => {
    setIsMoveModalVisible(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '16px'}}>
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>Departments</h1>
      <Button type="primary" style={{ marginBottom: '16px' }} onClick={showAddModal}>
        Create Department <PlusCircleOutlined/>
      </Button>
      <Input
        placeholder="Search departments"
        value={searchQuery}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', overflowY:"auto", marginLeft:"auto", marginRight:"auto" ,marginBottom: '100px',}}>
          {filteredDepartments.map((dept) => (
             <Card
             key={dept._id}
             title={dept.name}
             style={{ width: '400px', zIndex: "1", marginLeft:"auto", marginRight:"auto" }}
             extra={
               <>
               <Tooltip title="Edit Department">
                 <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(dept)}></Button>
                </Tooltip>
                <Tooltip title="Delete Department">
                 <Button type="text" danger onClick={() => showDeleteConfirm(dept._id)}>Delete</Button>
                 </Tooltip>
               </>
             }
           >
              <List
                dataSource={dept.employees ? dept.employees : []}
                renderItem={(employee) => (
                  <List.Item key={employee._id}>
                    <List.Item.Meta
                      title={employee.name}
                      description={employee.email}
                    />
                    <p>{employee.role}</p>
                    <Tooltip title="Move Employee to other Department">
                    <Button type="text" onClick={() => showMoveModal({ ...employee, departmentId: dept._id })}>
                    <EditOutlined />
                    </Button>
                    </Tooltip>
                    <Tooltip title="Remove Employee from Department">
                    <Button type="text" danger onClick={() => showRemoveEmployeeConfirm(dept._id, employee._id)}>
                      <DeleteOutlined />
                    </Button>
                    </Tooltip>
                  </List.Item>
                )}
              />
               <Button type="primary" onClick={() => showAddEmployeeModal(dept)} style={{ marginTop: '16px' }}>
                Add Employee <UserAddOutlined />
              </Button>
              <Button type="default" onClick={() => showViewModal(dept)} style={{ marginTop: '16px', marginLeft: '8px' }}>
                View Dept. <EyeOutlined />
              </Button>
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
        <Form form={form} onFinish={handleAddModalOk}>
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

       {/* Edit Department Modal */}
       <Modal
        title="Edit Department"
        visible={isEditModalVisible}
        footer={null}
        onCancel={handleEditModalCancel}
      >
        <Form
          form={form}
          onFinish={handleEditModalOk}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Department
            </Button>
          </Form.Item>
        </Form>
      </Modal>

       {/* Add Employee Modal */}
       <Modal
        title="Add Employee"
        visible={isAddEmployeeModalVisible}
        footer={null}
        onCancel={handleAddEmployeeModalCancel}
      >
        <Form form={form} onFinish={handleAddEmployeeModalOk}>
          <Form.Item name="employee" label="Employee" rules={[{ required: true }]}>
            <Select placeholder="Select employee" >
              {employees.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Employee
            </Button>
          </Form.Item>
        </Form>
      </Modal>

       {/* View Department Modal */}
       <Modal
        title="Department Details"
        visible={isViewModalVisible}
        footer={null}
        onCancel={handleViewModalCancel}
      >
        {selectedDepartment && (
          <>
            <p><strong>Name:</strong> {selectedDepartment.name}</p>
            <List
              dataSource={selectedDepartment.employees}
              renderItem={(employee) => (
                <List.Item key={employee._id}>
                  <List.Item.Meta
                    title={employee.name}
                    description={employee.email}
                  />
                  <p>{employee.role}</p>
                  <Button type="text" onClick={() => showMoveModal({ ...employee, departmentId: employee._id })}>
                    <EditOutlined />
                    </Button>
                    <Button type="text" danger onClick={() => showRemoveEmployeeConfirm(employee._id, employee._id)}>
                      <DeleteOutlined />
                    </Button>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>

      {/* Move Employee Modal */}
      <Modal
        title="Move Employee"
        visible={isMoveModalVisible}
        onOk={handleMoveModalOk}
        onCancel={handleMoveModalCancel}
      >
        <Form form={form}>
          <Form.Item label="New Department">
            <Select
              placeholder="Select new department"
              onChange={(value) => setNewDepartmentId(value)}
            >
              {departments.map((dept) => (
                <Option key={dept._id} value={dept._id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;
