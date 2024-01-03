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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface IRentProviderProps {
  data: Partial<ProviderDataType>;
  setData: (data: any) => void;
}

export const RentProviderDetail: React.FunctionComponent<IRentProviderProps> =
  ({ data, setData }) => {
    return (
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{
          height: "72vh",
          maxHeight: "72vh",
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Provider Code">
          <Input
            value={data.providerCode}
            onChange={(e) => {
              setData({ ...data, providerCode: e.target.value });
            }}
          />
        </Form.Item>
        <Form.Item label="Provider Name">
          <Input
            value={data.providerName}
            onChange={(e) => {
              setData({ ...data, providerName: e.target.value });
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
        <Form.Item label="Contact Address">
          <Input
            value={data.contactAdress}
            onChange={(e) => {
              setData({ ...data, contactAdress: e.target.value });
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
        <Form.Item label="Tenants">
          <Select showSearch placeholder="Select tenant">
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Locations">
          <Select showSearch placeholder="Select locations that you provide">
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
          <InputNumber value={data.roomSize} />
        </Form.Item>
        <Form.Item label="Description">
          <TextArea rows={4} value={data.description} />
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
