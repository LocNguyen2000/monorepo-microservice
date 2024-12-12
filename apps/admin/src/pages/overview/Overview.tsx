import { Tabs } from "antd";
import AnalysistTab from "./AnalysisTab";
import GuidanceTab from "./GuidanceTab";

const OverviewPage = () => {
  return (
    <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: "Phân tích & Thống kê",
            key: "1",
            children: <AnalysistTab />,
          },
          {
            label: "Hướng dẫn quản lý",
            key: "2",
            children: <GuidanceTab />,
          },
        ]}
      />
    </>
  );
};

export default OverviewPage;
