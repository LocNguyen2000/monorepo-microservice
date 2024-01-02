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
import { ProviderDataType } from "../../lib/interface";
import React from "react";

const { RangePicker } = DatePicker;

interface IRentProviderProps {
  data: Partial<ProviderDataType>;
  setData: (data: any) => void;
}

export const RentProviderDetail: React.FunctionComponent<
  IRentProviderProps
> = ({ data, setData }) => {
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
      <Form.Item label="Provider Code">
        <Input
          value={data.providerCode}
          onChange={(e) => {
            setData({ ...data, tenantCode: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Provider Name">
        <Input
          value={data.providerName}
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
      <Form.Item label="Gender">
        <Radio.Group>
          <Radio value="0"> Male </Radio>
          <Radio value="1"> Female </Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Tenants">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Locations">
        <Select>
          <Select.Option value="demo">Demo</Select.Option>
          <Select.Option value="demo">Demo</Select.Option>
          <Select.Option value="demo">Demo</Select.Option>
        </Select>
      </Form.Item>

      {/* <Form.Item label="TreeSelect">
        <TreeSelect
          treeData={[
            {
              title: "Light",
              value: "light",
              children: [{ title: "Bamboo", value: "bamboo" }],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Cascader">
        <Cascader
          options={[
            {
              value: "zhejiang",
              label: "Zhejiang",
              children: [
                {
                  value: "hangzhou",
                  label: "Hangzhou",
                },
              ],
            },
          ]}
        />
      </Form.Item>
      <Form.Item label="Locations">
        <DatePicker />
      </Form.Item>
      <Form.Item label="RangePicker">
        <RangePicker />
      </Form.Item> */}
      <Form.Item label="No. rooms">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Description">
        <TextArea rows={4} />
      </Form.Item>
    </Form>
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
