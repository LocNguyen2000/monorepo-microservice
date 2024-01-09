import { UserAddOutlined } from "@ant-design/icons";
import { useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import { TenantDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import { TenantDetailForm } from "./TenantDetail";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";
import Popover from "antd/es/popover";

const TenantList = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType>({});
  const [isOpenForm, dispatch] = useReducer(
    (_: boolean, action: ACTION_ENUM) => {
      return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
    },
    false
  );
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
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
    console.log("FORM", action);
    console.log("DATA", data);

    setAction(action);
    dispatch(action);
    setTenant(data);
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

      <TenantDetailForm
        data={tenant}
        setData={setTenant}
        action={action}
        isOpen={isOpenForm}
        setIsFormOpen={openFormHandler}
      />

      <BaseTable
        columns={tenantColumns}
        data={tenants}
        editable
        onDblClickRow={(t: TenantDataType) =>
          openFormHandler(ACTION_ENUM.EDIT, t)
        }
      />
    </Card>
  );
};

export default TenantList;
