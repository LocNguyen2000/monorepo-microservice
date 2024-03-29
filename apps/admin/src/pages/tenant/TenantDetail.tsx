import { Form, Radio, Input, Select, DatePicker, InputNumber, Switch, Typography, Divider, Upload, Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { LocationDataType, PaginatedResponse, ProviderDataType, TenantDataType } from "../../lib/interface";
import { ChangeEventHandler, useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ServiceClient } from "../../lib/clients";
import { getGlobalContext } from "../../lib/context";
import Modal from "antd/es/modal/Modal";
import { ACTION_ENUM } from "../../lib/constants";
import { debounce } from "../../lib/utils";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface ITenantDetailProps {
  data: TenantDataType;
  setData: (data: TenantDataType) => void;
  isOpen: boolean;
  action: ACTION_ENUM;
  setIsFormOpen: (action: ACTION_ENUM, data: TenantDataType) => void;
  setSubmitEvent?: () => void;
}

type ISelectLocations = Pick<LocationDataType, "locationCode" | "locationName">[];

export const TenantDetailForm: React.FunctionComponent<ITenantDetailProps> = ({
  data,
  setData,
  isOpen,
  setIsFormOpen,
  action,
}) => {
  const [locations, setLocations] = useState<ISelectLocations>([]);
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();

  const formChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const key = e.target.attributes.getNamedItem("name").value as keyof TenantDataType;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      console.log(action);

      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/tenant", { ...data });

        useNotify("success", "New Tenant Added", `Submit form successfully for ${data.tenantName}`);
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/tenant/${data.tenantCode}`, { ...data });

        useNotify("success", "Tenant Updated Success", `Submit form successfully for ${data.tenantName}`);
      }

      debounce(setIsFormOpen(ACTION_ENUM.CLOSE, {}));
    } catch (error) {
      console.log("Error", error);
      useNotify("error", "Tenant Submission Error", `Form submission failed.`);
    }
  };

  useEffect(() => {
    serviceClient
      .get(`/location`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  return (
    <Modal
      title={
        <Typography>
          Tenant Form
          <Divider />
        </Typography>
      }
      centered
      open={isOpen}
      okText="Submit"
      onOk={() =>
        useConfirm(
          "confirm",
          "Tenant Confirmation",
          "Are you sure to submit this tenant?",
          async () => await formSubmitHandler()
        )
      }
      cancelText="Return"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      width={1000}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        layout="horizontal"
        style={{
          height: "75vh",
          maxHeight: "75vh",
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Tenant Code" required={true}>
          <Input
            name="tenantCode"
            value={data.tenantCode}
            placeholder="Enter a number here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Tenant Name" required={true}>
          <Input
            name="tenantName"
            value={data.tenantName}
            placeholder="Enter tenant name"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Email" required={true}>
          <Input
            name="email"
            value={data.email}
            placeholder="Enter valid email"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Phone number" required={true}>
          <Input
            name="phoneNumber"
            value={data.phoneNumber}
            placeholder="Enter phone number"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Contact Address" required={true}>
          <Input
            name="contactAddress"
            value={data.contactAddress}
            placeholder="Enter contact address"
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
        <Form.Item label="Locations" required={true}>
          <Select
            showSearch
            placeholder="Tenant Location"
            value={data.locationCode}
            onChange={(e) => {
              setData({ ...data, locationCode: e });
            }}
          >
            {locations.map((p) => (
              <Select.Option key={p.locationCode} value={p.locationCode}>
                {p.locationName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="No. roomates" required={true}>
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
            placeholder="Take some notes!"
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
      <Divider />
    </Modal>
  );
};

export default TenantDetailForm;
