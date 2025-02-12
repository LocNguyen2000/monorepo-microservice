import { NoticeType } from "antd/es/message/interface";
import { AxiosInstance } from "axios";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { IAuthUser } from "../interface";
import { ModalFuncProps } from "antd";

export type NotificationType = "success" | "info" | "warning" | "error";
export type ConfirmType = ModalFuncProps["type"];

export interface IGlobalContext {
    authUser?: IAuthUser;
    setAuthUser?: Dispatch<SetStateAction<IAuthUser>>;
    accountClient: AxiosInstance;
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