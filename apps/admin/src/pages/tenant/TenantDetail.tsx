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
import { ChangeEventHandler, useEffect, useState } from "react";
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

export const TenantDetailFooter: React.FunctionComponent<{
  data: Partial<TenantDataType>;
}> = ({ data }) => {
  const { useNotify } = getGlobalContext();
  const serviceClient = ServiceClient();
  const handleSubmitEvent = () => {
    serviceClient
      .post("/tenant", data)
      .then((res) => {
        useNotify(
          "success",
          "New Tenant Added",
          `Submit form successfully for ${data.tenantName}`
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Button key="back">Return</Button>
      <Button key="submit" type="primary" onClick={() => handleSubmitEvent()}>
        Submit
      </Button>
    </>
  );
};

function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

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

  const formChangeHandler: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    const key = e.target.attributes.getNamedItem("name").value;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

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
          name="tenantCode"
          value={data.tenantCode}
          onChange={(e) => formChangeHandler(e)}
        />
      </Form.Item>
      <Form.Item label="Tenant Name">
        <Input
          name="tenantName"
          value={data.tenantName}
          onChange={(e) => formChangeHandler(e)}
        />
      </Form.Item>
      <Form.Item label="Email">
        <Input
          name="email"
          value={data.email}
          onChange={(e) => formChangeHandler(e)}
        />
      </Form.Item>
      <Form.Item label="Phone number">
        <Input
          name="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => formChangeHandler(e)}
        />
      </Form.Item>
      <Form.Item label="Contact Address">
        <Input
          name="contactAddress"
          value={data.contactAddress}
          onChange={(e) => formChangeHandler(e)}
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
