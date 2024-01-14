import Card from "antd/es/card/Card";
import { getGlobalContext } from "../lib/context";
import { DescriptionsProps, Badge, Descriptions } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";

const MyProfilePage = () => {
  const { authUser } = getGlobalContext();

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Username",
      children: authUser.name,
      span: 1.5,
    },
    {
      key: "2",
      label: "User ID",
      children: authUser.userId,
      span: 1.5,
    },
    {
      key: "3",
      label: "Role",
      children: authUser.role,
      span: 1.5,
    },
    {
      key: "4",
      label: "Status",
      children: <Badge status="processing" text="Running" />,
      span: 1.5,
    },
    {
      key: "5",
      label: "Create on",
      children: new Date().toLocaleDateString(),
      span: 1.5,
    },
    {
      key: "6",
      label: "Create by",
      children: "admin",
      span: 1.5,
    },
  ];

  return (
    <Card style={{ width: "100%", minHeight: "15vh" }}>
      <Descriptions
        title={
          <div>
            <UserOutlined /> My Profile<Typography></Typography>
          </div>
        }
        bordered
        items={items}
      />
    </Card>
  );
};

export default MyProfilePage;
