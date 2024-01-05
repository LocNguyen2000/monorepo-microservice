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
import { UserClient } from "../../lib/clients";
import { getGlobalContext } from "../../lib/context";
import { Divider } from "antd";
import Card from "antd/es/card/Card";

const RentProviderTable = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<Partial<ProviderDataType>>({});
  const [open, setOpen] = useState(false);
  const { useNotify } = getGlobalContext();
  const userClient = UserClient(process.env.ADMIN_USER_URL);

  const closeModal = () => {
    setOpen(false);
    setProvider({});
  };

  useEffect(() => {
    userClient
      .get("/rent-providers")
      .then((res) => {
        setProviders(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Card>
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
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        width={800}
        footer={[
          <Divider />,
          <Button key="back">Return</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => useNotify("success", "Nice", "hello")}
          >
            Submit
          </Button>,
        ]}
      >
        <RentProviderDetail data={provider} setData={setProvider} />
      </Modal>
      <BaseTable
        columns={providerColumns}
        data={providers}
        editable
        onRow={(p: ProviderDataType) => {
          return {
            onDoubleClick: () => {
              setProvider(p);
              setOpen(true);
            },
          };
        }}
      />
    </Card>
  );
};

export default RentProviderTable;
