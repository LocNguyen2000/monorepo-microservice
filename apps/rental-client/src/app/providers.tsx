"use client";

import { useState } from "react";
import { ConfigProvider, Divider, Flex, Modal, message, notification } from "antd";
import { NoticeType } from "antd/es/message/interface";
import { AccountClient, ServiceClient } from "../lib/axios";
import { ConfirmType, GlobalContext, NotificationType } from "../lib/context";
import { IAuthUser } from "../lib/interface";
import { globalTheme } from "../lib/theme";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  const [authUser, setAuthUser] = useState<IAuthUser>(null);
  const [api, notifyContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const openToast = (type: NoticeType, content: string) => {
    messageApi.open({ type, content, className: "override-antd-message" });
  };

  const openNotification = (type: NotificationType, title = "Notification Title", description = "") => {
    api[type]({ message: title, description });
  };

  const openConfirm = (type: ConfirmType, title: string, content: string, confirmHandler: () => void) => {
    Modal.confirm({
      centered: true,
      type,
      title,
      content,
      footer: (_, { OkBtn, CancelBtn }) => (
        <>
          <Divider />
          <Flex style={{ justifyContent: "flex-end" }}>
            <CancelBtn />
            <OkBtn />
          </Flex>
        </>
      ),
      okText: "Submit",
      onOk: confirmHandler,
    });
  };

  return (
    <ConfigProvider theme={globalTheme}>
      <GlobalContext.Provider
        value={{
          authUser,
          setAuthUser,
          accountClient: AccountClient(),
          serviceClient: ServiceClient(),
          useNotify: openNotification,
          useToast: openToast,
          useConfirm: openConfirm,
        }}
      >
        {messageContextHolder}
        {notifyContextHolder}
        {children}
      </GlobalContext.Provider>
    </ConfigProvider>
  );
}