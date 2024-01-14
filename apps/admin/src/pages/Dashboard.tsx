import {
  UserOutlined,
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  ScheduleOutlined,
  MoneyCollectOutlined,
  BarChartOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Space, Layout } from "antd";
import { FunctionComponent, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import MenuSidebar from "../components/MenuSidebar";
import { contentStyle } from "../css/layout";
import { IAntdMenuItem } from "../lib/interface";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";
import BaseHeader from "../components/BaseHeader";
import { PathContext } from "../lib/context";

interface DashboardProps {}

const { Content } = Layout;

export const MENU_LIST: IAntdMenuItem[] = [
  {
    text: "Overview",
    key: "0",
    icon: <BarChartOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.OVERVIEW,
  },

  {
    text: "Tenants",
    key: "1",
    icon: <UserOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.TENANT,
  },
  {
    text: "Rent Owners",
    key: "2",
    icon: <IdcardOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.PROVIDER,
  },

  {
    text: "Locations",
    key: "4",
    icon: <HomeOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.LOCATION,
  },
  {
    text: "Location Detail",
    key: "12",
    icon: <HomeOutlined className="override-antd-icon-item" />,
    hidden: true,
  },
  {
    text: "Invoices",
    key: "8",
    icon: <MoneyCollectOutlined className="override-antd-icon-item" />,
  },
  {
    text: "Settings",
    key: "5",
    icon: <SettingOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.SETTING,
  },
  {
    text: "Schedules",
    key: "6",
    icon: <ScheduleOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.SCHEDULE,
  },
  {
    text: "My Profile",
    key: "11",
    icon: <UserOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.MY_PROFILE,
    hidden: true,
  },
  // {
  //   text: "Analysis",
  //   key: "7",
  //   icon: <FundViewOutlined className="override-antd-icon-item" />,
  // },
  // {
  //   text: "Rent Calculator",
  //   key: "9",
  //   icon: <CalculatorOutlined className="override-antd-icon-item" />,
  //   parentKey: "7",
  // },
];

const Dashboard: FunctionComponent<DashboardProps> = () => {
  const [menuItem, setMenuItem] = useState<IAntdMenuItem>(MENU_LIST[0]);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const navigate = useNavigate();

  const setPathFromKey = (selectedItemKey: string) => {
    const selected = MENU_LIST.find((item) => item.key === selectedItemKey);
    if (selected) {
      setMenuItem(selected);
      if (selected.path) navigate(selected.path);
    }
  };

  return (
    <PathContext.Provider
      value={{
        menuItem,
        setPathFromKey,
      }}
    >
      <Space direction="vertical">
        <Layout>
          <MenuSidebar menuItems={MENU_LIST} isCollapse={isCollapse} />

          <BaseHeader />

          <Content style={contentStyle} className="m-content-child-margin">
            <Outlet />
          </Content>
        </Layout>
      </Space>
    </PathContext.Provider>
  );
};

export default Dashboard;
