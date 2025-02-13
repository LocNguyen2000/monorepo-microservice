import { ControlOutlined, MoneyCollectOutlined, FileImageOutlined, PlusOutlined, SlidersOutlined } from "@ant-design/icons";
import { Drawer, Space, Button, Form, Row, Col, InputNumber, Upload, Card, Empty, notification } from "antd";
import { debounce, formatMoney } from "../../lib/utils";
import { WithRow } from "./InvoicePage";
import { ExpenseLocationDataType } from "../../lib/interface";
import { useState } from "react";
import { getGlobalContext } from "../../lib/context";
import { AxiosResponse } from "axios";

export class IElectricMeterImageResponse {
  electricMeterReading: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  voltage: string;
  current: string;
  frequency: string;
  powerFactor: string;
  temperature: string;
  phase: string;
  installationYear: string;
  locationMarking: string;
}

const InvoiceFocusExpenseDrawer: React.FunctionComponent = () => {
  const [selectedExpense, setSelectedExpenseData] = useState<WithRow<ExpenseLocationDataType> | null>(null);
  const [processedData, setProcessedData] = useState<IElectricMeterImageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const { serviceClient, useConfirm, useToast } = getGlobalContext();

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setSelectedExpenseData(null);
    setOpenDrawer(false);
    setProcessedData(null);
  };

  const onEditedSelectExpense = () => {
    if (!selectedExpense) return;

    const updatedExpenses = expensesData.map((el, index) => {
      if (index === selectedExpense.index) {
        delete selectedExpense.index;
        return selectedExpense;
      }
      return el;
    });

    setExpensesData(updatedExpenses);
    onClose();
  };

  const handleFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("files", file); // Send the file with the "files" key

    try {
      const { data } = await serviceClient.post<any, AxiosResponse<IElectricMeterImageResponse>>("/openai/process-meter-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success
      onSuccess("File uploaded successfully");
      setProcessedData(data);
      setSelectedExpenseData({ ...selectedExpense, initialUnit: selectedExpense.currentUnit, currentUnit: +data.electricMeterReading });
      notification.success({
        message: "Upload Successful",
        description: "The image has been processed successfully.",
      });
    } catch (error) {
      // Handle error
      console.error("Error uploading file:", error);
      onError(error);
      notification.error({
        message: "Upload Failed",
        description: "There was an error processing the image. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validate file before upload
   * @param file - The file being uploaded
   * @returns {boolean} - True if the file is valid
   */
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      notification.error({
        message: "Invalid File Type",
        description: "You can only upload JPG/PNG file!",
      });
    }
    return isJpgOrPng;
  };

  return (
    <Drawer
      title={`Sửa ${selectedExpense?.expenseName.toLowerCase()}`}
      onClose={onClose}
      open={openDrawer}
      width={720}
      styles={{
        body: {
          paddingBottom: 80,
        },
      }}
      extra={
        <Space>
          <Button onClick={onClose}>Hủy</Button>
          <Button onClick={onEditedSelectExpense} type="primary">
            Xác nhận chỉnh sửa
          </Button>
        </Space>
      }
      destroyOnClose={true}
    >
      <Form layout="vertical">
        <Row gutter={12}>
          <Col span={6}>
            <Form.Item
              label={
                <span>
                  <ControlOutlined style={{ marginRight: "0.2rem" }} />
                  Số cũ
                </span>
              }
              required={true}
            >
              <InputNumber
                style={{ width: "100%" }}
                addonAfter={selectedExpense?.unitName || "Kw/h"}
                value={Number(selectedExpense?.initialUnit || 0)}
                placeholder="Enter service price here"
                onChange={(e) => {
                  debounce(setSelectedExpenseData({ ...selectedExpense, initialUnit: e }), 1000);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={
                <span>
                  <ControlOutlined style={{ marginRight: "0.2rem" }} />
                  Số mới
                </span>
              }
              required={true}
            >
              <InputNumber
                style={{ width: "100%" }}
                addonAfter={selectedExpense?.unitName || "Kw/h"}
                value={Number(selectedExpense?.currentUnit || 0)}
                placeholder="Enter service price here"
                onChange={(e) => {
                  debounce(setSelectedExpenseData({ ...selectedExpense, currentUnit: e }), 1000);
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span>
                  <MoneyCollectOutlined size={100} style={{ marginRight: "0.2rem" }} />
                  Giá tiền
                </span>
              }
              required={true}
            >
              <InputNumber
                style={{ width: "100%" }}
                addonAfter={"VNĐ"}
                disabled={true}
                formatter={(e) => formatMoney(e)}
                value={Number(selectedExpense?.price || 0)}
                onChange={(e) => {
                  debounce(setSelectedExpenseData({ ...selectedExpense, price: e.toString() }), 1000);
                }}
                placeholder="Enter service price here"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <Form.Item
              label={
                <span>
                  <FileImageOutlined style={{ marginRight: "0.2rem" }} />
                  Ảnh công tơ
                </span>
              }
            >
              <Upload
                accept="image/png, image/jpeg"
                name="files"
                listType="picture-card"
                style={{ width: "150px" }}
                customRequest={handleFileUpload}
                beforeUpload={beforeUpload}
                showUploadList={true}
              >
                <div>
                  <PlusOutlined />
                  <div>Upload</div>
                </div>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item
              label={
                <span>
                  <SlidersOutlined style={{ marginRight: "0.2rem" }} />
                  Thông số
                </span>
              }
            >
              {processedData ? (
                <Card title="Processed Image Data" style={{ marginTop: "1rem" }}>
                  <pre>{JSON.stringify(processedData, null, 2)}</pre>
                </Card>
              ) : (
                <Card>
                  <Empty />
                </Card>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default InvoiceFocusExpenseDrawer;
