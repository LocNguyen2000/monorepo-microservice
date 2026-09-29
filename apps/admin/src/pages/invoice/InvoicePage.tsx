import {
  UserOutlined,
  EuroCircleOutlined,
  HomeOutlined,
  IdcardOutlined,
  PlusOutlined,
  MoneyCollectOutlined,
  ControlOutlined,
  FileImageOutlined,
  SlidersOutlined,
  FileProtectOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  Typography,
  Table,
  Tabs,
  Tag,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  ExpenseLocationDataType,
  InvoiceDataType,
  LocationDataType,
  PaginatedResponse,
  ProviderDataType,
  TenantDataType,
  InvoiceStatus,
  InvoiceSummaryDataType,
} from "../../lib/interface";
import { getGlobalContext } from "../../lib/context";
import { debounce, formatMoney } from "../../lib/utils";
import Upload from "antd/es/upload/Upload";
import BaseTable from "../../components/BaseTable";
import { expenseLocationColumns } from "../../lib/constants/columns";
import { globalTheme } from "../../css/theme";
import { AxiosResponse } from "axios";
import { ADMIN_ROLES } from "../../lib/constants/roles";
// import { IElectricMeterImageResponse } from "./InvoiceDrawer";

const invoiceExpenseColumns = expenseLocationColumns.map((column) => {
  const dataIndex = "dataIndex" in column ? column.dataIndex : undefined;

  if (dataIndex === "initialUnit" || dataIndex === "currentUnit") {
    return {
      ...column,
      render: (value: number, expense: ExpenseLocationDataType) =>
        String(expense.type) === "per_unit" ? value : "-",
    };
  }

  if (dataIndex === "price") {
    return {
      ...column,
      title: "Tổng giá tiền",
      dataIndex: "price",
      render: (_value: string, expense: ExpenseLocationDataType) =>
        formatMoney(
          (expense.currentUnit - expense.initialUnit) * Number(expense.price),
        ),
    };
  }

  return column;
});

export class IElectricMeterImageResponse {
  electricMeterReading: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  voltage: string;
  current: string;
  frequency: string;
  powerFactor: string;
  temperature: string;
  phase: string;
  installationYear: string;
  locationMarking: string;
}

export type WithRow<T> = T & {
  index: number | string;
};

export const InvoiceStatusTab = () => {
  const [invoices, setInvoices] = useState<InvoiceSummaryDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const { serviceClient, useNotify, useToast, authUser } = getGlobalContext();
  const canUpdateStatus = ADMIN_ROLES.includes(Number(authUser?.role));

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const { data } = await serviceClient.get<InvoiceSummaryDataType[]>(
        "/invoices",
      );
      setInvoices(data);
    } catch {
      useNotify("error", "Không thể tải danh sách hóa đơn", "Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const markAsDone = async (invoiceCode: number) => {
    try {
      await serviceClient.patch(`/invoices/${invoiceCode}/status`, {
        status: InvoiceStatus.DONE,
      });
      useToast("success", "Đã cập nhật hóa đơn thành DONE");
      await loadInvoices();
    } catch {
      useNotify("error", "Không thể cập nhật hóa đơn", "Chỉ hóa đơn DRAFT mới được chuyển sang DONE.");
    }
  };

  return (
    <Card
      title="Danh sách hóa đơn"
      extra={<Button onClick={loadInvoices}>Làm mới</Button>}
    >
      <div className="list-page-table-scroll">
        <Table
          rowKey="invoiceCode"
          loading={loading}
          dataSource={invoices}
          columns={[
            { title: "Mã hóa đơn", dataIndex: "invoiceCode", render: (value: number) => `#${value}` },
            { title: "Phòng trọ", dataIndex: "locationCode" },
            {
              title: "Tổng tiền",
              dataIndex: "totalAmount",
              render: (value: number) => `${Number(value).toLocaleString("vi-VN")} VNĐ`,
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (status: InvoiceStatus) => (
                <Tag color={status === InvoiceStatus.DONE ? "green" : "gold"}>
                  {status}
                </Tag>
              ),
            },
            {
              title: "Thao tác",
              render: (_: unknown, invoice: InvoiceSummaryDataType) => (
                <Button
                  type="primary"
                  disabled={invoice.status !== InvoiceStatus.DRAFT || !canUpdateStatus}
                  onClick={() => markAsDone(invoice.invoiceCode)}
                >
                  Đã thanh toán
                </Button>
              ),
            },
          ]}
          scroll={{ x: "max-content" }}
        />
      </div>
    </Card>
  );
};

