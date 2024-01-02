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
        <Input value={data.email} />
      </Form.Item>
      <Form.Item label="Phone number">
        <Input value={data.phoneNumber} />
      </Form.Item>
      <Form.Item label="Date of Birth">
        <DatePicker />
      </Form.Item>
      <Form.Item label="Contract Time">
        <RangePicker />
      </Form.Item>
      <Form.Item label="Gender">
        <Radio.Group>
          <Radio value="apple"> Male </Radio>
          <Radio value="pear"> Female </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="City">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="No. roomates">
        <InputNumber />
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
      <Form.Item label="Note">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};
