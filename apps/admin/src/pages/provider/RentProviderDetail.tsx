import { Form, Radio, Input, DatePicker, InputNumber, Divider, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ProviderDataType } from "../../lib/interface";
import React, { ChangeEventHandler, useContext } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Modal from "antd/es/modal/Modal";
import { GlobalContext, getGlobalContext } from "../../lib/context";
import { ACTION_ENUM } from "../../lib/constants";
import { debounce } from "../../lib/utils";
import { ServiceClient } from "../../lib/clients";

dayjs.extend(customParseFormat);
/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

interface IRentProviderProps {
  data: ProviderDataType;
  setData: (data: ProviderDataType) => void;
  isOpen: boolean;
  action: ACTION_ENUM;
  setIsFormOpen: (action: ACTION_ENUM, data: ProviderDataType) => void;
  setSubmitEvent?: () => void;
}

export const RentProviderDetail: React.FunctionComponent<IRentProviderProps> = ({
  data,
  setData,
  isOpen,
  setIsFormOpen,
  action,
}) => {
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();

  const formChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const key = e.target.attributes.getNamedItem("name").value as keyof ProviderDataType;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/rent-provider", data);

        useNotify("success", "New Owner Added", `Submit form successfully for ${data.providerName}`);
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/rent-provider/${data.providerCode}`, data);

        useNotify("success", "Owner Updated Success", `Submit form successfully for ${data.providerName}`);
      }

      debounce(setIsFormOpen(ACTION_ENUM.CLOSE, {}));
    } catch (error) {
      console.log("Error", error);
      useNotify("error", "Owner Submission Error", "Form submission failed");
    }
  };

  return (
    <Modal
      title={
        <Typography>
          Provider Form
          <Divider />
        </Typography>
      }
      centered
      open={isOpen}
      okText="Submit"
      onOk={() =>
        useConfirm(
          "confirm",
          "Owner Confirmation",
          "Are you sure to submit this owner?",
          async () => await formSubmitHandler()
        )
      }
      cancelText="Return"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      width={800}
    >
      <Form
        labelCol={{ span: 4 }}
        layout="horizontal"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Provider Code" required={true}>
          <Input
            value={data.providerCode}
            name="providerCode"
            placeholder="Enter number here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Provider Name" required={true}>
          <Input
            value={data.providerName}
            name="providerName"
            placeholder="Enter your name here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Email" required={true}>
          <Input
            value={data.email}
            name="email"
            placeholder="Enter your email here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Contact Address">
          <Input
            value={data.contactAddress}
            name="contactAddress"
            placeholder="Enter your address"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Phone number" required={true}>
          <Input
            value={data.phoneNumber}
            name="phoneNumber"
            onChange={(e) => formChangeHandler(e)}
            placeholder="Enter your phone number"
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
            placeholder="Optional"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
