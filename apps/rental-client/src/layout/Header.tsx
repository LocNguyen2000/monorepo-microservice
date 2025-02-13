import { Layout, Button, Menu, MenuProps } from "antd";
import { HomeOutlined, BarChartOutlined, FileDoneOutlined } from "@ant-design/icons";
import { ProtectedRoles } from "../components/util/ProtectedRoles";
import { AccountRoleEnum } from "../lib/constant";
import ButtonGroup from "antd/es/button/button-group";
import { useState } from "react";

const { Header } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const items: MenuItem[] = [
  {
    label: "Quản lý nhà trọ",
    key: "mail",
    icon: <HomeOutlined  className="override-antd-icon-item"/>,
  },
  {
    label: "Các đơn thuê nhà",
    key: "app",
    icon: <FileDoneOutlined className="override-antd-icon-item"/>,
  },
];

const HeaderComponent = () => {
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };
  return (
    <Header className="header">
      <div className="up"> 
        <h1 className="header-title">Web Thuê Nhà Tiện Lợi</h1>
        
      </div>

      <ProtectedRoles roles={[AccountRoleEnum["Rent Owner"]]} children={
        <Menu className="override-theme" onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      } />
    </Header>
  );
};

export default HeaderComponent;
