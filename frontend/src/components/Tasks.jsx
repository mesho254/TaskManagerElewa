import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Table, notification, Spin, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, UserAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment'

const { Option } = Select;
const { confirm } = Modal;

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();


  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        title: selectedTask.title,
        description: selectedTask.description,
        dueDate: selectedTask.dueDate && new Date(selectedTask.dueDate).toISOString().split('T')[0],
        department: selectedTask.department?._id,
        assignedTo: selectedTask.assignedTo?._id,
      });
    }
  }, [selectedTask, form]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/tasks');
      setTasks(res.data.tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get('https://task-manager-elewa-94jv.vercel.app/api/auth/employee');
      setEmployees(res.data.employees);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const showAddModal = () => {
    setIsAddModalVisible(true);
  };

  const handleAddModalOk = async (values) => {
    setLoading(true)
    try {
      await axios.post('https://task-manager-elewa-94jv.vercel.app/api/tasks/create', values);
      fetchTasks();
      setIsAddModalVisible(false);
      setLoading(false)
      form.resetFields()
      notification.success({
        message: 'Task Added',
        description: 'Task has been successfully added.'
      });
    } catch (error) {
      console.error('Error adding task:', error);
      setLoading(false)
      notification.error({
        message: 'Add Error',
        description: 'Failed to add task.'
      });
    }
  };

  const handleAddModalCancel = () => {
    setIsAddModalVisible(false);
    form.resetFields()
  };

  const showEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalVisible(true);
  };

  const handleEditModalOk = async (values) => {
    setLoading(true)
    try {
      await axios.put('https://task-manager-elewa-94jv.vercel.app/api/tasks/update', { ...values, taskId: selectedTask._id });
      fetchTasks();
      setIsEditModalVisible(false);
      setLoading(false)
      notification.success({
        message: 'Task Updated',
        description: 'Task has been successfully updated.'
      });
    } catch (error) {
      console.error('Error updating task:', error);
      setLoading(false)
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
    setLoading(true)
    try {
      await axios.delete('https://task-manager-elewa-94jv.vercel.app/api/tasks/delete', { data: { taskId } });
      fetchTasks();
      setLoading(false)
      notification.success({
        message: 'Task Deleted',
        description: 'Task has been successfully deleted.'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      setLoading(false)
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
    setLoading(true)
    try {
       await axios.post('https://task-manager-elewa-94jv.vercel.app/api/tasks/assign', {
        taskId: selectedTask._id,
        userId: values.employee
      });
      fetchTasks();
      setIsAssignModalVisible(false);
      setLoading(false)
      notification.success({
        message: 'Employee Assigned',
        description: 'Employee has been successfully assigned to the task.'
      });
    } catch (error) {
      console.error('Error assigning employee:', error);
      setLoading(false)
      notification.error({
        message: 'Assign Error',
        description: 'Failed to assign employee to the task.'
      });
    }
  };

  const handleAssignModalCancel = () => {
    setIsAssignModalVisible(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value.toLowerCase());
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchText) ||
    (task.assignedTo && task.assignedTo.email.toLowerCase().includes(searchText))
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'grey';
      case 'in progress':
        return 'blue';
      case 'done':
        return 'green';
      default:
        return 'grey';
    }
  };

  const getStatusTextColor = (status) => {
    return { color: getStatusColor(status) };
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
      render: (text) => (text ? moment(text).format('DD MMM, YYYY') : 'N/A'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={getStatusTextColor(status)}>
          <span style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: getStatusColor(status),
            marginRight: 8
          }}></span>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
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
    <div style={{ padding: '16px', marginBottom:"100px" }}>
      <h1 style={{ textAlign: "center", marginTop: "100px" }}>Tasks</h1>
      <Button type="primary" style={{ marginBottom: '16px'  }} onClick={showAddModal}>
        Add New Task <PlusCircleOutlined />
      </Button>
      <Input
        placeholder="Search by title or assigned user email"
        value={searchText}
        onChange={handleSearch}
        style={{ marginBottom: '16px' }}
      />
      {loading ? (
        <div style={{ textAlign: 'center', paddingTop: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={filteredTasks}
          columns={columns}
          rowKey={(record) => record._id}
          pagination={false}
          style={{overflowY:"auto", overflowX:"auto", maxHeight:"500px"}}
        />
      )}

      {/* Add New Task Modal */}

      <Modal
        title="Add New Task"
        visible={isAddModalVisible}
        onCancel={handleAddModalCancel}
        footer={null}
        style={{overflowY:"auto", zIndex:4000, marginBottom:"200px"}}
      >
        <Form style={{overflowY:"auto", zIndex:4000}} form={form} onFinish={handleAddModalOk} >
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
          <Form.Item
            name="assignedTo"
            label="Assign To"
          >
            <Select style={{overflowY:"auto", zIndex:4000}}>
              {employees.map(employee => (
                <Option key={employee._id} value={employee._id}>
                  {employee.email}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {loading ? 'Saving' : 'Save'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

         {/* Edit Task Modal */}

      <Modal
        title="Edit Task"
        visible={isEditModalVisible}
        onCancel={handleEditModalCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleEditModalOk}
        >
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
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Saving' : 'Save'}
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
            <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Assigning' : 'Assign'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Tasks;
