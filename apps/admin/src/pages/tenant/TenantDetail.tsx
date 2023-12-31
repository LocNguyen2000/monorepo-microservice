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
  Space,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { TenantDataType } from "../../lib/interface";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

interface ITenantDetailProps {
  data: Partial<TenantDataType>;
  setData: (data: any) => void;
}

const TenantDetail: React.FunctionComponent<ITenantDetailProps> = ({
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
      <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
        <Checkbox>Checkbox</Checkbox>
      </Form.Item>
      <Form.Item label="Radio">
        <Radio.Group>
          <Radio value="apple"> Apple </Radio>
          <Radio value="pear"> Pear </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Select">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="InputNumber">
        <InputNumber />
      </Form.Item>
      <Form.Item label="TextArea">
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="ColorPicker">
        <ColorPicker />
      </Form.Item>
    </Form>
  );
};

export default TenantDetail;
