import "antd/dist/reset.css";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import { FunctionComponent } from "react";
import { AuthenticatedRoute } from "./components/AuthenticatedRoute";
import { BrowserRouter, Navigate, Route, RouterProvider, Routes } from "react-router-dom";
import { DASHBOARD_ROUTES } from "./lib/constants/routes";
import { GlobalContext } from "./lib/context";
import LoginPage from "./pages/LoginPage";
import notification from "antd/es/notification";
import Modal, { ModalFuncProps } from "antd/es/modal";
import OverviewPage from "./pages/overview/Overview";
import ConfigProvider from "antd/es/config-provider";
import MyProfilePage from "./pages/MyProfile";
import RentProviderList from "./pages/provider/RentProviderList";
import TenantList from "./pages/tenant/TenantList";
import Error404Page from "./pages/Error404Page";
import message from "antd/es/message";
import { NoticeType } from "antd/es/message/interface";
import LocationList from "./pages/location/LocationList";
import LocationDetail from "./pages/location/LocationDetail";
import { globalTheme } from "./css/theme";
import { ServiceClient } from "./lib/clients";
import { Divider, Flex } from "antd";
import ExpenseList from "./pages/expense/ExpenseList";

export type NotificationType = "success" | "info" | "warning" | "error";
export type ConfirmType = ModalFuncProps["type"];

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
        style: { backgroundColor: globalTheme.token.colorPrimary, borderRadius: globalTheme.token.borderRadius },
      },
      okText: "Submit",
      onOk(...args) {
        return confirmHandler();
      },
      cancelButtonProps: {
        style: { borderRadius: globalTheme.token.borderRadius },
      },
    });
  };

  return (
    <ConfigProvider theme={globalTheme}>
      <GlobalContext.Provider
        value={{
          authUser: { userId: 1, name: "Nguyen Huu Loc", role: "Administrator" },
          serviceClient: ServiceClient(),
          useNotify: openNotification,
          useToast: openToast,
          useConfirm: openConfirm,
        }}
      >
        {messageContextHolder}
        {notifyContextHolder}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <Dashboard />
                </AuthenticatedRoute>
              }
              errorElement={<Error404Page />}
            >
              <Route index element={<Navigate to={DASHBOARD_ROUTES.OVERVIEW} replace />} />
              <Route path={DASHBOARD_ROUTES.OVERVIEW} element={<OverviewPage />} />
              <Route path={DASHBOARD_ROUTES.PROVIDER} element={<RentProviderList />} />
              <Route path={DASHBOARD_ROUTES.TENANT} element={<TenantList />} />
              <Route path={DASHBOARD_ROUTES.LOCATION_DETAIL} element={<LocationDetail />} />
              <Route path={DASHBOARD_ROUTES.LOCATION} element={<LocationList />} />
              <Route path={DASHBOARD_ROUTES.EXPENSE} element={<ExpenseList />} />
              <Route path={DASHBOARD_ROUTES.SCHEDULE} />
              <Route path={DASHBOARD_ROUTES.MY_PROFILE} element={<MyProfilePage />} />
              {/* <Route path="*" element={<Error404Page />} /> */}
            </Route>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContext.Provider>
    </ConfigProvider>
  );
};

export default App;
