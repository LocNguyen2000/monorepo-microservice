import { useContext, useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import { IPagination, PaginatedResponse, ProviderDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Pagination from "antd/es/pagination/Pagination";
import { RentProviderDetail } from "./RentProviderDetail";
import { UserAddOutlined } from "@ant-design/icons";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";
import Flex from "antd/es/flex";
import { GlobalContext, getGlobalContext } from "../../lib/context";

const RentProviderList = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<ProviderDataType>({});
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

  const openFormHandler = (action: ACTION_ENUM, data: ProviderDataType) => {
    console.log("FORM", action);
    console.log("DATA", data);

    setAction(action);
    dispatch(action);
    setProvider(data);
  };

  // ON MOUNTED
  useEffect(() => {
    serviceClient
      .get(`/rent-providers?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setProviders(response.data);
        setPagination({ total: response.total, size: response.size, page: response.page });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // ON UPDATED
  useEffect(() => {
    serviceClient
      .get(`/rent-providers?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setProviders(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [pagination]);

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Flex
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
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

      <RentProviderDetail
        data={provider}
        setData={setProvider}
        action={action}
        isOpen={isOpenForm}
        setIsFormOpen={openFormHandler}
      />

      <BaseTable
        columns={providerColumns}
        data={providers}
        editable
        onDblClickRow={(p: ProviderDataType) => openFormHandler(ACTION_ENUM.EDIT, p)}
      />
    </Card>
  );
};

export default RentProviderList;