const InvoicePage: React.FunctionComponent = () => {
  const [locations, setLocations] = useState<LocationDataType[]>([]);
  const [locationData, setLocationData] = useState<Partial<LocationDataType>>(
    {},
  );
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [ownerData, setOwnerData] = useState<Partial<ProviderDataType>>({});
  const [expensesData, setExpensesData] = useState<ExpenseLocationDataType[]>(
    [],
  );
  const [selectedExpense, setSelectedExpenseData] =
    useState<WithRow<ExpenseLocationDataType> | null>(null);
  const [loading, setLoading] = useState(false);
  const [processedData, setProcessedData] =
    useState<IElectricMeterImageResponse | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const { serviceClient, useConfirm, useToast } = getGlobalContext();
  const totalMoney = useMemo<string>(
    () =>
      formatMoney(
        expensesData.reduce<number>((acc, prev) => {
          const val = (prev.currentUnit - prev.initialUnit) * +prev.price;
          return acc + val;
        }, 0),
      ),
    [expensesData],
  );

  console.log("totalMOney", totalMoney);

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setSelectedExpenseData(null);
    setOpenDrawer(false);
    setProcessedData(null);
  };

  const onEditedSelectExpense = () => {
    if (!selectedExpense) return;

    const updatedExpenses = expensesData.map((el, index) => {
      if (index === selectedExpense.index) {
        delete selectedExpense.index;
        return selectedExpense;
      }
      return el;
    });

    setExpensesData(updatedExpenses);
    onClose();
  };

  const createInvoice = () => {
    const locationCode = locationData.locationCode;
    if (locationCode === undefined || expensesData.length === 0) return;

    useConfirm(
      "confirm",
      "Tạo hóa đơn",
      "Xác nhận tạo hóa đơn từ các chi phí hiện tại?",
      async () => {
        try {
          await serviceClient.post("/invoices", {
            locationCode,
            expenses: expensesData,
          });
          useToast("success", "Tạo hóa đơn thành công");
        } catch (error) {
          console.log(error);
          useToast("error", "Tạo hóa đơn thất bại");
        }
      },
    );
  };

  const getSummerizeData = async (locationCode: number) => {
    try {
      const { data } = await serviceClient.get<InvoiceDataType>(
        `/invoices/get-summerize-data/${locationCode}`,
      );

      console.log("Test", data);
      if (data.location) setLocationData(data.location);
      if (data.owner) setOwnerData(data.owner);
      if (Array.isArray(data.location.expenses))
        setExpensesData(data.location.expenses);
      if (Array.isArray(data.tenants)) setTenants(data.tenants);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = () => {
    serviceClient
      .get(`/location`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateExpensesLocation = async () => {
    useConfirm(
      "confirm",
      "Nộp chi phí",
      "Xác nhận lưu lại chi phí cho lần sau?",
      async () => {
        const locationCode = locationData.locationCode;
        await serviceClient.patch(`/location/${locationCode}`, expensesData);

        useToast(
          "success",
          "Cập nhật chi phí thành công. Bạn có thể tạo hóa đơn để gửi người thuê nhà.",
        );
      },
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Custom request to upload file to OpenAI API
   * @param options - Contains file, onSuccess, onError, and onProgress callbacks
   */
  const handleFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("files", file); // Send the file with the "files" key

    try {
      const { data } = await serviceClient.post<
        any,
        AxiosResponse<IElectricMeterImageResponse>
      >("/openai/process-meter-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      onSuccess("Tải tệp lên thành công");
      setProcessedData(data);
      setSelectedExpenseData({
        ...selectedExpense,
        initialUnit: selectedExpense.currentUnit,
        currentUnit: +data.electricMeterReading,
      });
      notification.success({
        message: "Tải ảnh lên thành công",
        description: "Ảnh đã được xử lý thành công.",
      });
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      onError(error);
      notification.error({
        message: "Tải ảnh lên thất bại",
        description: "Đã xảy ra lỗi khi xử lý ảnh. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate file before upload
   * @param file - The file being uploaded
   * @returns {boolean} - True if the file is valid
   */
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({
        message: "Định dạng tệp không hợp lệ",
        description: "Bạn chỉ có thể tải tệp JPG/PNG lên!",
      });
    }
    return isJpgOrPng;
  };

  return (
    <>
      <Tabs
        className="invoice-page-tabs"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "create", label: "Tạo hóa đơn" },
          { key: "status", label: "Danh sách hóa đơn" },
        ]}
      />
      {activeTab === "status" ? <InvoiceStatusTab /> : null}
      {activeTab === "create" ? (
      <>
      <Card className="summerize" style={{ padding: "0.25rem" }}>
        <Flex
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Hóa đơn</h2>
            <Typography style={{ marginBottom: "0.25rem" }}>
              - Tổng hợp chi phí và tạo hóa đơn cho người thuê (cần thông tin về
              phòng trọ, chi phí và chủ trọ)
            </Typography>
          </div>
          <div style={{ flex: 1 }}></div>
        </Flex>
      </Card>

      <div className="invoice-editor-layout">
        <Card
          className="location-info"
          title={
            <div className="invoice-panel-title">
              <HomeOutlined />
              <span>Phòng trọ</span>
            </div>
          }
        >
          <div className="invoice-location-picker">
            <Typography.Text type="secondary">Chọn phòng trọ</Typography.Text>
            <Select
              showSearch
              placeholder="Chọn phòng trọ"
              value={locationData.locationCode}
              onChange={async (e) => await getSummerizeData(+e)}
              style={{ width: "100%" }}
            >
              {locations.map((p) => (
                <Select.Option key={p.locationCode} value={p.locationCode}>
                  {p.locationName}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className="invoice-detail-grid">
            <div className="invoice-detail-item invoice-detail-item-wide">
              <span className="invoice-detail-label">Địa chỉ</span>
              <Typography.Text strong className="invoice-detail-value">
                {locationData.locationAddress || "Chưa có thông tin"}
              </Typography.Text>
            </div>
            <div className="invoice-detail-item">
              <span className="invoice-detail-label">Chủ trọ</span>
              <Typography.Text strong className="invoice-detail-value">
                {ownerData.providerName || "Chưa có thông tin"}
              </Typography.Text>
            </div>
            <div className="invoice-detail-item">
              <span className="invoice-detail-label">Số người</span>
              <Typography.Text strong className="invoice-detail-value">
                {locationData.roomSize ?? "Chưa có thông tin"}
              </Typography.Text>
            </div>
          </div>
        </Card>

        <Card
          className="tenant-info"
          title={
            <div className="invoice-panel-title">
              <UserOutlined />
              <span>Người thuê nhà</span>
              <Tag>{tenants.length}</Tag>
            </div>
          }
        >
          {tenants.length > 0 ? (
            tenants.map((tenantData) => (
              <section
                className="invoice-tenant-item"
                key={tenantData.tenantCode}
              >
                <Typography.Text strong className="invoice-tenant-name">
                  {tenantData.tenantName || "Chưa có tên"}
                </Typography.Text>
                <div className="invoice-detail-grid">
                  <div className="invoice-detail-item">
                    <span className="invoice-detail-label">Số điện thoại</span>
                    <Typography.Text className="invoice-detail-value">
                      {tenantData.phoneNumber || "Chưa có thông tin"}
                    </Typography.Text>
                  </div>
                  <div className="invoice-detail-item">
                    <span className="invoice-detail-label">Giới tính</span>
                    <Typography.Text className="invoice-detail-value">
                      {tenantData.gender === 0
                        ? "Nam"
                        : tenantData.gender === 1
                          ? "Nữ"
                          : "Chưa có thông tin"}
                    </Typography.Text>
                  </div>
                </div>
              </section>
            ))
          ) : (
            <Empty />
          )}
        </Card>

        <Card
          className="expense-info"
          title={
            <Flex style={{ alignItems: "center" }}>
              <div style={{ flex: 1 }}></div>
              <Button
                style={{ marginRight: "0.5rem" }}
                size="middle"
                disabled={expensesData.length === 0}
                onClick={createInvoice}
              >
                <>
                  <FileAddOutlined
                    size={500}
                    style={{ marginRight: "0.2rem" }}
                  />
                  Tạo hóa đơn
                </>
              </Button>
              <Button
                size="middle"
                type="primary"
                disabled={expensesData.length === 0}
                onClick={() => updateExpensesLocation()}
              >
                <>
                  <FileProtectOutlined
                    size={500}
                    style={{ marginRight: "0.2rem" }}
                  />
                  Nộp chi phí
                </>
              </Button>
            </Flex>
          }
        >
          <Typography style={{ marginBottom: "0.2rem", color: "#de4614" }}>
            Kiểm tra kỹ càng các chi phí phía dưới:
          </Typography>
          <BaseTable
            columns={invoiceExpenseColumns}
            data={expensesData}
            editable={true}
            onClickRow={(data: ExpenseLocationDataType) => {
              let index = expensesData.findIndex(
                (e) => e.expenseCode === data.expenseCode,
              );
              setSelectedExpenseData({ ...data, index });
              showDrawer();
            }}
          />
          <Flex justify="flex-end" style={{ marginTop: "1rem" }}>
            <Typography style={{ fontSize: "16px" }}>
              <EuroCircleOutlined style={{ marginRight: "0.5rem" }} />
              Tổng chi phí:{" "}
              <span
                style={{
                  fontWeight: "bold",
                  textDecoration: "underline",
                  fontStyle: "italic",
                  color: globalTheme.token.colorPrimary,
                }}
              >
                {totalMoney + " VNĐ"}
              </span>
            </Typography>
          </Flex>
        </Card>
      </div>

      <Drawer
        className="invoice-expense-drawer"
        title={`Sửa ${selectedExpense?.expenseName.toLowerCase()}`}
        onClose={onClose}
        open={openDrawer}
        width="min(720px, 100vw)"
        footer={
          <div className="invoice-drawer-actions">
            <Button onClick={onClose}>Hủy</Button>
            <Button onClick={onEditedSelectExpense} type="primary">
              Xác nhận chỉnh sửa
            </Button>
          </div>
        }
        destroyOnClose={true}
      >
        <Form layout="vertical">
          <Row gutter={12}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label={
                  <span>
                    <ControlOutlined style={{ marginRight: "0.2rem" }} />
                    Số cũ
                  </span>
                }
                required={true}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={selectedExpense?.unitName || "Kw/h"}
                  value={Number(selectedExpense?.initialUnit || 0)}
                  placeholder="Nhập giá dịch vụ"
                  onChange={(e) => {
                    debounce(
                      setSelectedExpenseData({
                        ...selectedExpense,
                        initialUnit: e,
                      }),
                      1000,
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item
                label={
                  <span>
                    <ControlOutlined style={{ marginRight: "0.2rem" }} />
                    Số mới
                  </span>
                }
                required={true}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={selectedExpense?.unitName || "Kw/h"}
                  value={Number(selectedExpense?.currentUnit || 0)}
                  placeholder="Nhập giá dịch vụ"
                  onChange={(e) => {
                    debounce(
                      setSelectedExpenseData({
                        ...selectedExpense,
                        currentUnit: e,
                      }),
                      1000,
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12}>
              <Form.Item
                label={
                  <span>
                    <MoneyCollectOutlined
                      size={100}
                      style={{ marginRight: "0.2rem" }}
                    />
                    Giá tiền
                  </span>
                }
                required={true}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  addonAfter={"VNĐ"}
                  disabled={true}
                  formatter={(e) => formatMoney(e)}
                  value={Number(selectedExpense?.price || 0)}
                  onChange={(e) => {
                    debounce(
                      setSelectedExpenseData({
                        ...selectedExpense,
                        price: e.toString(),
                      }),
                      1000,
                    );
                  }}
                  placeholder="Nhập giá dịch vụ"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={8} md={6}>
              <Form.Item
                label={
                  <span>
                    <FileImageOutlined style={{ marginRight: "0.2rem" }} />
                    Ảnh công tơ
                  </span>
                }
              >
                <Upload
                  accept="image/png, image/jpeg"
                  name="files"
                  listType="picture-card"
                  style={{ width: "150px" }}
                  customRequest={handleFileUpload}
                  beforeUpload={beforeUpload}
                  showUploadList={true}
                >
                  <div>
                    <PlusOutlined />
                    <div>Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>
            </Col>
            <Col xs={24} sm={16} md={18}>
              <Form.Item
                label={
                  <span>
                    <SlidersOutlined style={{ marginRight: "0.2rem" }} />
                    Thông số
                  </span>
                }
              >
                {processedData ? (
                  <Card
                    className="invoice-meter-result"
                    title="Dữ liệu ảnh đã xử lý"
                    style={{ marginTop: "1rem" }}
                  >
                    <pre className="invoice-meter-result-json">
                      {JSON.stringify(processedData, null, 2)}
                    </pre>
                  </Card>
                ) : (
                  <Card className="invoice-meter-result">
                    <Empty />
                  </Card>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
      </>
      ) : null}
    </>
  );
};

export default InvoicePage;
