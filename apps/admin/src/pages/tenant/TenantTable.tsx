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
import TenantDetail from "./TenantDetail";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";

const TenantTable = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType | {}>({});
  const [open, setOpen] = useState(false);
  const serviceClient = ServiceClient();

  useEffect(() => {
    serviceClient
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
        title={<TenantDetail.Header />}
        centered
        open={open}
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        width={1000}
        footer={<TenantDetail.Footer data={tenant} />}
      >
        <TenantDetail.Body data={tenant} setData={setTenant} />
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
