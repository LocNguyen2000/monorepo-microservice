import { UserOutlined, ArrowRightOutlined, EuroCircleOutlined, HomeOutlined, IdcardOutlined, PlusOutlined, MoneyCollectOutlined, ControlOutlined, FileImageOutlined, SlidersOutlined, FileProtectOutlined, FileAddOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Empty,
  Flex,
  Form,
  Input,
  InputNumber,
  notification,
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import {
  ExpenseLocationDataType,
  InvoiceDataType,
  LocationDataType,
  PaginatedResponse,
  ProviderDataType,
  TenantDataType,
} from "../../lib/interface";
import { getGlobalContext } from "../../lib/context";
import { debounce, formatMoney } from "../../lib/utils";
import Upload from "antd/es/upload/Upload";
import BaseTable from "../../components/BaseTable";
import { expenseLocationColumns } from "../../lib/constants/columns";
import { globalTheme } from "../../css/theme";
import TextArea from "antd/es/input/TextArea";

export type WithRow<T> = T & {
  index: number | string
}

const InvoicePage: React.FunctionComponent = () => {
  const [locations, setLocations] = useState<LocationDataType[]>([]);
  const [locationData, setLocationData] = useState<Partial<LocationDataType>>({});
  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const [ownerData, setOwnerData] = useState<Partial<ProviderDataType>>({});
  const [expensesData, setExpensesData] = useState<ExpenseLocationDataType[]>([]);
  const [selectedExpense, setSelectedExpenseData] = useState<WithRow<ExpenseLocationDataType> | null>(null);
  const [loading, setLoading] = useState(false);
  const [processedData, setProcessedData] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const { serviceClient, useConfirm, useToast } = getGlobalContext();
  const totalMoney = useMemo<string>(() => formatMoney(expensesData.reduce<number>((acc, prev) => {
    const val = (prev.currentUnit - prev.initialUnit) * +prev.price;
    return acc + val
  }, 0)), [expensesData]) 

  console.log('totalMOney', totalMoney);
  

  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setSelectedExpenseData(null)
    setOpenDrawer(false);
  };

  const onEditedSelectExpense = () => {
    if (!selectedExpense) return

    const updatedExpenses = expensesData.map((el, index) => {
      if (index === selectedExpense.index){
        delete selectedExpense.index
        return selectedExpense
      }
      return el 
    })

    setExpensesData(updatedExpenses)
    onClose()    
  }


  // const loadAllData = async (tenantCode: number) => {
  //   try {
  //     const { data: i } = await serviceClient.get<InvoiceDataType>(`/invoices/${tenantCode}`);

  //     setTenantData(i.tenant);
  //     if (i.location) setLocationData(i.location);
  //     if (Array.isArray(i.location.expenses)) setExpensesData(i.location.expenses);
  //     if (i.owner) setOwnerData(i.owner);

  //     // Get Location
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getSummerizeData = async (locationCode: number) => {
    try {
      const {data} = await serviceClient.get<InvoiceDataType>(`/invoices/get-summerize-data/${locationCode}`)

      console.log('Test', data);
      if (data.location) setLocationData(data.location)
      if (data.owner) setOwnerData(data.owner)
      if (Array.isArray(data.location.expenses)) setExpensesData(data.location.expenses)
      if (Array.isArray(data.tenants)) setTenants(data.tenants)
      
    } catch (error) {
      console.log(error);
    }
  }

  const loadData = () => {
    serviceClient
      .get(`/location`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data)
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const updateExpensesLocation = async () => {
    useConfirm('confirm', "Nộp chi phí", "Xác nhận lưu lại chi phí cho lần sau?", async () => {
      const locationCode = locationData.locationCode
      await serviceClient.patch(`/location/${locationCode}`, expensesData);

      useToast('success', "Cập nhật chi phí thành công. Bạn có thể tạo hóa đơn để gửi người thuê nhà.")
    })
  }

  useEffect(() => {
    loadData();
  }, []);

  /**
   * Custom request to upload file to OpenAI API
   * @param options - Contains file, onSuccess, onError, and onProgress callbacks
   */
  const handleFileUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("files", file); // Send the file with the "files" key

    try {
      const response = await serviceClient.post("/openai/process-meter-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });


      // Handle success
      onSuccess("File uploaded successfully");
      setProcessedData(response.data);
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
    <>
      <Card className="summerize" style={{ padding: "0.25rem" }}>
        <Flex
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div>
            <h2>Invoices</h2>
            <Typography style={{ marginBottom: "0.25rem" }}>
              - Summarize all invoices, generate an invoice for a tenant (Require information from location, expense, rent owners)
            </Typography>
          </div>
          <div style={{ flex: 1 }}></div>
        </Flex>
      </Card>

      

      <Flex gap="1.2rem">
        <div style={{width: '25%'}}>
          <Card className="location-info"
            style={{marginBottom: '0.5rem'}}
            title={
              <Flex style={{ alignItems: "center", marginRight: "2rem"}}>
                <Typography style={{ marginRight: "0.5rem" }}>
                  <HomeOutlined style={{ marginRight: "0.5rem" }} />
                  Phòng trọ
                </Typography>
                  <Select
                  showSearch
                  placeholder="Chọn phòng trọ"
                  value={locationData.locationCode}
                  onChange={async (e) => await getSummerizeData(+e)}
                  style={{ width: "100%" }}
                >
                  {locations.map((p) => (
                    <Select.Option key={p.locationCode} value={p.locationCode}>
                      {p.locationName}
                    </Select.Option>
                  ))}
                </Select>
              </Flex>
            }
          >
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Địa chỉ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.locationAddress} placeholder="Vị trí phòng trọ"  />
              </Form.Item>
              <Form.Item label="Chủ trọ">
                <Input disabled={true} style={{ fontWeight: "bold", width: '100%' }} value={ownerData.providerName} placeholder="Tên chủ trọ" />
              </Form.Item>
              <Form.Item label="Số người">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.roomSize} placeholder="Số lượng người ở phòng trọ" />
              </Form.Item>
              <Form.Item label="Ghi chú">
                <TextArea rows={4} style={{ fontWeight: "bold" }} placeholder="Nội dung ghi chú..." value={locationData.description} disabled={true}/>              
              </Form.Item>
            </Form>
          </Card>
        </div>

        <Card className="tenant-info" style={{width: "25%"}}
          title={
            <Flex style={{ alignItems: "center" }}>
                <Typography style={{ marginRight: "0.5rem" }}>
                  <UserOutlined style={{ marginRight: "0.5rem" }} />
                  Người thuê nhà
                </Typography>
            </Flex>
          }
        >
            {tenants.length > 0 ? tenants.map((tenantData) => {
              return (
                <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal" style={{width: '100%'}}>
                  <Form.Item label="Họ và tên">
                    <Input disabled={true} style={{ fontWeight: "bold", width: '100%' }} value={tenantData.tenantName} placeholder="Tên người thuê nhà"/>
                  </Form.Item>
                  <Form.Item label="Email">
                    <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.email} placeholder="Valid email" />
                  </Form.Item>
                  <Form.Item label="Số điện thoại">
                    <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.phoneNumber} placeholder="Số điện thoại" />
                  </Form.Item>
                  <Form.Item label="Giới tính">
                    <Radio.Group value={tenantData.gender} disabled={true}>
                      <Radio value={0}> Nam </Radio>
                      <Radio value={1}> Nữ </Radio>
                    </Radio.Group>
                  </Form.Item>
                  <Divider/>  
                </Form>)}) : <Empty/>
              }
        </Card>

        
        <Card className="expense-info" style={{ width: "50%" }}
          title={
            <Flex style={{ alignItems: "center" }}>
              <Typography 
                style={{ marginRight: "1rem", fontSize: "16px" }}>
                <EuroCircleOutlined style={{ marginRight: "0.5rem" }} />
                Tổng chi phí: {" "}
                <span style={{ 
                  fontWeight: "bold", 
                  textDecoration: "underline", 
                  fontStyle: "italic",
                  color: globalTheme.token.colorPrimary
                }}>
                  {totalMoney + " VNĐ"}
                </span>
              </Typography>
              <div style={{flex: 1}}></div>
              <Button 
                style={{marginRight: '0.5rem'}} 
                size="middle" 
                disabled={expensesData.length === 0}
              >
                <>
                  <FileAddOutlined size={500} style={{marginRight: '0.2rem'}} />
                  Tạo hóa đơn
                </>
              </Button>
              <Button 
                size="middle" 
                type="primary" 
                disabled={expensesData.length === 0}
                onClick={() => updateExpensesLocation()}
              >
                <>
                  <FileProtectOutlined size={500} style={{marginRight: '0.2rem'}} />
                  Nộp chi phí
                </>
              </Button>
              
            </Flex>
          }
        >
          <Typography style={{marginBottom: '0.2rem', color: '#de4614'}}>Kiểm tra kỹ càng các chi phí phía dưới:</Typography>
          <BaseTable
            columns={expenseLocationColumns}
            data={expensesData}
            editable={true}
            onClickRow={(data: ExpenseLocationDataType) => {
              let index = expensesData.findIndex((e) => e.expenseCode === data.expenseCode)
              setSelectedExpenseData({...data, index});
              showDrawer();
            }}
          />
        </Card>
      </Flex>

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
            <Button onClick={onEditedSelectExpense} type="primary">Xác nhận chỉnh sửa</Button>
          </Space>
        }
        destroyOnClose={true}
      >
        <Form layout="vertical">
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item label={<span><ControlOutlined style={{marginRight: '0.2rem'}}/>Số cũ</span>} required={true}>
                <InputNumber
                    style={{width: '100%'}}
                    addonAfter={selectedExpense?.unitName || "Kw/h"}
                    value={Number(selectedExpense?.initialUnit || 0)}
                    placeholder="Enter service price here"                  
                    onChange={(e) => {
                      debounce(setSelectedExpenseData({ ...selectedExpense, initialUnit: e }), 1000)
                    }}
                  />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label={<span><ControlOutlined style={{marginRight: '0.2rem'}}/>Số mới</span>} required={true}>
                <InputNumber
                    style={{width: '100%'}}
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
              <Form.Item label={<span><MoneyCollectOutlined size={100} style={{marginRight: '0.2rem'}}/>Giá tiền</span>} required={true}>
                <InputNumber
                    style={{ width: "100%" }}
                    addonAfter={"VNĐ"}
                    disabled={true}
                    formatter={(e) => formatMoney(e)}
                    value={Number(selectedExpense?.price || 0)}
                    onChange={(e) => {debounce(setSelectedExpenseData({...selectedExpense, price: e.toString()}), 1000)}}
                    placeholder="Enter service price here"
                  />
              </Form.Item>
            </Col>
          </Row>
            <Row>
              <Col span={6}>
                <Form.Item label={<span><FileImageOutlined style={{marginRight: '0.2rem'}} />Ảnh công tơ</span>} >
                  <Upload 
                    accept="image/png, image/jpeg" 
                    name="files"
                    listType="picture-card"
                    style={{width: '150px'}}
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
                <Form.Item label={<span><SlidersOutlined style={{marginRight: '0.2rem'}}/>Thông số</span>}> 
                  {processedData ? (
                      <Card title="Processed Image Data" style={{ marginTop: "1rem" }}>
                        <pre>{JSON.stringify(processedData, null, 2)}</pre>
                      </Card>
                    ) : <Card><Empty/></Card>}
                </Form.Item>


              </Col>
            </Row>
        </Form>
              
             
      </Drawer>
    </>
  );
};

export default InvoicePage;
