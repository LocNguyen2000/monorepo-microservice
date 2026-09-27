import { ReloadOutlined, UserAddOutlined } from "@ant-design/icons";
import { useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import {
  IPagination,
  PaginatedResponse,
  TenantDataType,
} from "../../lib/interface";
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
  const [isOpenForm, dispatch] = useReducer(
    (_: boolean, action: ACTION_ENUM) => {
      return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
    },
    false,
  );
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
        useToast("success", "Xóa người thuê thành công");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Xóa người thuê thất bại");
      });
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, pagination.size]);

  return (
    <Card style={{ padding: "0.25rem" }}>
      <Flex vertical align="stretch" className="list-page-header">
        <div className="list-page-heading">
          <h2>Người thuê nhà</h2>
          <Typography>
            - <b>Người thuê</b> địa điểm, trả tiền cho <b>chủ sở hữu</b>
          </Typography>
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

      <TenantDetailForm
        data={tenant}
        action={action}
        isOpen={isOpenForm}
        setData={setTenant}
        setIsFormOpen={openFormHandler}
      />

      <div className="list-page-table-scroll">
        <BaseTable
          columns={tenantColumns}
          data={tenants}
          isLoading={isLoading}
          editable
          size="middle"
          scroll={{ x: "max-content" }}
          onDblClickRow={(t: TenantDataType) =>
            openFormHandler(ACTION_ENUM.EDIT, t)
          }
          onDeleteRow={(t: TenantDataType) =>
            useConfirm(
              "warning",
              "Xóa người thuê",
              `Bạn có muốn xóa người thuê ${t.tenantName} không?`,
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

export default TenantList;
