import {
  Form,
  Checkbox,
  Radio,
  Input,
  Select,
  TreeSelect,
  Cascader,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Slider,
  ColorPicker,
  Divider,
  Typography,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProviderDataType, TenantDataType } from "../../lib/interface";
import React, { ChangeEventHandler, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Modal from "antd/es/modal/Modal";
import { getGlobalContext } from "../../lib/context";
import { ACTION_ENUM } from "../../lib/constants";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface IRentProviderProps {
  data: ProviderDataType;
  setData: (data: ProviderDataType) => void;
  isOpen: boolean;
  setIsFormOpen: (action: ACTION_ENUM, data: ProviderDataType) => void;
  setSubmitEvent?: () => void;
}

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

export const RentProviderDetail: React.FunctionComponent<IRentProviderProps> =
  ({ data, setData, isOpen, setIsFormOpen, setSubmitEvent }) => {
    const { useNotify } = getGlobalContext();

    const formChangeHandler: ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
      const key = e.target.attributes.getNamedItem("name")
        .value as keyof ProviderDataType;
      const value = e.target.value;

      setData({ ...data, [key]: value });
    };

    return (
      <Modal
        title={<RentProviderDetailHeader />}
        centered
        open={isOpen}
        onOk={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
        onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
        width={800}
        footer={[
          <Divider />,
          <Button key="back">Return</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => useNotify("success", "Nice", "hello")}
          >
            Submit
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{
            height: "62vh",
            maxHeight: "62vh",
            width: "100%",
            overflow: "auto",
          }}
        >
          <Form.Item label="Provider Code" required={true}>
            <Input
              value={data.providerCode}
              name="providerCode"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label="Provider Name" required={true}>
            <Input
              value={data.providerName}
              name="providerName"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label="Email" required={true}>
            <Input
              value={data.email}
              name="email"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label="Contact Address">
            <Input
              value={data.contactAdress}
              name="contactAdress"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label="Phone number" required={true}>
            <Input
              value={data.phoneNumber}
              name="phoneNumber"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
          <Form.Item label="Date of Birth">
            <DatePicker
              value={dayjs(data.dateOfBirth, { format: dateFormatList[0] })}
              format={dateFormatList}
              name="dateOfBirth"
              onChange={(e) => {
                setData({ ...data, dateOfBirth: e.toDate() });
              }}
            />
          </Form.Item>
          <Form.Item label="Gender">
            <Radio.Group
              value={data.gender}
              name="gender"
              onChange={(e) => {
                setData({ ...data, gender: e.target.value });
              }}
            >
              <Radio value={0}> Male </Radio>
              <Radio value={1}> Female </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="No. rooms">
            <InputNumber
              value={data.roomSize}
              name="roomSize"
              onChange={(e) => {
                setData({ ...data, roomSize: e });
              }}
            />
          </Form.Item>
          <Form.Item label="Description">
            <TextArea
              rows={4}
              value={data.description}
              name="description"
              onChange={(e) => formChangeHandler(e)}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export const RentProviderDetailHeader = () => {
  return (
    <div>
      <Typography>
        Provider Form
        <Divider />
      </Typography>
    </div>
  );
};
