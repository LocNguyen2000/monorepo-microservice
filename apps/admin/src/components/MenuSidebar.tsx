import { FunctionComponent } from "react";
import { Menu } from "antd";
import { siderStyle } from "../css/layout";
import { formatAntdMenuByList } from "../lib/utils";
import { IAntdMenuItem } from "../lib/interface";
import { MENU_LIST } from "../pages/Dashboard";
import MenuItem from "antd/es/menu/MenuItem";

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
    <Menu
      title="Workbench Administrator"
      theme="light"
      mode="inline"
      className="override-antd-menu-item"
      onClick={(info) => setSelect(info.key)}
      items={formatAntdMenuByList(menuItems)}
      style={siderStyle}
      selectedKeys={[selectedItem.key]}
      defaultOpenKeys={MENU_LIST.filter((t) => t.parentKey === undefined).map(
        (t) => t.key
      )}
      inlineCollapsed={isCollapse}
    ></Menu>
  );
};

export default MenuSidebar;
