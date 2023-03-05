import './App.css'
import 'antd/dist/reset.css';
import { Layout, Space, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { contentStyle } from './css/layout';
import SidebarMenu from './components/SidebarMenu';
import EmployeeTables from './pages/EmployeeTable';
import { Fragment } from 'react';
import { RouterProvider, Link, createBrowserRouter} from 'react-router-dom'
import LoginPage from './pages/LoginPage';

const { Header, Content } = Layout;
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Space direction="vertical" style={{ width: '100%' }} size={[0, 48]}>
          <Layout>
            <Header className="m-header">
              <div className='logo'/>
              <Space direction="vertical" size={16}>
                <Avatar size={48} icon={<UserOutlined />} />
              </Space>
            </Header>
            <Layout>
              <SidebarMenu />
                
              <Content style={contentStyle}>
                <EmployeeTables/>
              </Content>
            </Layout>
          </Layout>
        </Space>
    ),
  },
  {
    path: "login",
    element: <LoginPage/>,
  },
]);

function App() {
  return (
      <Fragment>
        <RouterProvider router={router}/>
      </Fragment>
  )
}

export default App
