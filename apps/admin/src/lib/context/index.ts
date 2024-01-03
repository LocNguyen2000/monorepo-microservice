import { Component, createContext, useContext } from "react";
import { NotificationType } from "../../App";
import { IAntdMenuItem } from "../interface";
import { NoticeType } from "antd/es/message/interface";

export interface IGlobalContext {
  authUser?: Record<string, unknown>;
  useNotify: (type: NotificationType, title: string, message: string) => void;
  useToast: (type: NoticeType, message: string) => void;
}

export const GlobalContext = createContext<IGlobalContext | null>(null);

export const getGlobalContext = (): IGlobalContext => {
  const globalContext = useContext(GlobalContext);

  if (!globalContext) {
    throw new Error("global context must be used in GlobalProvider");
  }

  return globalContext;
};

// Side Menu

export interface ISideMenuContext {
  menuItem: IAntdMenuItem;
  setMenuItem: ({ ...rest }: IAntdMenuItem) => void;
}

export const SideMenuContext = createContext<ISideMenuContext | null>(null);

export const getSideMenuContext = (): ISideMenuContext => {
  const menuContext = useContext(SideMenuContext);

  if (!menuContext) {
    throw new Error("global context must be used in GlobalProvider");
  }

  return menuContext;
};
