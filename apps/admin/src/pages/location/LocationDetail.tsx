import {
  Button,
  Divider,
  Flex,
  Form,
  InputNumber,
  Modal,
  Select,
  Tag,
  Typography,
  Upload,
} from "antd";
import Card from "antd/es/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "antd/es/input";
import { useEffect, useState, ChangeEventHandler } from "react";
import {
  PlusOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import {
  ExpenseDataType,
  ExpenseLocationDataType,
  InvoiceDataType,
  LocationDataType,
  PaginatedResponse,
  ProviderDataType,
  TenantDataType,
} from "../../lib/interface";
import { debounce } from "../../lib/utils";
import { ACTION_ENUM } from "../../lib/constants";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import BaseTable from "../../components/BaseTable";
import {
  expenseLocationColumns,
  tenantColumns,
} from "../../lib/constants/columns";
import TenantDetailForm from "../tenant/TenantDetail";

const DEFAULT_INITIAL_UNIT = 0;
const DEFAULT_CURRENT_UNIT = 1;

const LocationDetail: React.FunctionComponent = () => {
  const [location, setLocation] = useState<Partial<LocationDataType>>({});
  const [locationExpenses, setLocationExpenses] = useState<
    ExpenseLocationDataType[]
  >([]);
  const [imageFile, setImageFile] = useState<File>();
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDataType[]>([]);
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [tenant, setTenant] = useState<TenantDataType>({});
  const [isTenantFormOpen, setIsTenantFormOpen] = useState(false);
  const [isAssignTenantOpen, setIsAssignTenantOpen] = useState(false);
  const [availableTenants, setAvailableTenants] = useState<TenantDataType[]>(
    [],
  );
  const [selectedTenantCode, setSelectedTenantCode] = useState<number>();
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.ADD);
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();
  const { setPathFromKey } = getPathContext();
  const navigate = useNavigate();

  const { search } = useLocation();

  const loadTenants = (locationCode: string | number) => {
    serviceClient
      .get<InvoiceDataType>(`/invoices/get-summerize-data/${locationCode}`)
      .then(({ data }) => {
        setTenants(Array.isArray(data.tenants) ? data.tenants : []);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const tenantFormHandler = (formAction: ACTION_ENUM, data: TenantDataType) => {
    if (formAction === ACTION_ENUM.ADD) {
      setTenant({ ...data, locationCode: location.locationCode });
      setIsTenantFormOpen(true);
      return;
    }

    setIsTenantFormOpen(false);
    setTenant({});
    if (location.locationCode !== undefined) loadTenants(location.locationCode);
  };

  const openAssignTenantModal = () => {
    serviceClient
      .get<PaginatedResponse<TenantDataType>>("/tenant?page=1&size=1000")
      .then(({ data }) => {
        setAvailableTenants(data.data);
        setSelectedTenantCode(undefined);
        setIsAssignTenantOpen(true);
      })
      .catch((e) => console.log(e));
  };

  const assignTenant = async () => {
    if (selectedTenantCode === undefined || location.locationCode === undefined)
      return;

    try {
      await serviceClient.post(
        `/tenant/${selectedTenantCode}/locations/${location.locationCode}`,
      );
      useNotify(
        "success",
        "Gán người thuê thành công",
        "Người thuê đã được gán vào phòng trọ này.",
      );
      setIsAssignTenantOpen(false);
      loadTenants(location.locationCode);
    } catch (error) {
      console.log(error);
      useNotify(
        "error",
        "Gán người thuê thất bại",
        "Không thể gán người thuê vào phòng trọ này.",
      );
    }
  };

  const getExpenseData = () => {
    serviceClient
      .get(`/expense`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ExpenseDataType>) => {
        setExpenses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const returnLocationTable = () => {
    const [locationPage] = MENU_LIST.filter(
      (i) => i.path === DASHBOARD_ROUTES.LOCATION,
    );

    setPathFromKey(locationPage.key);

    navigate(DASHBOARD_ROUTES.LOCATION);
  };

  const formChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const key = e.target.attributes.getNamedItem("name")
      .value as keyof LocationDataType;
    const value = e.target.value;

    debounce(setLocation({ ...location, [key]: value }));
  };

  console.log("expenses", expenses);

  const updateExpense = (action: "SELECT" | "DESELECT", code: string) => {
    console.log("ACTION", action);

    switch (action) {
      case "SELECT": {
        const [selectedExpense] = expenses.filter(
          (e) => e.expenseCode === code,
        );
        const defaultExpense: ExpenseLocationDataType = {
          locationCode: code,
          ...selectedExpense,
          initialUnit: DEFAULT_INITIAL_UNIT,
          currentUnit: DEFAULT_CURRENT_UNIT,
        };
        setLocationExpenses([...locationExpenses, defaultExpense]);
        break;
      }
      case "DESELECT": {
        const newExpenses = locationExpenses.filter(
          (e) => e.expenseCode !== code,
        );
        console.log(newExpenses);

        setLocationExpenses(newExpenses);
        break;
      }
    }
  };

  const formSubmitHandler = async () => {
    try {
      const formData = new FormData();
      Object.entries(location).forEach(([key, value]) => {
        if (key !== "expenses" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (imageFile) formData.append("image", imageFile);

      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/location", formData);

        useNotify(
          "success",
          "Thêm phòng trọ mới thành công",
          `Đã gửi biểu mẫu thành công cho phòng trọ ${location.locationCode}`,
        );
      } else if (action === ACTION_ENUM.EDIT) {
        // update location
        await serviceClient.put(`/location/${location.locationCode}`, formData);
        // update expense based on location
        await serviceClient.patch(
          `/location/${location.locationCode}`,
          locationExpenses,
        );

        useNotify(
          "success",
          "Cập nhật phòng trọ thành công",
          `Đã gửi biểu mẫu thành công cho phòng trọ ${location.locationCode}`,
        );
      }
      debounce(() => returnLocationTable(), 500);
    } catch (error) {
      console.log("Error", error);
      useNotify(
        "error",
        "Lỗi gửi thông tin phòng trọ",
        "Gửi biểu mẫu thất bại",
      );
    }
  };

  useEffect(() => {
    const isId = search.replace("?id=", "");

    console.log(isId);

    if (isId) {
      serviceClient
        .get(`/location/${isId}`)
        .then((res) => {
          setLocation(res.data);
          loadTenants(res.data.locationCode ?? isId);
          if (res.data.expenses) {
            setLocationExpenses(res.data.expenses);
            console.log("RES EXPENSE", res.data.expenses);
          }

          setAction(ACTION_ENUM.EDIT);
          console.log("RES", res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    serviceClient
      .get(`/rent-provider`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setProviders(response.data);

        getExpenseData();
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Card style={{ width: "95%" }}>
      <h2>Chi tiết phòng trọ</h2>
      <Divider />
      <Form
        labelCol={{ span: 3 }}
        layout="horizontal"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Mã phòng trọ" required={true}>
          <Input
            name="locationCode"
            placeholder="Nhập mã phòng trọ"
            value={location.locationCode}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Tên phòng trọ" required={true}>
          <Input
            name="locationName"
            placeholder="Nhập tên phòng trọ"
            value={location.locationName}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Địa chỉ" required={true} style={{}}>
          <Input
            name="locationAddress"
            value={location.locationAddress}
            onChange={(e) => formChangeHandler(e)}
            placeholder="Nhập địa chỉ phòng trọ"
          />
        </Form.Item>
        <Form.Item label="Số người ở" required={true}>
          <InputNumber
            name="roomSize"
            value={location.roomSize}
            onChange={(v) => {
              setLocation({ ...location, roomSize: v });
            }}
            placeholder="Nhập số người ở"
          />
        </Form.Item>
        <Form.Item label="Ảnh">
          {location.image && (
            <Typography.Link
              href={location.image}
              target="_blank"
              rel="noreferrer"
            >
              Xem ảnh hiện tại
            </Typography.Link>
          )}
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={(file) => {
              if (file.size > 50 * 1024 * 1024) {
                useNotify(
                  "error",
                  "Tệp quá lớn",
                  "Kích thước tệp không được vượt quá 50 MB.",
                );
                return Upload.LIST_IGNORE;
              }
              setImageFile(file);
              return false;
            }}
            onRemove={() => {
              setImageFile(undefined);
              return true;
            }}
            listType="picture-card"
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Tải lên</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="Chủ trọ">
          <Select
            showSearch
            placeholder="Chọn chủ trọ"
            value={location.owner}
            onChange={(e) => {
              setLocation({ ...location, owner: e });
            }}
          >
            {providers.map((p, index) => (
              <Select.Option key={index} value={p.providerCode}>
                <Tag>
                  <b>{p.providerName}</b>
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Chi phí">
          <Select
            showSearch
            mode="multiple"
            placeholder="Chọn chi phí cho phòng trọ"
            value={locationExpenses.map((el) => el.expenseCode)}
            style={{ marginBottom: "1rem" }}
            onDeselect={(value) => updateExpense("DESELECT", value)}
            onSelect={(value) => updateExpense("SELECT", value)}
          >
            {expenses.map((p, index) => (
              <Select.Option key={index} value={p.expenseCode}>
                {p.expenseName}
              </Select.Option>
            ))}
          </Select>

          <BaseTable
            columns={expenseLocationColumns}
            data={locationExpenses}
            size="small"
          />
        </Form.Item>
        <Form.Item label="Mô tả">
          <TextArea
            rows={4}
            name="description"
            placeholder="Nhập mô tả"
            value={location.description}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
      </Form>

      <Divider />
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: "8px" }}
      >
        <Typography.Title level={4}>Người thuê hiện tại</Typography.Title>
        <div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => tenantFormHandler(ACTION_ENUM.ADD, {})}
            style={{ marginRight: "10px" }}
          >
            Thêm người thuê
          </Button>
          <Button icon={<UserSwitchOutlined />} onClick={openAssignTenantModal}>
            Gán người thuê hiện có
          </Button>
        </div>
      </Flex>
      <BaseTable columns={tenantColumns} data={tenants} size="small" />

      <Modal
        title="Gán người thuê hiện có"
        open={isAssignTenantOpen}
        okText="Gán"
        cancelText="Quay lại"
        onOk={assignTenant}
        onCancel={() => setIsAssignTenantOpen(false)}
      >
        <Select
          showSearch
          optionFilterProp="label"
          placeholder="Chọn người thuê"
          value={selectedTenantCode}
          onChange={setSelectedTenantCode}
          style={{ width: "100%" }}
          options={availableTenants.map((availableTenant) => ({
            value: availableTenant.tenantCode,
            label: `${availableTenant.tenantName} (${availableTenant.email ?? "không có email"})`,
          }))}
        />
      </Modal>

      <TenantDetailForm
        data={tenant}
        action={ACTION_ENUM.ADD}
        isOpen={isTenantFormOpen}
        setData={setTenant}
        setIsFormOpen={tenantFormHandler}
      />

      <Divider />

      <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ marginRight: "1rem" }}
          onClick={(e) => {
            returnLocationTable();
          }}
        >
          Quay lại
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={(e) => {
            useConfirm(
              "confirm",
              "Xác nhận phòng trọ",
              "Bạn có chắc chắn muốn gửi thông tin phòng trọ này không?",
              () => formSubmitHandler(),
            );
          }}
        >
          Gửi
        </Button>
      </Form.Item>
    </Card>
  );
};

export default LocationDetail;
