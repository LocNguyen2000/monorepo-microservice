import { BellOutlined, EditOutlined, SendOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Modal,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { getGlobalContext } from "../../lib/context";
import {
  InvoiceScheduleDataType,
  InvoiceScheduleRowDataType,
} from "../../lib/interface";

const getNextReminder = (dueDay?: number) => {
  if (!dueDay) return "-";
  const dueDate = dayjs().date(dueDay);
  const nextDueDate = dueDate.isBefore(dayjs(), "day")
    ? dueDate.add(1, "month")
    : dueDate;
  return nextDueDate.subtract(1, "day").format("DD/MM/YYYY");
};

const SchedulePage = () => {
  const [rows, setRows] = useState<InvoiceScheduleRowDataType[]>([]);
  const [selectedRow, setSelectedRow] = useState<InvoiceScheduleRowDataType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { serviceClient, useNotify, useToast } = getGlobalContext();

  const loadData = async () => {
    try {
      const { data } = await serviceClient.get<InvoiceScheduleRowDataType[]>(
        "/invoices/schedules",
      );
      setRows(data);
    } catch (error) {
      console.log(error);
      useNotify(
        "error",
        "Không thể tải lịch thông báo",
        "Vui lòng thử lại sau.",
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openEdit = (row: InvoiceScheduleRowDataType) => {
    setSelectedRow(row);
    form.setFieldsValue({
      dueDay: row.schedule?.dueDay ?? 1,
      invoiceCode: row.schedule?.invoiceCode,
      enabled: row.schedule?.enabled ?? false,
    });
    setIsModalOpen(true);
  };

  const saveSchedule = async (
    values: Pick<InvoiceScheduleDataType, "dueDay" | "invoiceCode" | "enabled">,
  ) => {
    if (!selectedRow) return;
    try {
      await serviceClient.put(
        `/invoices/schedules/${selectedRow.location.locationCode}`,
        values,
      );
      useToast("success", "Đã lưu lịch thông báo");
      setIsModalOpen(false);
      await loadData();
    } catch (error) {
      console.log(error);
      useNotify(
        "error",
        "Không thể lưu lịch thông báo",
        "Kiểm tra hóa đơn và ngày đến hạn.",
      );
    }
  };

  const notifyNow = async (row: InvoiceScheduleRowDataType) => {
    try {
      const { data } = await serviceClient.post(
        `/invoices/schedules/${row.location.locationCode}/notify`,
      );
      if (data.status === "FAILED") {
        useNotify("error", "Không thể gửi thông báo", data.message);
        await loadData();
        return;
      }
      useToast("success", "Đã gửi thông báo qua email");
      await loadData();
    } catch (error) {
      console.log(error);
      useNotify(
        "error",
        "Không thể gửi thông báo",
        "Lịch phải được bật và phòng trọ phải có người thuê.",
      );
    }
  };

  return (
    <Card
      title={
        <Space>
          <BellOutlined />
          <span>Lệnh lịch thông báo</span>
        </Space>
      }
      extra={
        <Button icon={<SendOutlined />} onClick={loadData}>
          Làm mới
        </Button>
      }
    >
      <Typography.Paragraph>
        Thiết lập nhắc thanh toán hàng tháng cho từng phòng trọ. Thông báo được
        gửi trước ngày đến hạn một ngày.
      </Typography.Paragraph>
      <Table
        rowKey={(row) => row.location.locationCode}
        dataSource={rows}
        columns={[
          {
            title: "Phòng trọ",
            render: (_: unknown, row: InvoiceScheduleRowDataType) => (
              <Space direction="vertical" size={0}>
                <Typography.Text strong>
                  {row.location.locationName}
                </Typography.Text>
                <Typography.Text type="secondary">
                  #{row.location.locationCode}
                </Typography.Text>
              </Space>
            ),
          },
          {
            title: "Hóa đơn",
            render: (_: unknown, row: InvoiceScheduleRowDataType) =>
              row.schedule?.invoiceCode ? (
                `#${row.schedule.invoiceCode}`
              ) : (
                <Tag>Chưa gán</Tag>
              ),
          },
          {
            title: "Ngày đến hạn",
            render: (_: unknown, row: InvoiceScheduleRowDataType) =>
              row.schedule ? `Ngày ${row.schedule.dueDay}` : "Chưa thiết lập",
          },
          {
            title: "Nhắc tiếp theo",
            render: (_: unknown, row: InvoiceScheduleRowDataType) =>
              getNextReminder(row.schedule?.dueDay),
          },
          {
            title: "Trạng thái",
            render: (_: unknown, row: InvoiceScheduleRowDataType) =>
              row.schedule?.enabled ? (
                <Tag color="green">Đang bật</Tag>
              ) : (
                <Tag>Đang tắt</Tag>
              ),
          },
          {
            title: "Lần gửi gần nhất",
            render: (_: unknown, row: InvoiceScheduleRowDataType) =>
              row.schedule?.lastNotifiedAt
                ? dayjs(row.schedule.lastNotifiedAt).format("DD/MM/YYYY HH:mm")
                : "Chưa gửi",
          },
          {
            title: "Thao tác",
            render: (_: unknown, row: InvoiceScheduleRowDataType) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(row)}>
                  Thiết lập
                </Button>
                <Button
                  icon={<SendOutlined />}
                  disabled={!row.schedule?.enabled}
                  onClick={() => notifyNow(row)}
                >
                  Gửi ngay
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={`Thiết lập lịch: ${selectedRow?.location.locationName ?? ""}`}
        open={isModalOpen}
        okText="Lưu"
        cancelText="Hủy"
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={saveSchedule}>
          <Form.Item name="invoiceCode" label="Hóa đơn áp dụng">
            <Select
              allowClear
              placeholder="Chọn hóa đơn"
              options={selectedRow?.invoices.map((invoice) => ({
                value: invoice.invoiceCode,
                label: `#${invoice.invoiceCode} - ${Number(invoice.totalAmount).toLocaleString("vi-VN")} VNĐ`,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="dueDay"
            label="Ngày đến hạn hàng tháng"
            rules={[{ required: true, min: 1, max: 28, type: "number" }]}
          >
            <InputNumber min={1} max={28} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="enabled" label="Kích hoạt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SchedulePage;
