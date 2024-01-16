import { useContext, useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import { IPagination, PaginatedResponse, ProviderDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Pagination from "antd/es/pagination/Pagination";
import { RentProviderDetail } from "./RentProviderDetail";
import { ReloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";
import Flex from "antd/es/flex";
import { GlobalContext, getGlobalContext } from "../../lib/context";
import Divider from "antd/es/divider";

const RentProviderList = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<ProviderDataType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });

  const [isOpenForm, dispatch] = useReducer((_: boolean, action: ACTION_ENUM) => {
    return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
  }, false);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
  const { serviceClient, useToast, useConfirm } = getGlobalContext();

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const openFormHandler = (action: ACTION_ENUM, data: ProviderDataType) => {
    console.log("FORM", action);
    console.log("DATA", data);

    setAction(action);
    dispatch(action);
    setProvider(data);
  };

  const deleteDataHandler = async (data: ProviderDataType) => {
    serviceClient
      .delete(`/rent-providers/${data.providerCode}`)
      .then(() => {
        useToast("success", "Delete Owner successfully");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Delete Owner failed");
      });
  };

  const loadData = () => {
    serviceClient
      .get(`/rent-providers?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setLoadingSekeleton();
        setProviders(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // ON MOUNTED
  useEffect(() => {
    setLoadingSekeleton();

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
    loadData();
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

        <Button
          type="primary"
          style={{ marginRight: "1rem" }}
          size="large"
          onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}
        >
          <UserAddOutlined /> Add
        </Button>

        <Button size="large" onClick={() => loadData()}>
          <ReloadOutlined />
        </Button>
      </Flex>

      <Divider />

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
        isLoading={isLoading}
        onDblClickRow={(p: ProviderDataType) => openFormHandler(ACTION_ENUM.EDIT, p)}
        onDeleteRow={(t: ProviderDataType) =>
          useConfirm(
            "warning",
            "Owner Deletion",
            `Do you want to delete owner ${t.providerName}?`,
            async () => await deleteDataHandler(t)
          )
        }
      />
    </Card>
  );
};

export default RentProviderList;
