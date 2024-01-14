import { ThemeConfig } from "antd";

export const globalTheme: ThemeConfig = {
  components: {
    Menu: {
      algorithm: true,
      colorBgBase: "#2f3330",
      colorText: "white",
      itemHoverBg: "#d4d7dc",
      itemHoverColor: "#4CAF50",
      itemSelectedBg: "#d4d7dc",
      controlItemBgActiveHover: "#2f3330",
    },
  },
  token: {
    fontFamily: "GoogleRoboto",
    // Seed Token
    colorPrimary: "#4CAF50",
    colorBgTextHover: "#2ca01c",
    borderRadius: 1,
  },
};
