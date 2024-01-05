import {
  SettingTwoTone,
  DeleteTwoTone,
  UserAddOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import { TenantDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Modal from "antd/es/modal/Modal";
import { getGlobalContext } from "../../lib/context";
import { TenantDetail, TenantDetailHeader } from "./TenantDetail";
import { UserClient } from "../../lib/clients";
import Card from "antd/es/card/Card";

const TenantTable = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<Partial<TenantDataType>>({});
  const [open, setOpen] = useState(false);
  const { useNotify, useToast } = getGlobalContext();
  const userClient = UserClient(process.env.ADMIN_USER_URL);

  useEffect(() => {
    userClient
      .get("/tenant")
      .then((res) => {
        setTenants(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const closeModal = () => {
    setOpen(false);
    setTenant({});
  };

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
        title={<TenantDetailHeader />}
        centered
        open={open}
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        width={1000}
        footer={[
          <Button key="back">Return</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => useToast("success", "Submit form successfully")}
          >
            Submit
          </Button>,
        ]}
      >
        <TenantDetail data={tenant} setData={setTenant} />
      </Modal>
      <BaseTable
        columns={tenantColumns}
        data={tenants}
        editable
        onRow={(t: TenantDataType) => {
          return {
            onDoubleClick: () => {
              setTenant(t);
              setOpen(true);
            },
          };
        }}
      />
    </Card>
  );
};

export default TenantTable;
