import { ReloadOutlined, UserAddOutlined } from "@ant-design/icons";
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
import { Divider, Flex, Pagination } from "antd";
import { GlobalContext, getGlobalContext } from "../../lib/context";
import Typography from "antd/es/typography/Typography";

const TenantList = () => {
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType>({});
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });
  const [isOpenForm, dispatch] = useReducer((_: boolean, action: ACTION_ENUM) => {
    return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
  }, false);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
  const { serviceClient, useConfirm, useToast } = getGlobalContext();

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const openFormHandler = (action: ACTION_ENUM, data: TenantDataType) => {
    console.log("FORM", action);
    console.log("DATA", data);

    setAction(action);
    dispatch(action);
    setTenant(data);
  };

  const loadData = () => {
    serviceClient
      .get(`/tenant?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<TenantDataType>) => {
        setLoadingSekeleton();
        setTenants(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deleteDataHandler = async (data: TenantDataType) => {
    serviceClient
      .delete(`/tenant/${data.tenantCode}`)
      .then(() => {
        useToast("success", "Delete Tenant successfully");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Delete Tenant failed");
      });
  };

  // ON MOUNTED
  useEffect(() => {
    setLoadingSekeleton();

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
    loadData();
  }, [pagination]);

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Flex
        style={{
          display: "flex",
          marginBottom: "1rem",
          alignItems: "center",
        }}
      >
        <div>
          <h2>Tenants</h2>
          <Typography>- People who rent locations, pay money to owners</Typography>
        </div>
        <div style={{ flex: 1 }}></div>

        <Input
          placeholder="Enter search value here"
          style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }}
        />

        <Button
          type="primary"
          style={{ marginRight: "1rem" }}
          size="middle"
          onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}
        >
          <UserAddOutlined /> Add
        </Button>

        <Button size="middle" onClick={() => loadData()}>
          <ReloadOutlined />
        </Button>
      </Flex>

      <Divider />

      <TenantDetailForm
        data={tenant}
        action={action}
        isOpen={isOpenForm}
        setData={setTenant}
        setIsFormOpen={openFormHandler}
      />

      <BaseTable
        columns={tenantColumns}
        data={tenants}
        isLoading={isLoading}
        editable
        onDblClickRow={(t: TenantDataType) => openFormHandler(ACTION_ENUM.EDIT, t)}
        onDeleteRow={(t: TenantDataType) =>
          useConfirm(
            "warning",
            "Tenant Deletion",
            `Do you want to delete tenant ${t.tenantName}?`,
            async () => await deleteDataHandler(t)
          )
        }
      />

      <Pagination
        current={pagination.page}
        total={pagination.total}
        pageSize={pagination.size}
        pageSizeOptions={[10]}
        onChange={(page, size) => {
          setPagination({ ...pagination, page, size });
        }}
        style={{ marginTop: "1.5rem" }}
      />
    </Card>
  );
};

export default TenantList;
