import { FunctionComponent } from "react";
import { Divider, Menu, Typography } from "antd";
import { headerHight, siderStyle } from "../css/layout";
import { formatAntdMenuByList } from "../lib/utils";
import { IAntdMenuItem } from "../lib/interface";
import { MENU_LIST } from "../pages/Dashboard";

interface MenuSidebarProps {
  selectedItem: IAntdMenuItem;
  menuItems: IAntdMenuItem[];
  setSelect: (item: any) => void;
  isCollapse: boolean;
}

const MenuSidebar: FunctionComponent<MenuSidebarProps> = ({
  menuItems,
  selectedItem,
  setSelect,
  isCollapse,
}) => {
  console.log("selected >", selectedItem);

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
          style={{ fontWeight: "bold", fontSize: "1rem", textAlign: "center" }}
        >
          RentHouse Workbench
        </Typography>
      </div>
      <Divider />

      <Menu
        title="Workbench Administrator"
        theme="light"
        mode="inline"
        className="override-antd-menu-item"
        onClick={(info) => setSelect(info.key)}
        items={formatAntdMenuByList(menuItems)}
        selectedKeys={[selectedItem.key]}
        defaultOpenKeys={MENU_LIST.filter((t) => t.parentKey === undefined).map(
          (t) => t.key
        )}
        inlineCollapsed={isCollapse}
      />
    </div>
  );
};

export default MenuSidebar;
