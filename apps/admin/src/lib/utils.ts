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
    title: label,
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

export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}


export const formatMoney = (amount: number) => Intl.NumberFormat().format(amount)
export const parseMoney = (money: string) => {
  const cleanedStr = money.replace(/[^\d.-]/g, '');
  const amount = parseInt(cleanedStr);
  return isNaN(amount) ? null : amount;
}


export const autoGenerateNewCode = (arrayData: unknown[], primaryKey: string) => {
  const codes = arrayData
    .map((record) => Number((record as Record<string, unknown>)[primaryKey]))
    .filter(Number.isFinite);

  return codes.reduce((maximum, code) => Math.max(maximum, code), 0) + 1;
};

export const autoGenerateNewCodeFromPages = async <T>(
  loadPage: (page: number, size: number) => Promise<{ total: number; data: T[] }>,
  primaryKey: keyof T,
) => {
  const pageSize = 100;
  const firstPage = await loadPage(1, pageSize);
  const pageCount = Math.ceil(firstPage.total / pageSize);
  const remainingPages = await Promise.all(
    Array.from({ length: Math.max(0, pageCount - 1) }, (_, index) =>
      loadPage(index + 2, pageSize),
    ),
  );

  return autoGenerateNewCode(
    [firstPage, ...remainingPages].flatMap((page) => page.data),
    String(primaryKey),
  );
};


