import { ThemeConfig } from "antd";

export const globalTheme: ThemeConfig = {
  components: {
    Menu: {
      darkItemBg: "#232f3e",
      darkItemColor: "#d5dbdb",
      darkItemHoverBg: "#334155",
      darkItemSelectedBg: "#3f5063",
      darkItemSelectedColor: "#ffffff",
      darkSubMenuItemBg: "#1b2533",
      itemBorderRadius: 4,
    },
    Input: {
      colorTextDisabled: "#879596",
    },
    Radio: {
      dotColorDisabled: "#879596",
    },
  },
  token: {
    fontFamily: '"Arial", "Helvetica Neue", sans-serif',
    colorPrimary: "#0972d3",
    colorSuccess: "#037f0c",
    colorInfo: "#0972d3",
    colorWarning: "#ff9900",
    colorError: "#d13212",
    colorText: "#16191f",
    colorTextSecondary: "#545b64",
    colorBgBase: "#ffffff",
    colorBgLayout: "#f2f3f3",
    colorBgContainer: "#ffffff",
    colorBgTextHover: "#f2f3f3",
    colorBorder: "#d5dbdb",
    colorPrimaryHover: "#033160",
    colorPrimaryActive: "#033160",
    borderRadius: 4,
  },
};
