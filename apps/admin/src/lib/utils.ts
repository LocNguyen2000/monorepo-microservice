import { MenuProps } from "antd/es/menu";
import { IAntdMenuItem } from "./interface";

export type MenuItem = Required<MenuProps>["items"][number];

export function formatAntdMenu(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

export function formatAntdMenuByList(menuItems: IAntdMenuItem[]) {
  const formattedItems: MenuProps["items"] = [];

  for (let item of menuItems) {
    if (item.hidden) continue;

    if (!item.parentKey) {
      // this is a parent menu item
      const childMenu = menuItems
        .filter((t) => t.parentKey && t.parentKey === item.key)
        .map((t) => formatAntdMenu(t.text, t.key, t.icon));

      if (childMenu.length > 0)
        formattedItems.push(
          formatAntdMenu(item.text, item.key, item.icon, childMenu)
        );
      else formattedItems.push(formatAntdMenu(item.text, item.key, item.icon));
    }
  }
  return formattedItems;
}

export function findAntdItemAndExecute(
  item: IAntdMenuItem,
  data: IAntdMenuItem[],
  callback: () => any
) {}
