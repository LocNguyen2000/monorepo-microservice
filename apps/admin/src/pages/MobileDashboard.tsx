import {
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Drawer, Layout, Menu, Popover, Typography } from "antd";
import { FunctionComponent, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getGlobalContext } from "../lib/context";
import { IAntdMenuItem } from "../lib/interface";
import { formatAntdMenuByList } from "../lib/utils";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";

interface MobileDashboardProps {
  menuItem: IAntdMenuItem;
  menuItems: IAntdMenuItem[];
  onNavigate: (selectedItemKey: string) => void;
}

const MobileDashboard: FunctionComponent<MobileDashboardProps> = ({
  menuItem,
  menuItems,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { authUser, serviceClient, setAuthUser } = getGlobalContext();
  const navigate = useNavigate();
  const mePage = menuItems.find(
    (item) => item.path === DASHBOARD_ROUTES.MY_PROFILE,
  );

  const signOut = () => {
    serviceClient
      .post("auth/logout", {
        sessionId: localStorage.getItem("sessionId"),
      })
      .finally(() => {
        setAuthUser(undefined);
        navigate("/login", { replace: true });
      });
  };

  return (
    <Layout className="mobile-dashboard">
      <header className="mobile-dashboard-header">
        <Button
          aria-label="Open navigation"
          icon={<MenuOutlined />}
          type="text"
          className="mobile-dashboard-menu-button"
          onClick={() => setIsMenuOpen(true)}
        />
        <Typography.Text className="mobile-dashboard-title" strong>
          {menuItem.text}
        </Typography.Text>
        <Popover
          trigger="click"
          content={
            <div className="mobile-dashboard-account-menu">
              <Typography.Text>{authUser?.name}</Typography.Text>
              <Button
                block
                onClick={() => {
                  if (mePage) onNavigate(mePage.key);
                }}
              >
                Trang cá nhân
              </Button>
              <Button block danger onClick={signOut}>
                Đăng xuất
              </Button>
            </div>
          }
        >
          <Avatar
            aria-label="Account menu"
            icon={<UserOutlined />}
            style={{
              cursor: "pointer",
              flex: "none",
              backgroundColor: "#4CAF50",
            }}
          />
        </Popover>
      </header>

      <main className="mobile-dashboard-content m-background-dashboard">
        <Outlet />
      </main>

      <Drawer
        title="Quản lý nhà trọ"
        placement="left"
        rootClassName="mobile-dashboard-drawer"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        width={280}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          items={formatAntdMenuByList(menuItems)}
          selectedKeys={[menuItem.key]}
          onClick={({ key }) => {
            onNavigate(key);
            setIsMenuOpen(false);
          }}
        />
      </Drawer>
    </Layout>
  );
};

export default MobileDashboard;