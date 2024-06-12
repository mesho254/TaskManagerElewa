import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Text, Link } = Typography;

const AppFooter = () => {
  return (
    <Footer className="footer">
      <Text type="secondary" className="footer-text">
        &copy; 2024 Elewa Task Manager. All Rights Reserved.
      </Text>
      <Text type="secondary" className="footer-text">
        Made with ❤️ by <Link href="https://www.github.com/mesho254">Mesho254</Link>
      </Text>
    </Footer>
  );
};

export default AppFooter;
