import {
  BellFilled,
  HomeOutlined,
  InfoCircleOutlined,
  MenuOutlined,
  QuestionCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography, Avatar, Popover, Button, Divider, Badge } from "antd";
import { Header } from "antd/es/layout/layout";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { headerStyle, navHeaderStyle } from "../../css/layout";
import { useNavigate } from "react-router-dom";
import BaseBreadCrum from "../BaseBreadCrum";
import { MENU_LIST } from "../../pages/Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import Input from "antd/es/input/Input";
import WebSocketComponent from "../../pages/Websocket";

const PopoverMenuHeader = () => {
  const navigate = useNavigate();
  const { setPathFromKey } = getPathContext();
  const { setAuthUser, serviceClient } = getGlobalContext();

  return (
    <>
      <Divider />
      <Button
        style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}
        onClick={() => {
          const [mePage] = MENU_LIST.filter(
            (i) => i.path && i.path == DASHBOARD_ROUTES.MY_PROFILE,
          );

          setPathFromKey(mePage.key);
        }}
      >
        My Profile
      </Button>
      <br />
      <Button style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}>
        Settings
      </Button>
      <br />
      <Button
        style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}
        onClick={() => {
          serviceClient.post("auth/logout", {
            sessionId: localStorage.getItem("sessionId"),
          }).finally(() => {
            setAuthUser(undefined);
            navigate("/login", { replace: true });
          });
        }}
      >
        Sign Out
      </Button>
      <br />
    </>
  );
};

const PopoverMenuTitle = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "4rem",
      }}
    >
      <Typography style={{ marginBottom: "0.25rem" }}>Demo Company</Typography>
      <span style={{ fontWeight: "lighter", color: "grey" }}>
        Workbench Administrator
      </span>
    </div>
  );
};

const BaseHeader = () => {
  const { authUser } = getGlobalContext();
  const { menuItem } = getPathContext();

  return (
    <>
      <Header style={headerStyle} color="primary">

        <Typography style={{ color: "white", marginRight: "1rem" }}>
          {authUser?.name}
        </Typography>
        <Popover
          content={<PopoverMenuHeader />}
          title={<PopoverMenuTitle />}
          overlayStyle={{
            width: "15rem",
          }}
          trigger={"click"}
        >
          <Avatar
            className="m-hoverable"
            shape="square"
            size={40}
            icon={<UserOutlined />}
            style={{ cursor: "pointer" }}
          />
        </Popover>
      </Header>

      <Header style={navHeaderStyle}>
        <WebSocketComponent url={process.env.ADMIN_WEBSOCKET_SERVICE} />

        <BaseBreadCrum selectedMenu={menuItem} />

        <Typography style={{ fontWeight: "bold" }}>
          <InfoCircleOutlined style={{ marginRight: "5px" }} />
          Last login: {new Date().toLocaleString()}
        </Typography>
      </Header>
    </>
  );
};

export default BaseHeader;
