import "antd/dist/reset.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { FunctionComponent } from "react";
import { AuthenticatedRoute } from "./components/AuthenticatedRoute";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DASHBOARD_ROUTES } from "./lib/constants/routes";
import { GlobalContext } from "./lib/context";
import LoginPage from "./pages/LoginPage";
import notification from "antd/es/notification";
import OverviewPage from "./pages/overview/Overview";
import ConfigProvider from "antd/es/config-provider";
import MyProfilePage from "./pages/MyProfile";
import RentProviderTable from "./pages/provider/RentProviderTable";
import TenantTable from "./pages/tenant/TenantTable";
import Error404Page from "./pages/Error404Page";
import message from "antd/es/message";
import { NoticeType } from "antd/es/message/interface";
import { messageStyle } from "./css/messsage";

export type NotificationType = "success" | "info" | "warning" | "error";
export type ToastType = "success" | "info" | "warning" | "error";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <Dashboard />
      </AuthenticatedRoute>
    ),
    errorElement: <Error404Page />,
    children: [
      {
        path: DASHBOARD_ROUTES.PROVIDER,
        element: <RentProviderTable />,
      },
      {
        path: DASHBOARD_ROUTES.TENANT,
        element: <TenantTable />,
      },
      {
        path: DASHBOARD_ROUTES.OVERVIEW,
        element: <OverviewPage />,
      },
      {
        path: DASHBOARD_ROUTES.MY_PROFILE,
        element: <MyProfilePage />,
      },
    ],
  },
]);

interface AppProps {}

const App: FunctionComponent<AppProps> = () => {
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

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "GoogleRoboto",
          },
        }}
      >
        <GlobalContext.Provider
          value={{
            authUser: { userID: 1, name: "Nguyen Huu Loc" },
            useNotify: openNotification,
            useToast: openToast,
          }}
        >
          {messageContextHolder}
          {notifyContextHolder}
          <RouterProvider router={router} />
        </GlobalContext.Provider>
      </ConfigProvider>
    </>
  );
};

export default App;
