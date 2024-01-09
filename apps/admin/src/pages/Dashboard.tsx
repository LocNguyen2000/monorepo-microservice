import {
  UserOutlined,
  AppstoreOutlined,
  HomeOutlined,
  SettingOutlined,
  ScheduleOutlined,
  FundViewOutlined,
  CalculatorOutlined,
  MoneyCollectOutlined,
  BarChartOutlined,
  ProfileOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Space, Layout } from "antd";
import { FunctionComponent, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import MenuSidebar from "../components/MenuSidebar";
import { contentStyle } from "../css/layout";
import { IAntdMenuItem } from "../lib/interface";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";
import BaseHeader from "../components/BaseHeader";
import TenantList from "./tenant/TenantList";
import RentProviderList from "./provider/RentProviderList";
import OverviewPage from "./overview/Overview";
import MyProfilePage from "./MyProfile";
import { SideMenuContext } from "../lib/context";
import LocationList from "./location/LocationList";

interface DashboardProps {}

const { Content } = Layout;

export const MENU_LIST: IAntdMenuItem[] = [
  {
    text: "Overview",
    key: "10",
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
    // parentKey: "0",
  },
  // {
  //   text: "Inventory",
  //   key: "3",
  //   icon: <AppstoreOutlined className="override-antd-icon-item" />,
  // },
  {
    text: "Locations",
    key: "4",
    icon: <HomeOutlined className="override-antd-icon-item" />,
    // parentKey: "3",
    path: DASHBOARD_ROUTES.LOCATION,
  },
  {
    text: "Invoices",
    key: "8",
    icon: <MoneyCollectOutlined className="override-antd-icon-item" />,
    // parentKey: "7",
  },
  {
    text: "Settings",
    key: "5",
    icon: <SettingOutlined className="override-antd-icon-item" />,
    // parentKey: "3",
    path: DASHBOARD_ROUTES.SETTING,
  },
  {
    text: "Schedules",
    key: "6",
    icon: <ScheduleOutlined className="override-antd-icon-item" />,
    // parentKey: "3",
    path: DASHBOARD_ROUTES.SCHEDULE,
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
  {
    text: "My Profile",
    key: "11",
    icon: <UserOutlined className="override-antd-icon-item" />,
    path: DASHBOARD_ROUTES.MY_PROFILE,
    hidden: true,
  },
];

const Dashboard: FunctionComponent<DashboardProps> = () => {
  const [menuItem, setMenuItem] = useState<IAntdMenuItem>(MENU_LIST[0]);
  const [isCollapse, setIsCollapse] = useState<boolean>(false);
  const navigate = useNavigate();

  const onChangeMenuItem = (selectedItemKey: string) => {
    const selected = MENU_LIST.find((item) => item.key === selectedItemKey);
    if (selected) setMenuItem(selected);
  };

  useEffect(() => {
    console.log("changed", menuItem);

    if (menuItem.path) {
      navigate(menuItem.path);
    }
  }, [menuItem]);

  return (
    <SideMenuContext.Provider
      value={{ menuItem, setMenuItem: (value) => setMenuItem(value) }}
    >
      <Space direction="vertical">
        <Layout>
          <MenuSidebar
            menuItems={MENU_LIST}
            selectedItem={menuItem}
            setSelect={onChangeMenuItem}
            isCollapse={isCollapse}
          />

          <BaseHeader />

          <Content style={contentStyle} className="m-content-child-margin">
            <Routes>
              <Route path={DASHBOARD_ROUTES.TENANT} element={<TenantList />} />
              <Route
                path={DASHBOARD_ROUTES.PROVIDER}
                element={<RentProviderList />}
              />
              <Route
                path={DASHBOARD_ROUTES.OVERVIEW}
                element={<OverviewPage />}
              />
              <Route
                path={DASHBOARD_ROUTES.LOCATION}
                element={<LocationList />}
              />
              <Route
                path={DASHBOARD_ROUTES.MY_PROFILE}
                element={<MyProfilePage />}
              />
            </Routes>
          </Content>
        </Layout>
      </Space>
    </SideMenuContext.Provider>
  );
};

export default Dashboard;
