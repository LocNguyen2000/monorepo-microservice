import { useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import { ProviderDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Modal from "antd/es/modal/Modal";
import RentProviderDetail from "./RentProviderDetail";
import Typography from "antd/es/typography/Typography";
import Divider from "antd/es/divider";
import { UserAddOutlined } from "@ant-design/icons";

const RentProviderTable = () => {
  const [provider, setProvider] = useState<ProviderDataType[]>([]);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Enter search value here"
          style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }}
        />

        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          <UserAddOutlined /> Add
        </Button>
      </div>
      <Modal
        title={
          <div>
            <Typography>
              Provider Form
              <Divider />
            </Typography>
          </div>
        }
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        width={1000}
        footer={[
          <Button key="back">Return</Button>,
          <Button
            key="submit"
            type="primary"
            // onClick={() => openNotification("success")}
          >
            Submit
          </Button>,
        ]}
      >
        <RentProviderDetail />
      </Modal>
      <BaseTable columns={providerColumns} data={provider} editable />;
    </>
  );
};

export default RentProviderTable;
