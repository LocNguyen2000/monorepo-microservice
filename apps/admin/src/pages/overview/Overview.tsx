import { Tabs } from "antd";
import GuidanceTab from "./GuidanceTab";

const OverviewPage = () => {
  return (
    <>
      <Tabs
        size="large"
        defaultActiveKey="2"
        items={[
          {
            label: "Hướng dẫn quản lý",
            key: "2",
            children: <GuidanceTab />,
            style: { color: "white" },
          },
          {
            label: "Phân tích & Thống kê",
            key: "1",
            children: null,
            disabled: true,
            style: { color: "white" },
          },
        ]}
      />
    </>
  );
};

export default OverviewPage;
