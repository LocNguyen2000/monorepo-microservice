import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RentalPage from './components/RentalPage'
import { notification, message, Modal, Divider, Flex } from 'antd'
import { NoticeType } from 'antd/es/message/interface'
import { NotificationType, ConfirmType, GlobalContext } from './lib/context'
import { AccountClient } from './lib/axios'
import { useState } from 'react'
import { IAuthUser } from './lib/interface'
import { ScreenRoutes } from './lib/constant'
import { AuthenticatedRoute } from './components/AuthenticatedRoute'

function App() {
  const [authUser, setAuthUser] = useState<IAuthUser>(null)
  const [api, notifyContextHolder] = notification.useNotification();
  const [messageApi, messageContextHolder] = message.useMessage();

  const openToast = (type: NoticeType, content: string) => {
    messageApi.open({
      type,
      content,
      className: "override-antd-message",
    });
  };

  const openNotification = (
    type: NotificationType,
    title: string = "Notification Title",
    message: string = "This is the content of the notification. This is the content of the notification. This is the content of the notification."
  ) => {
    api[type]({
      message: title,
      description: message,
    });
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
      okButtonProps: {
        type: "primary",
        // style: { backgroundColor: globalTheme.token.colorPrimary, borderRadius: globalTheme.token.borderRadius },
      },
      okText: "Submit",
      onOk(...args) {
        return confirmHandler();
      },
      cancelButtonProps: {
        // style: { borderRadius: globalTheme.token.borderRadius },
      },
    });
  };
  return (
    <GlobalContext.Provider
      value={{
        authUser: null,
        setAuthUser,
        accountClient: AccountClient(),
        useNotify: openNotification,
        useToast: openToast,
        useConfirm: openConfirm,
      }}
    >
    {messageContextHolder}
    {notifyContextHolder}
      <BrowserRouter>
          <Routes>
            <Route path={"/"} element={<AuthenticatedRoute><RentalPage/></AuthenticatedRoute>}/>
            <Route path={ScreenRoutes.Login} element={<LoginPage/>}/>
            <Route path={ScreenRoutes.Register} element={<RegisterPage/>}/>
            <Route index path={ScreenRoutes.Home} element={<RentalPage/>}/>
          </Routes>
        </BrowserRouter>
    </GlobalContext.Provider>
)
}

export default App
