import { FunctionComponent } from "react";
import { Menu } from "antd";
import { siderStyle } from "../css/layout";
import { formatAntdMenuByList } from "../lib/utils";
import { IAntdMenuItem } from "../lib/interface";
import { MENU_LIST } from "../pages/Dashboard";

interface MenuSidebarProps {
  selectedItem: IAntdMenuItem;
  menuItems: IAntdMenuItem[];
  setSelect: (item: any) => void;
}

const MenuSidebar: FunctionComponent<MenuSidebarProps> = ({
  menuItems,
  selectedItem,
  setSelect,
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
    />
  );
};

export default MenuSidebar;
