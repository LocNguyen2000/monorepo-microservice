import { Tabs } from "antd";
import AnalysistTab from "./AnalysisTab";
import GuidanceTab from "./GuidanceTab";

const OverviewPage = () => {
  return (
    <>
      <Tabs
        size="large"
        defaultActiveKey="1"
        items={[
          {
            label: "Phân tích & Thống kê",
            key: "1",
            children: <AnalysistTab />,
            style: { color: "white" },
          },
          {
            label: "Hướng dẫn quản lý",
            key: "2",
            children: <GuidanceTab />,
            style: { color: "white" },
          },
        ]}
      />
    </>
  );
};

export default OverviewPage;
