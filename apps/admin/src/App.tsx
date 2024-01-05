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
import theme from "antd/es/theme";

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
      {
        path: DASHBOARD_ROUTES.LOCATION,
      },
      {
        path: DASHBOARD_ROUTES.SETTING,
      },
      {
        path: DASHBOARD_ROUTES.SCHEDULE,
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
    <ConfigProvider
      theme={{
        // algorithm: theme.darkAlgorithm,
        components: {
          //   Button: {
          //     colorPrimary: "#00b96b",
          //     algorithm: true, // Enable algorithm
          //   },
          //   Input: {
          //     colorPrimary: "#0ff594",
          //   },
          Menu: {
            // colorPrimary: "#2f3330",
            algorithm: true,
            colorBgBase: "#2f3330",
            colorText: "white",
            itemHoverBg: "#d4d7dc",
            itemHoverColor: "#4CAF50",
            itemSelectedBg: "#d4d7dc",
            controlItemBgActiveHover: "#2f3330",
            // subMenuItemBg: "#2f3330",
          },
        },
        token: {
          fontFamily: "GoogleRoboto",
          // Seed Token
          colorPrimary: "#4CAF50",
          colorBgTextHover: "#2ca01c",
          borderRadius: 4,
          // colorIcon: "#8b3ec7",
          // Alias Token
          // colorBgContainer: "#f6ffed",
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
  );
};

export default App;
