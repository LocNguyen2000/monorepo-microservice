import { useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import {
  IPagination,
  PaginatedResponse,
  ProviderDataType,
} from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Pagination from "antd/es/pagination/Pagination";
import { RentProviderDetail } from "./RentProviderDetail";
import {
  ReloadOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";
import Flex from "antd/es/flex";
import { getGlobalContext } from "../../lib/context";
import Divider from "antd/es/divider";
import { Typography } from "antd";
import { autoGenerateNewCode } from "../../lib/utils";

const RentProviderList = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<ProviderDataType>({});
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });

  const [isOpenForm, dispatch] = useReducer(
    (_: boolean, action: ACTION_ENUM) => {
      return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
    },
    false,
  );
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
  const { serviceClient, useToast, useConfirm } = getGlobalContext();

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const codeGenerator = () => {
    const code = autoGenerateNewCode(providers, "providerCode");
    setProvider({ ...provider, providerCode: code });
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
      .delete(`/rent-provider/${data.providerCode}`)
      .then(() => {
        useToast("success", "Xóa chủ trọ thành công");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Xóa chủ trọ thất bại");
      });
  };

  const loadData = () => {
    serviceClient
      .get(`/rent-provider?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setLoadingSekeleton();
        setProviders(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.size]);

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Flex vertical align="stretch" className="list-page-header">
        <div className="list-page-heading">
          <h2>Chủ sở hữu thuê</h2>
          <Typography>- Chủ đất, chủ địa điểm</Typography>
        </div>
        <Flex className="list-page-actions">
          <Input
            className="list-page-search"
            placeholder="Nhập nội dung tìm kiếm"
          />
          <Button
            type="primary"
            size="middle"
            onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}
          >
            <UserAddOutlined /> Thêm
          </Button>

          <Button size="middle" onClick={() => loadData()}>
            <ReloadOutlined />
          </Button>
        </Flex>
      </Flex>

      <Divider />

      <RentProviderDetail
        data={provider}
        setData={setProvider}
        action={action}
        isOpen={isOpenForm}
        setIsFormOpen={openFormHandler}
        codeGenerator={codeGenerator}
      />

      <div className="list-page-table-scroll">
        <BaseTable
          columns={providerColumns}
          data={providers}
          editable
          isLoading={isLoading}
          size="middle"
          scroll={{ x: "max-content" }}
          onDblClickRow={(p: ProviderDataType) =>
            openFormHandler(ACTION_ENUM.EDIT, p)
          }
          onDeleteRow={(t: ProviderDataType) =>
            useConfirm(
              "warning",
              "Xóa chủ trọ",
              `Bạn có muốn xóa chủ trọ ${t.providerName} không?`,
              async () => await deleteDataHandler(t),
            )
          }
        />
      </div>

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

export default RentProviderList;
