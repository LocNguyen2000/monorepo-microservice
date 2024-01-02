import { useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import { ProviderDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Modal from "antd/es/modal/Modal";
import {
  RentProviderDetailHeader,
  RentProviderDetail,
} from "./RentProviderDetail";
import { UserAddOutlined } from "@ant-design/icons";
import { userClient } from "../../lib/clients";

const RentProviderTable = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<Partial<ProviderDataType>>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    userClient.getFilterRentProvider().then((res) => {
      console.log(res.data);

      setProviders(res.data);
    });
  }, []);

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
        title={<RentProviderDetailHeader />}
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
        <RentProviderDetail data={provider} setData={setProvider} />
      </Modal>
      <BaseTable columns={providerColumns} data={providers} editable />;
    </>
  );
};

export default RentProviderTable;
