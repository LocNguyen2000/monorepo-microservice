import { Component, createContext, useContext } from "react";
import { ConfirmType, NotificationType } from "../../App";
import { IAntdMenuItem, IAuthUser } from "../interface";
import { NoticeType } from "antd/es/message/interface";
import { AxiosInstance } from "axios";

export interface IGlobalContext {
  authUser?: IAuthUser;
  serviceClient: AxiosInstance;
  useNotify: (type: NotificationType, title: string, message: string) => void;
  useToast: (type: NoticeType, message: string) => void;
  useConfirm: (type: ConfirmType, title: string, content: string, confirmHandler: any) => void;
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

export interface IPathContext {
  menuItem: IAntdMenuItem;
  setPathFromKey: (key: string, ...rest) => void;
}

export const PathContext = createContext<IPathContext | null>(null);

export const getPathContext = (): IPathContext => {
  const pathContext = useContext(PathContext);

  if (!pathContext) {
    throw new Error("path context must be used in PathContext Provider");
  }

  return pathContext;
};
