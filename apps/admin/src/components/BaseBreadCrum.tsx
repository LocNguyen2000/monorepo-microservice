import { Breadcrumb } from "antd";
import { FunctionComponent } from "react";
import { IAntdMenuItem } from "../lib/interface";
import { MENU_LIST } from "../pages/Dashboard";
export interface IBaseBreadCrum {
  selectedMenu: IAntdMenuItem;
}
const BaseBreadCrum: FunctionComponent<IBaseBreadCrum> = ({ selectedMenu }) => {
  console.log("selectedMenu >", selectedMenu);

  return (
    <Breadcrumb style={{ margin: "16px 0", fontSize: "1rem" }}>
      {MENU_LIST.filter(
        (item) =>
          item.key == selectedMenu.key || item.key == selectedMenu.parentKey
      ).map((t) => (
        <Breadcrumb.Item>{t.text}</Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BaseBreadCrum;
