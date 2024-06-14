import React from 'react';
import { Layout, Row, Col, Card, Typography } from 'antd';
import Navbar from '../components/NavBar';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <>
    <Navbar/>
    <Layout style={{ minHeight: '100vh', background:"linear-gradient(135deg, #2980b9, #2c3e50)" }}>
      <Content style={{ padding: '50px 20px', marginTop:"100px" }}>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={16} xl={12}>
            <Card style={{ borderRadius: '10px', overflow: 'hidden' }}>
              <Title level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>About ElewaTaskManager</Title>
              <Paragraph>
                ElewaTaskManager is a cutting-edge task management application designed to help teams and individuals stay organized and productive. Our intuitive interface and powerful features enable you to manage your tasks effortlessly, whether you are working on a small project or a large team collaboration.
              </Paragraph>

              <Title level={3}>Features</Title>
              <Paragraph>
                <ul>
                  <li><strong>Task Tracking:</strong> Create, assign, and track tasks with ease.</li>
                  <li><strong>Project Management:</strong> Organize tasks into projects and monitor their progress.</li>
                  <li><strong>Collaboration:</strong> Share tasks and projects with your team members and collaborate in real-time.</li>
                  <li><strong>Notifications:</strong> Stay informed with email and in-app notifications.</li>
                  <li><strong>Reports and Analytics:</strong> Generate reports to analyze team performance and productivity.</li>
                </ul>
              </Paragraph>

              <Title level={3}>Our Team</Title>
              <Paragraph>
                Our team is composed of dedicated professionals who are passionate about creating the best task management solution for you. From software engineers to customer support, we work tirelessly to ensure that ElewaTaskManager meets your needs.
              </Paragraph>

              <Title level={3}>Contact Us</Title>
              <Paragraph>
                We value your feedback and are here to help you with any questions or issues. Feel free to reach out to us:
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> meshakokelo@gmail.com<br />
                <strong>Phone:</strong> +254 (123) 456-7890
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
    </>
  );
};

export default About;
