import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Table, notification, Spin, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;
const { confirm } = Modal;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
    // fetchDepartments();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/employee');
      setEmployees(res.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/departments/');
//       setDepartments(res.data.departments);
//     } catch (error) {
//       console.error('Error fetching departments:', error);
//     }
//   };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/tasks/create', values);
      fetchTasks();
      setIsAddModalVisible(false);
      notification.success({
        message: 'Task Added',
        description: 'Task has been successfully added.'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      notification.error({
        message: 'Add Error',
        description: 'Failed to add task.'
      });
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
  };

  const showEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async (values) => {
    try {
      await axios.put('http://localhost:5000/api/tasks/update', { ...values, taskId: selectedTask._id });
      fetchTasks();
      setIsEditModalVisible(false);
      notification.success({
        message: 'Task Updated',
        description: 'Task has been successfully updated.'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      notification.error({
        message: 'Update Error',
        description: 'Failed to update task.'
      });
    }
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
  };

  const showDeleteConfirm = (taskId) => {
    confirm({
      title: 'Are you sure you want to delete this task?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteTask(taskId);
      }
    });
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete('http://localhost:5000/api/tasks/delete', { data: { taskId } });
      fetchTasks();
      notification.success({
        message: 'Task Deleted',
        description: 'Task has been successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      notification.error({
        message: 'Delete Error',
        description: 'Failed to delete task.'
      });
    }
  };

  const showAssignModal = (task) => {
    setSelectedTask(task);
    setIsAssignModalVisible(true);
  };

  const handleAssignModalOk = async (values) => {
    try {
       await axios.post('http://localhost:5000/api/tasks/assign', {
        taskId: selectedTask._id,
        userId: values.employee
      });
      fetchTasks();
      setIsAssignModalVisible(false);
      notification.success({
        message: 'Employee Assigned',
        description: 'Employee has been successfully assigned to the task.'
      });
    } catch (error) {
      console.error('Error assigning employee:', error);
      notification.error({
        message: 'Assign Error',
        description: 'Failed to assign employee to the task.'
      });
    }
  };

  const handleAssignModalCancel = () => {
    setIsAssignModalVisible(false);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Assigned To',
      dataIndex: ['assignedTo', 'email'], 
      key: 'assignedTo',
      render: (assignedTo) => assignedTo ? assignedTo : 'Unassigned',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Tooltip title="Edit Task">
            <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(record)}></Button>
          </Tooltip>
          <Tooltip title="Delete Task">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record._id)}></Button>
          </Tooltip>
        </span>
      ),
    },
    {
        title: "Reassign",
        key: "reassign",
        render: (record) => (
          <Tooltip title="Assign Employee">
            <Button type="primary" onClick={() => showAssignModal(record)}>Assign Employee <UserAddOutlined /></Button>
          </Tooltip>
        )     
    },
  ];

  return (
    <div style={{ padding: '16px' }}>
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>Tasks</h1>
      <Button type="primary" style={{ marginBottom: '16px'  }} onClick={showAddModal}>
        Add New Task <PlusCircleOutlined />
      </Button>
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={tasks}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={false}
          style={{overflowY:"auto", overflowX:"auto"}}
        />
      )}

      {/* Add New Task Modal */}

      <Modal
        title="Add New Task"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
      >
        <Form onFinish={handleAddModalOk}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter the task title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <Input type="date" />
          </Form.Item>
          {/* <Form.Item
            name="department"
            label="Department"
          >
            <Select>
              {departments.map(dept => (
                <Option key={dept._id} value={dept._id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item
            name="assignedTo"
            label="Assign To"
          >
            <Select>
              {employees.map(employee => (
                <Option key={employee._id} value={employee._id}>
                  {employee.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

        {/* Edit Tasks Modal */}

      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
      >
        <Form onFinish={handleEditModalOk} initialValues={{
          title: selectedTask ? selectedTask.title : '',
          description: selectedTask ? selectedTask.description : '',
          dueDate: selectedTask ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '',
          department: selectedTask ? selectedTask.department?._id : '',
          assignedTo: selectedTask ? selectedTask.assignedTo?._id : ''
        }}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter the task title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
          >
            <Input type="date" />
          </Form.Item>
          {/* <Form.Item
            name="department"
            label="Department"
          >
            <Select>
              {departments.map(dept => (
                <Option key={dept._id} value={dept._id}>
                  {dept.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="assignedTo"
            label="Assign To"
          >
            <Select>
              {employees.map(employee => (
                <Option key={employee._id} value={employee._id}>
                  {employee.name}
                </Option>
              ))}
            </Select>
          </Form.Item> */}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Assign Employee Modal */}
      <Modal
        title="Assign Employee"
        visible={isAssignModalVisible}
        onCancel={handleAssignModalCancel}
        footer={null}
      >
        <Form onFinish={handleAssignModalOk}>
          <Form.Item
            name="employee"
            label="Employee"
            rules={[{ required: true, message: 'Please select an employee' }]}
          >
            <Select>
              {employees.map(employee => (
                <Option key={employee._id} value={employee._id}>
                  {employee.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
            {loading ? 'Assigning' : 'Assign'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
