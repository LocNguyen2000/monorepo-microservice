import Modal from "antd/es/modal/Modal";
import { ChangeEventHandler, FunctionComponent } from "react";
import { ExpenseDataType, ExpenseType } from "../../lib/interface";
import { ACTION_ENUM } from "../../lib/constants";
import Typography from "antd/es/typography/Typography";
import Divider from "antd/es/divider";
import BaseEditableTable from "../../components/BaseEditableTable";
import { Form, Input, InputNumber, Radio, Select } from "antd";
import { debounce } from "../../lib/utils";
import { getGlobalContext } from "../../lib/context";

interface IExpenseDetailProps {
  data: Partial<ExpenseDataType>;
  isOpen: boolean;
  action: ACTION_ENUM;
  setData: (data: Partial<ExpenseDataType>) => void;
  setIsFormOpen: (action: ACTION_ENUM, data: Partial<ExpenseDataType>) => void;
  setSubmitEvent?: () => void;
}

const ExpenseDetail: FunctionComponent<IExpenseDetailProps> = ({ data, isOpen, action, setIsFormOpen, setData }) => {
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();

  const formChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const key = e.target.attributes.getNamedItem("name").value as keyof ExpenseDataType;
    const value = e.target.value;

    debounce(setData({ ...data, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/expense", data);

        useNotify("success", "New Owner Added", `Submit form successfully for ${data.expenseName}`);
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/expense/${data.expenseCode}`, data);

        useNotify("success", "Owner Updated Success", `Submit form successfully for ${data.expenseName}`);
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
          Expense Form
          <Divider />
        </Typography>
      }
      open={isOpen}
      okText="Submit"
      cancelText="Return"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      onOk={() =>
        useConfirm(
          "confirm",
          "Expense Confirmation",
          "Are you sure to submit this expense?",
          async () => await formSubmitHandler()
        )
      }
      width={900}
    >
      {/* <BaseEditableTable columns={[]} data={[]} /> */}
      <Form
        labelCol={{ span: 4 }}
        layout="horizontal"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Expense Code" required={true}>
          <Input
            value={data.expenseCode}
            name="expenseCode"
            placeholder="Enter number here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Expense Name" required={true}>
          <Input
            value={data.expenseName}
            name="expenseName"
            placeholder="Enter service that you will charge here"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Price" required={true}>
          <InputNumber
            value={data.price}
            name="price"
            placeholder="Enter service price here"
            onChange={(e) => {
              setData({ ...data, price: e });
            }}
            style={{ width: 250 }}
            min="0"
          />
        </Form.Item>
        <Form.Item label="Service Type" required={true}>
          <Select
            showSearch
            placeholder="Electric, Water or anything"
            value={data.type}
            onChange={(e) => {
              setData({ ...data, type: e });
            }}
          >
            {Object.keys(ExpenseType).map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="In Used" required={true}>
          <Radio.Group
            value={data.inUsed}
            name="inUsed"
            onChange={(e) => {
              setData({ ...data, inUsed: e.target.value });
            }}
          >
            <Radio value={true}> Active </Radio>
            <Radio value={false}> Disable </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseDetail;
