import { UserAddOutlined } from "@ant-design/icons";
import { useContext, useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import { IPagination, PaginatedResponse, TenantDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import { TenantDetailForm } from "./TenantDetail";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";
import { Flex, Pagination } from "antd";
import { GlobalContext, getGlobalContext } from "../../lib/context";

const TenantList = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType>({});
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });
  const [isOpenForm, dispatch] = useReducer((_: boolean, action: ACTION_ENUM) => {
    return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
  }, false);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
  const { serviceClient } = getGlobalContext();

  // ON MOUNTED
  useEffect(() => {
    serviceClient
      .get(`/tenant?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<TenantDataType>) => {
        setTenants(response.data);
        setPagination({
          total: response.total,
          size: response.size,
          page: response.page,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // ON UPDATED
  useEffect(() => {
    serviceClient
      .get(`/tenant?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<TenantDataType>) => {
        setTenants(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [pagination]);

  const openFormHandler = (action: ACTION_ENUM, data: TenantDataType) => {
    console.log("FORM", action);
    console.log("DATA", data);

    setAction(action);
    dispatch(action);
    setTenant(data);
  };

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Flex
        style={{
          display: "flex",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <Pagination
          current={pagination.page}
          total={pagination.total}
          pageSize={pagination.size}
          pageSizeOptions={[10]}
          onChange={(page, size) => {
            setPagination({ ...pagination, page, size });
          }}
          style={{ marginRight: "2rem" }}
        />

        <div style={{ flex: 1 }}></div>

        <Input
          placeholder="Enter search value here"
          style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }}
        />

        <Button type="primary" size="large" onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}>
          <UserAddOutlined /> Add
        </Button>
      </Flex>

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
        onDblClickRow={(t: TenantDataType) => openFormHandler(ACTION_ENUM.EDIT, t)}
      />
    </Card>
  );
};

export default TenantList;
