import {
  Form,
  Radio,
  Input,
  Select,
  DatePicker,
  Typography,
  Divider,
  Upload,
  Row,
  Col,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  LocationDataType,
  PaginatedResponse,
  TenantDataType,
} from "../../lib/interface";
import { ChangeEventHandler, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ServiceClient } from "../../lib/clients";
import { getGlobalContext } from "../../lib/context";
import Modal from "antd/es/modal/Modal";
import { ACTION_ENUM } from "../../lib/constants";
import { debounce } from "../../lib/utils";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface ITenantDetailProps {
  data: TenantDataType;
  setData: (data: TenantDataType) => void;
  isOpen: boolean;
  action: ACTION_ENUM;
  setIsFormOpen: (action: ACTION_ENUM, data: TenantDataType) => void;
  setSubmitEvent?: () => void;
}

type ISelectLocations = Pick<
  LocationDataType,
  "locationCode" | "locationName"
>[];

export const TenantDetailForm: React.FunctionComponent<ITenantDetailProps> = ({
  data,
  setData,
  isOpen,
  setIsFormOpen,
  action,
}) => {
  const [locations, setLocations] = useState<ISelectLocations>([]);
  const [contractFile, setContractFile] = useState<File>();
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();

  const formChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const key = e.target.attributes.getNamedItem("name")
      .value as keyof TenantDataType;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      console.log(action);

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(
            key,
            value instanceof Date ? value.toISOString() : String(value),
          );
        }
      });
      if (contractFile) formData.append("contract", contractFile);

      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/tenant", formData);

        useNotify(
          "success",
          "Thêm người thuê mới thành công",
          `Đã gửi biểu mẫu thành công cho ${data.tenantName}`,
        );
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/tenant/${data.tenantCode}`, formData);

        useNotify(
          "success",
          "Cập nhật người thuê thành công",
          `Đã gửi biểu mẫu thành công cho ${data.tenantName}`,
        );
      }

      setContractFile(undefined);
      debounce(setIsFormOpen(ACTION_ENUM.CLOSE, {}));
    } catch (error) {
      console.log("Error", error);
      useNotify(
        "error",
        "Lỗi gửi thông tin người thuê",
        "Gửi biểu mẫu thất bại.",
      );
    }
  };

  useEffect(() => {
    serviceClient
      .get(`/location`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Thông tin người thuê
          </Typography.Title>
          <Typography.Text type="secondary">
            Cập nhật hồ sơ, liên hệ và thông tin thuê
          </Typography.Text>
        </div>
      }
      centered
      open={isOpen}
      okText="Gửi"
      onOk={() =>
        useConfirm(
          "confirm",
          "Xác nhận người thuê",
          "Bạn có chắc chắn muốn gửi thông tin người thuê này không?",
          async () => await formSubmitHandler(),
        )
      }
      cancelText="Quay lại"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      width="min(920px, calc(100vw - 32px))"
    >
      <Form
        layout="vertical"
        requiredMark
        style={{
          maxHeight: "min(68vh, 680px)",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          padding: "8px 8px 0 2px",
        }}
      >
        <Divider orientation="left" plain>Thông tin cá nhân</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Mã người thuê" required>
              <Input name="tenantCode" value={data.tenantCode} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Tên người thuê" required>
              <Input
                name="tenantName"
                value={data.tenantName}
                placeholder="Nhập tên người thuê"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Ngày sinh">
              <DatePicker
                value={dayjs(data.dateOfBirth, { format: dateFormatList[0] })}
                format={dateFormatList}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setData({ ...data, dateOfBirth: e.toDate() });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Giới tính">
              <Radio.Group
                value={data.gender}
                onChange={(e) => {
                  setData({ ...data, gender: e.target.value });
                }}
              >
                <Radio value={0}>Nam</Radio>
                <Radio value={1}>Nữ</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>Thông tin liên hệ</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Email" required>
              <Input
                name="email"
                value={data.email}
                placeholder="Nhập email hợp lệ"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Số điện thoại" required>
              <Input
                name="phoneNumber"
                value={data.phoneNumber}
                placeholder="Nhập số điện thoại"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ tạm trú" required>
              <Input
                name="contactAddress"
                value={data.contactAddress}
                placeholder="Nhập địa chỉ tạm trú"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>Thông tin thuê</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Phòng trọ" required>
              <Select
                showSearch
                placeholder="Chọn phòng trọ"
                value={data.locationCode}
                disabled={Number.isSafeInteger(data?.locationCode)}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setData({ ...data, locationCode: e });
                }}
              >
                {locations.map((p) => (
                  <Select.Option key={p.locationCode} value={p.locationCode}>
                    {p.locationName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Ảnh hợp đồng/CCCD" valuePropName="fileList">
          {data.contractUrl && (
            <Typography.Link
              href={data.contractUrl}
              target="_blank"
              rel="noreferrer"
            >
              Xem hợp đồng đã tải lên
            </Typography.Link>
          )}
          <Upload
            accept="image/*,.pdf"
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
              setContractFile(file);
              return false;
            }}
            onRemove={() => {
              setContractFile(undefined);
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

        <Divider orientation="left" plain>Ghi chú</Divider>
        <Form.Item label="Ghi chú">
          <TextArea
            rows={4}
            placeholder="Nhập ghi chú"
            value={data.description}
            onChange={(e) => {
              setData({ ...data, description: e.target.value });
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TenantDetailForm;
