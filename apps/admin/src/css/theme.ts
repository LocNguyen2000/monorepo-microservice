import { ThemeConfig } from "antd";

export const globalTheme: ThemeConfig = {
  components: {
    Menu: {
      algorithm: true,
      colorBgBase: "#20372f",
      colorText: "#f7f5ed",
      itemHoverBg: "#304b3f",
      itemHoverColor: "#ffffff",
      itemSelectedBg: "#3a624e",
      itemSelectedColor: "#ffffff",
      controlItemBgActiveHover: "#304b3f",
    },
    Input: {
      colorTextDisabled: "#69766d",
    },
    Radio: {
      dotColorDisabled: "#69766d",
    },
  },
  token: {
    fontFamily: 'GoogleRoboto, "Yu Gothic UI", "Meiryo", sans-serif',
    colorPrimary: "#2f6c52",
    colorSuccess: "#4b7959",
    colorInfo: "#3f6c73",
    colorWarning: "#ad6839",
    colorError: "#b64939",
    colorText: "#29332d",
    colorTextSecondary: "#66726a",
    colorBgBase: "#f2f2ec",
    colorBgLayout: "#eef0ea",
    colorBgContainer: "#fffefa",
    colorBgTextHover: "#e8eee8",
    colorBorder: "#d6d9d0",
    colorPrimaryHover: "#3e8062",
    colorPrimaryActive: "#24533e",
    borderRadius: 6,
  },
};
