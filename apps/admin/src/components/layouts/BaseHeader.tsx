import { UserOutlined } from "@ant-design/icons";
import { Typography, Avatar, Popover, Button, Divider } from "antd";
import { Header } from "antd/es/layout/layout";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { headerStyle, navHeaderStyle } from "../../css/layout";
import { useNavigate } from "react-router-dom";
import BaseBreadCrum from "../BaseBreadCrum";
import { MENU_LIST } from "../../pages/Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import WebSocketComponent from "../../pages/Websocket";

const PopoverMenuHeader = () => {
  const navigate = useNavigate();
  const { setPathFromKey } = getPathContext();
  const { setAuthUser, serviceClient } = getGlobalContext();

  return (
    <>
      <Divider />
      <Button
        block
        className="account-menu-action"
        onClick={() => {
          const [mePage] = MENU_LIST.filter(
            (i) => i.path && i.path == DASHBOARD_ROUTES.MY_PROFILE,
          );

          setPathFromKey(mePage.key);
        }}
      >
        Trang cá nhân
      </Button>
      <Button
        block
        className="account-menu-action"
        onClick={() => {
          serviceClient.post("auth/logout", {
            sessionId: localStorage.getItem("sessionId"),
          }).finally(() => {
            setAuthUser(undefined);
            navigate("/login", { replace: true });
          });
        }}
      >
        Đăng xuất
      </Button>
    </>
  );
};

const PopoverMenuTitle = () => {
  const { authUser } = getGlobalContext();
  return <Typography.Text ellipsis>{authUser.email}</Typography.Text>;
};

const BaseHeader = () => {
  const { authUser } = getGlobalContext();
  const { menuItem } = getPathContext();

  return (
    <>
      <Header className="admin-topbar" style={headerStyle}>
        <Typography.Text className="admin-topbar-name">
          {authUser?.name}
        </Typography.Text>
        <Popover
          content={<PopoverMenuHeader />}
          title={<PopoverMenuTitle />}
          overlayStyle={{
            width: "15rem",
          }}
          trigger={"click"}
        >
          <Avatar
            className="admin-account-avatar"
            shape="circle"
            size={40}
            icon={<UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Popover>
      </Header>

      <Header className="admin-subnav" style={navHeaderStyle}>
        <WebSocketComponent url={process.env.ADMIN_WEBSOCKET_SERVICE} />

        <BaseBreadCrum selectedMenu={menuItem} />
      </Header>
    </>
  );
};

export default BaseHeader;
