import Modal from "antd/es/modal/Modal";
import { ChangeEventHandler, FunctionComponent } from "react";
import { ExpenseDataType, ExpenseType, ExpenseUnitType } from "../../lib/interface";
import { ACTION_ENUM } from "../../lib/constants";
import Typography from "antd/es/typography/Typography";
import Divider from "antd/es/divider";
import BaseEditableTable from "../../components/BaseEditableTable";
import { Button, Form, Input, InputNumber, Radio, Select } from "antd";
import { debounce, autoGenerateNewCode } from "../../lib/utils";
import { getGlobalContext } from "../../lib/context";

interface IExpenseDetailProps {
  data: Partial<ExpenseDataType>;
  isOpen: boolean;
  action: ACTION_ENUM;
  setData: (data: Partial<ExpenseDataType>) => void;
  setIsFormOpen: (action: ACTION_ENUM, data: Partial<ExpenseDataType>) => void;
  setSubmitEvent?: () => void;
  codeGenerator?: () => void;
}

const ExpenseDetail: FunctionComponent<IExpenseDetailProps> = ({ data, isOpen, action, setIsFormOpen, setData, codeGenerator }) => {
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

        useNotify("success", "Thêm chi phí mới thành công", `Đã gửi biểu mẫu thành công cho ${data.expenseName}`);
      } else if (action === ACTION_ENUM.EDIT) {
        await serviceClient.put(`/expense/${data.expenseCode}`, data);

        useNotify("success", "Cập nhật chi phí thành công", `Đã gửi biểu mẫu thành công cho ${data.expenseName}`);
      }

      debounce(setIsFormOpen(ACTION_ENUM.CLOSE, {}));
    } catch (error) {
      console.log("Error", error);
      useNotify("error", "Lỗi gửi chi phí", "Gửi biểu mẫu thất bại");
    }
  };

  return (
    <Modal
      title={
        <Typography>
          Biểu mẫu chi phí
          <Divider />
        </Typography>
      }
      open={isOpen}
      okText="Gửi"
      cancelText="Quay lại"
      onCancel={() => setIsFormOpen(ACTION_ENUM.CLOSE, {})}
      onOk={() =>
        useConfirm(
          "confirm",
          "Xác nhận chi phí",
          "Bạn có chắc chắn muốn gửi chi phí này không?",
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
        <Form.Item label="Mã chi phí" required={true}>
          <Input
            value={data.expenseCode}
            name="expenseCode"
            placeholder="Mã dịch vụ"
            onChange={(e) => formChangeHandler(e)}
            addonAfter={<Button style={{border: 'none', height: 'auto'}} onClick={() => codeGenerator()}>Tự điền mã nhập</Button>}
          />
        </Form.Item>
        <Form.Item label="Tên chi phí" required={true}>
          <Input
            value={data.expenseName}
            name="expenseName"
            placeholder="Điền tên loại chi phí dịch vụ"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Giá tiền" required={true}>
          <InputNumber
            value={data.price}
            name="price"
            placeholder="VNĐ"
            onChange={(e) => {
              setData({ ...data, price: e });
            }}
            style={{ width: 250 }}
            min="0"
          />
        </Form.Item>
        <Form.Item label="Loại dịch vụ" required={true}>
          <Select
            showSearch
            placeholder="theo đầu người, cố định"
            value={data.type}
            onChange={(e) => {
              setData({ ...data, type: e });
            }}
          >
            {Object.keys(ExpenseUnitType).map((p) => (
              <Select.Option key={p} value={p}>
                {ExpenseUnitType[p]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Đơn vị tính" required={true}>
          <Input
            value={data.unitName}
            name="unitName"
            placeholder="Ví dụ: kWh, người, tháng"
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Trạng thái" required={true}>
          <Radio.Group
            value={data.inUsed}
            name="inUsed"
            onChange={(e) => {
              setData({ ...data, inUsed: e.target.value });
            }}
          >
            <Radio value={true}> Sử dụng </Radio>
            <Radio value={false}> Không hoạt động </Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExpenseDetail;
