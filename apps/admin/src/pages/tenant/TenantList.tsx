import { UserAddOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import { TenantDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import TenantDetail from "./TenantDetail";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";

const TenantList = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType>({});
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

  const openFormHandler = (action: ACTION_ENUM, data: TenantDataType) => {
    if (action == ACTION_ENUM.ADD) {
      setTenant({});
      setOpen(true);
    } else if (action == ACTION_ENUM.EDIT) {
      setTenant(data);
      setOpen(true);
    } else {
      setTenant({});
      setOpen(false);
    }
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
        <Button
          type="primary"
          size="large"
          onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}
        >
          <UserAddOutlined /> Add
        </Button>
      </div>

      <TenantDetail.Body
        data={tenant}
        setData={setTenant}
        isOpen={open}
        setIsFormOpen={openFormHandler}
      />

      <BaseTable
        columns={tenantColumns}
        data={tenants}
        editable
        onRow={(t: TenantDataType) => {
          return {
            onDoubleClick: () => openFormHandler(ACTION_ENUM.EDIT, t),
          };
        }}
      />
    </Card>
  );
};

export default TenantList;
