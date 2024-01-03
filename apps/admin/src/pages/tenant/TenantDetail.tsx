import {
  Form,
  Radio,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Typography,
  Divider,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { TenantDataType } from "../../lib/interface";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface ITenantDetailProps {
  data: Partial<TenantDataType>;
  setData: (data: any) => void;
}

export const TenantDetailHeader = () => {
  return (
    <div>
      <Typography>
        Tenant Form
        <Divider />
      </Typography>
    </div>
  );
};

export const TenantDetail: React.FunctionComponent<ITenantDetailProps> = ({
  data,
  setData,
}) => {
  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{
        height: "75vh",
        maxHeight: "75vh",
        width: "100%",
        overflow: "auto",
      }}
    >
      <Form.Item label="Tenant Code">
        <Input
          value={data.tenantCode}
          onChange={(e) => {
            setData({ ...data, tenantCode: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Tenant Name">
        <Input
          value={data.tenantName}
          onChange={(e) => {
            setData({ ...data, tenantName: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Email">
        <Input
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Phone number">
        <Input
          value={data.phoneNumber}
          onChange={(e) => {
            setData({ ...data, phoneNumber: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Contact Address">
        <Input
          value={data.contactAddress}
          onChange={(e) => {
            setData({ ...data, contactAddress: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Date of Birth">
        <DatePicker
          value={dayjs(data.dateOfBirth, { format: dateFormatList[0] })}
          format={dateFormatList}
          onChange={(e) => {
            setData({ ...data, dateOfBirth: e.toDate() });
          }}
        />
      </Form.Item>

      <Form.Item label="Gender">
        <Radio.Group
          value={data.gender}
          onChange={(e) => {
            setData({ ...data, gender: e.target.value });
          }}
        >
          <Radio value={0}> Male </Radio>
          <Radio value={1}> Female </Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label="No. roomates">
        <InputNumber
          value={data.roomateCount}
          onChange={(v) => {
            setData({ ...data, roomateCount: v });
          }}
        />
      </Form.Item>
      <Form.Item
        label="Contract File"
        valuePropName="fileList"
        // getValueFromEvent={normFile}
      >
        <Upload action="/upload.do" listType="picture-card">
          <button style={{ border: 0, background: "none" }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </button>
        </Upload>
      </Form.Item>
      <Form.Item label="Contract Time">
        <RangePicker />
      </Form.Item>
      <Form.Item label="Note">
        <TextArea rows={4} value={data.description} />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};
