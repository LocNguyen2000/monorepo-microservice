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
  Button,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProviderDataType, TenantDataType } from "../../lib/interface";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ServiceClient } from "../../lib/clients";
import { ModalFooterRender } from "antd/es/modal/interface";
import { getGlobalContext } from "../../lib/context";

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

export const TenantDetailFooter = () => {
  const { useNotify } = getGlobalContext();
  const handleSubmitEvent = () => {};

  return (
    <>
      <Button key="back">Return</Button>
      <Button
        key="submit"
        type="primary"
        onClick={() => {
          useNotify("success", "New Tenant Added", "Submit form successfully");
        }}
      >
        Submit
      </Button>
    </>
  );
};

type ISelectProviders = Pick<
  ProviderDataType,
  "providerCode" | "providerName"
>[];

export const TenantDetailForm: React.FunctionComponent<ITenantDetailProps> = ({
  data,
  setData,
}) => {
  const [providers, setProviders] = useState<ISelectProviders>([]);
  const serviceClient = ServiceClient();

  useEffect(() => {
    serviceClient
      .get("/rent-providers")
      .then((res) => {
        console.log(res.data);

        setProviders(res.data);
      })
      .catch((e) => {
        console.log(e);
        setProviders([]);
      });
  }, []);
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
      <Form.Item label="Rent Owner">
        <Select
          showSearch
          placeholder="Select tenant"
          value={data.rentProviderId}
          onChange={(e) => {
            setData({ ...data, rentProviderId: e });
          }}
        >
          {providers.map((p) => (
            <Select.Option key={p.providerCode} value={p.providerCode}>
              {p.providerName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="No. roomates">
        <InputNumber
          value={data.roomateCount}
          onChange={(v) => {
            setData({ ...data, roomateCount: v });
          }}
        />
      </Form.Item>
      <Form.Item label="Contract File" valuePropName="fileList">
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
        <TextArea
          rows={4}
          value={data.description}
          onChange={(e) => {
            setData({ ...data, description: e.target.value });
          }}
        />
      </Form.Item>
      <Form.Item label="Switch" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};

const TenantDetail = {
  Footer: TenantDetailFooter,
  Header: TenantDetailHeader,
  Body: TenantDetailForm,
};

export default TenantDetail;
