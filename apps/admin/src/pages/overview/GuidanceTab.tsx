import { BookOutlined, HomeOutlined } from "@ant-design/icons";
import { Divider, List, Typography } from "antd";
import Card from "antd/es/card/Card";

const GuidanceTab = () => {
  const data = [
    "Step 1: Create a new location for your rent house in the Location section.",
    "Step 2: Add a new Rent Provider, as in your land owner. Fil in the form with your basic information and your renting locations.",
    "Step 3: Everytime there's a new tenant, add their information in the Tenant section",
    "Step 4: In Schedule section, You can create a schedule email event to inform anything you want with your tenant or your rent provider",
    "Step 5: Overview section, check your renting progress.",
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{ marginRight: "1rem" }}
        title={
          <>
            <HomeOutlined className="override-antd-icon-item" /> How to manage
            your dashboard
          </>
        }
      >
        <List
          style={{ width: "max-content" }}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
      <Card
        title={
          <Typography>
            <BookOutlined className="override-antd-icon-item" /> Basic Concepts
          </Typography>
        }
      >
        <div>
          <Typography>Locations</Typography>
          <Divider />
          <Typography>Rent Providers</Typography>
          <Divider />
          <Typography>Tenants</Typography>
          <Divider />
          <Typography>Inventory</Typography>
        </div>
      </Card>
    </div>
  );
};

export default GuidanceTab;
