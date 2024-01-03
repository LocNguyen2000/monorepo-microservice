import {
  BellFilled,
  HomeOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Typography, Avatar, Popover, Button, Divider, Badge } from "antd";
import { Header } from "antd/es/layout/layout";
import { getGlobalContext, getSideMenuContext } from "../lib/context";
import { headerStyle, navHeaderStyle } from "../css/layout";
import { useNavigate } from "react-router-dom";
import BaseBreadCrum from "./BaseBreadCrum";
import { MENU_LIST } from "../pages/Dashboard";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";

const PopoverMenuHeader = () => {
  const navigate = useNavigate();
  const { setMenuItem } = getSideMenuContext();

  return (
    <>
      <Divider />
      <Button
        style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}
        onClick={() => {
          const [mePage] = MENU_LIST.filter(
            (i) => i.path && i.path == DASHBOARD_ROUTES.MY_PROFILE
          );

          setMenuItem(mePage);
          navigate(DASHBOARD_ROUTES.MY_PROFILE);
        }}
      >
        My Profile
      </Button>
      <br />
      <Button style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}>
        Settings
      </Button>
      <br />
      <Button style={{ width: "100%", height: "2rem", marginBottom: "0.5rem" }}>
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
  const { menuItem } = getSideMenuContext();

  console.log(menuItem);

  return (
    <>
      <Header style={headerStyle}>
        <div className="logo" />
        <Typography
          style={{
            marginRight: "1rem",
            fontSize: "1rem",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Rent House Workbench
        </Typography>

        <span style={{ flex: 1 }}></span>
        <div style={{ marginRight: "1.5rem" }}>
          <Badge
            showZero
            count={4}
            overflowCount={10}
            size="small"
            color="geekblue"
          >
            <Avatar
              className="m-hoverable"
              shape="square"
              size={40}
              icon={<BellFilled />}
              style={{ cursor: "pointer" }}
            />
          </Badge>
        </div>

        <Typography style={{ color: "white", marginRight: "1rem" }}>
          {authUser?.name}
        </Typography>
        <Popover
          content={<PopoverMenuHeader />}
          title={<PopoverMenuTitle />}
          overlayStyle={{
            width: "15vw",
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
