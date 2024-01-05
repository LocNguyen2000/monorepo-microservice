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
            label: "Statistics & Analysist",
            key: "1",
            children: <AnalysistTab />,
          },
          {
            label: "Management Guide",
            key: "2",
            children: <GuidanceTab />,
          },
        ]}
      />
    </>
  );
};

export default OverviewPage;
