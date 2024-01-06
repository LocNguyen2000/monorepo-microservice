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
import React, { ChangeEventHandler } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface IRentProviderProps {
  data: Partial<ProviderDataType>;
  setData: (data: any) => void;
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
  ({ data, setData }) => {
    const formChangeHandler: ChangeEventHandler<
      HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
      const key = e.target.attributes.getNamedItem("name").value;
      const value = e.target.value;

      console.log(value);

      debounce(setData({ ...data, [key]: value }));
    };

    return (
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
        <Form.Item label="Provider Code">
          <Input
            value={data.providerCode}
            name="providerCode"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Provider Name">
          <Input
            value={data.providerName}
            name="providerName"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Email">
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
        <Form.Item label="Phone number">
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
        {/* <Form.Item label="Locations">
          <Select showSearch placeholder="Select locations that you provide">
            <Select.Option value="demo">Demo</Select.Option>
            <Select.Option value="demo">Demo</Select.Option>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item> */}
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
