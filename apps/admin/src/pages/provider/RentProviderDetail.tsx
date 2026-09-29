import { Form, Radio, Input, DatePicker, InputNumber, Divider, Typography, Row, Col } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProviderDataType } from "../../lib/interface";
import React, { ChangeEventHandler, useContext } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Modal from "antd/es/modal/Modal";
import { getGlobalContext } from "../../lib/context";
import { ACTION_ENUM } from "../../lib/constants";
import { debounce } from "../../lib/utils";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface IRentProviderProps {
  data: ProviderDataType;
  setData: (data: ProviderDataType) => void;
  isOpen: boolean;
  action: ACTION_ENUM;
  setIsFormOpen: (action: ACTION_ENUM, data: ProviderDataType) => void;
  setSubmitEvent?: () => void;
}

export const RentProviderDetail: React.FunctionComponent<IRentProviderProps> = ({ data, setData, isOpen, setIsFormOpen, action }) => {
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();

  const formChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const key = e.target.attributes.getNamedItem("name").value as keyof ProviderDataType;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/rent-provider", data);

        useNotify("success", "Thêm chủ trọ mới thành công", `Đã gửi biểu mẫu thành công cho ${data.providerName}`);
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/rent-provider/${data.providerCode}`, data);

        useNotify("success", "Cập nhật chủ trọ thành công", `Đã gửi biểu mẫu thành công cho ${data.providerName}`);
      }

      debounce(setIsFormOpen(ACTION_ENUM.CLOSE, {}));
    } catch (error) {
      console.log("Error", error);
      useNotify("error", "Lỗi gửi thông tin chủ trọ", "Gửi biểu mẫu thất bại");
    }
  };

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Thông tin chủ trọ
          </Typography.Title>
          <Typography.Text type="secondary">
            Quản lý hồ sơ, liên hệ và thông tin địa điểm
          </Typography.Text>
        </div>
      }
      centered
      open={isOpen}
      okText="Gửi"
      onOk={() => useConfirm("confirm", "Xác nhận chủ trọ", "Bạn có chắc chắn muốn gửi thông tin chủ trọ này không?", async () => await formSubmitHandler())}
      cancelText="Quay lại"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      width="min(840px, calc(100vw - 32px))"
    >
      <Form
        layout="vertical"
        requiredMark
        style={{ width: "100%", paddingTop: 8 }}
      >
        <Divider orientation="left" plain>Thông tin cơ bản</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Mã chủ trọ" required>
              <Input value={data.providerCode} name="providerCode" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Tên chủ trọ" required>
              <Input
                value={data.providerName}
                name="providerName"
                placeholder="Nhập tên chủ trọ"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="left" plain>Thông tin liên hệ</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Email" required>
              <Input
                value={data.email}
                name="email"
                placeholder="Nhập email"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Số điện thoại" required>
              <Input
                value={data.phoneNumber}
                name="phoneNumber"
                placeholder="Nhập số điện thoại"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Địa chỉ liên hệ">
              <Input
                value={data.contactAddress}
                name="contactAddress"
                placeholder="Nhập địa chỉ liên hệ"
                onChange={(e) => formChangeHandler(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left" plain>Thông tin cá nhân và địa điểm</Divider>
        <Row gutter={[20, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item label="Ngày sinh">
              <DatePicker
                value={dayjs(data.dateOfBirth, { format: dateFormatList[0] })}
                format={dateFormatList}
                name="dateOfBirth"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setData({ ...data, dateOfBirth: e.toDate() });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item label="Số phòng">
              <InputNumber
                value={data.roomSize}
                name="roomSize"
                style={{ width: "100%" }}
                onChange={(e) => {
                  setData({ ...data, roomSize: e });
                }}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Giới tính">
              <Radio.Group
                value={data.gender}
                name="gender"
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

        <Divider orientation="left" plain>Mô tả</Divider>
        <Form.Item label="Mô tả">
          <TextArea rows={4} value={data.description} name="description" placeholder="Không bắt buộc" onChange={(e) => formChangeHandler(e)} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
