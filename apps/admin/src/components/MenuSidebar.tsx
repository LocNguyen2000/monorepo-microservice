import { FunctionComponent, useContext } from "react";
import { Divider, Menu, Typography } from "antd";
import { headerHight, siderStyle } from "../css/layout";
import { formatAntdMenuByList } from "../lib/utils";
import { IAntdMenuItem } from "../lib/interface";
import { MENU_LIST } from "../pages/Dashboard";
import { PathContext } from "../lib/context";

interface MenuSidebarProps {
  menuItems: IAntdMenuItem[];
  isCollapse: boolean;
}

const MenuSidebar: FunctionComponent<MenuSidebarProps> = ({ menuItems, isCollapse }) => {
  const { menuItem, setPathFromKey } = useContext(PathContext);

  return (
    <div style={siderStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "2px",
        }}
      >
        <div className="logo" />
        <Typography
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            textAlign: "center",
            color: "white",
          }}
        >
          Rental Workbench
        </Typography>
      </div>
      <Divider />

      <Menu
        // theme="dark"
        mode="inline"
        className="override-antd-menu-item"
        onClick={(info) => setPathFromKey(info.key)}
        items={formatAntdMenuByList(menuItems)}
        selectedKeys={[menuItem.key]}
        defaultOpenKeys={MENU_LIST.filter((t) => t.parentKey === undefined).map((t) => t.key)}
        inlineCollapsed={isCollapse}
      />
    </div>
  );
};

export default MenuSidebar;
