import {
  UserAddOutlined,
  ReloadOutlined,
  UserOutlined,
  ArrowRightOutlined,
  EuroCircleOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Card, Flex, Form, Input, InputProps, List, Radio, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  ExpenseDataType,
  ExpenseLocationDataType,
  InvoiceDataType,
  LocationDataType,
  PaginatedResponse,
  ProviderDataType,
  TenantDataType,
} from "../../lib/interface";
import { getGlobalContext } from "../../lib/context";
import { formatMoney } from "../../lib/utils";

const InvoicePage: React.FunctionComponent = () => {
  const [tenantData, setTenantData] = useState<TenantDataType>({});
  const [locationData, setLocationData] = useState<Partial<LocationDataType>>({});
  const [ownerData, setOwnerData] = useState<Partial<ProviderDataType>>({});
  const [expensesData, setExpensesData] = useState<ExpenseLocationDataType[]>([]);

  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const { serviceClient } = getGlobalContext();

  console.log(expensesData);

  const loadAllData = async (tenantCode: number) => {
    try {
      const { data: i } = await serviceClient.get<InvoiceDataType>(`/invoices/${tenantCode}`);

      setTenantData(i.tenant);
      if (i.location) setLocationData(i.location);
      if (Array.isArray(i.location.expenses)) setExpensesData(i.location.expenses);
      if (i.owner) setOwnerData(i.owner);

      // Get Location
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = () => {
    serviceClient
      .get(`/tenant`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<TenantDataType>) => {
        setTenants(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Card style={{ padding: "0.25rem" }}>
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

      <Card
        title={
          <Flex style={{ alignItems: "center" }}>
            <Flex style={{ alignItems: "center", paddingLeft: "2.5rem", marginRight: "2rem", width: "33%" }}>
              <Typography style={{ marginRight: "1.5rem" }}>
                <UserOutlined style={{ marginRight: "0.5rem" }} />
                Người thuê nhà
              </Typography>
              <Select
                showSearch
                placeholder="Choose a Tenant"
                value={tenantData.tenantCode}
                onChange={async (e) => await loadAllData(e)}
                style={{ width: "300px" }}
              >
                {tenants.map((p) => (
                  <Select.Option key={p.tenantCode} value={p.tenantCode}>
                    {p.tenantName}
                  </Select.Option>
                ))}
              </Select>
            </Flex>

            <ArrowRightOutlined style={{ marginRight: "2rem" }} />

            <Flex style={{ alignItems: "center", marginRight: "2rem", width: "33%" }}>
              <Typography style={{ marginRight: "1.5rem" }}>
                <HomeOutlined style={{ marginRight: "0.5rem" }} />
                Phòng trọ
              </Typography>
              <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.locationName} />
            </Flex>

            <ArrowRightOutlined style={{ marginRight: "2rem" }} />

            <Flex style={{ alignItems: "center", width: "33%" }}>
              <Typography style={{ marginRight: "1.5rem" }}>
                <IdcardOutlined style={{ marginRight: "0.5rem" }} />
                Chủ trọ
              </Typography>
              <Input disabled={true} style={{ fontWeight: "bold" }} value={ownerData.providerName} />
            </Flex>
          </Flex>
        }
      >
        <Flex>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Mã chủ trọ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.tenantCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Tên chủ trọ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.tenantName} placeholder="Tên chủ trọ" />
              </Form.Item>

              <Form.Item label="Email">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.email} placeholder="Valid email" />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.phoneNumber} placeholder="Số điện thoại" />
              </Form.Item>
              <Form.Item label="Địa chỉ tạm trú">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.contactAddress} placeholder="Contact address" />
              </Form.Item>
              <Form.Item label="Ngày sinh">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={tenantData.dateOfBirth} placeholder="Ngày sinh" />
              </Form.Item>

              <Form.Item label="Giới tính">
                <Radio.Group value={tenantData.gender} disabled={true}>
                  <Radio value={0}> Nam </Radio>
                  <Radio value={1}> Nữ </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Mã phòng trọ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.locationCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Địa chỉ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.locationAddress} placeholder="Tên chủ trọ" />
              </Form.Item>
              <Form.Item label="Số người">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={locationData.roomSize} placeholder="Room size" />
              </Form.Item>
            </Form>
          </div>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Mã chủ trọ">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={ownerData.providerCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input disabled={true} style={{ fontWeight: "bold" }} value={ownerData.phoneNumber} placeholder="Contact Số điện thoại" />
              </Form.Item>
            </Form>
          </div>
        </Flex>
      </Card>
      <Flex style={{ width: "90%", alignItems: "center", gap: "1rem" }}>
        <Card
          style={{ width: "30%" }}
          title={
            <div>
              <Typography style={{ marginRight: "1rem", fontSize: "16px" }}>
                <EuroCircleOutlined style={{ marginRight: "0.5rem" }} />
                Tổng chi phí:{" "}
                {formatMoney(
                  expensesData.reduce<number>((acc, prev) => {
                    return acc + +prev.price;
                  }, 0)
                ) + " VND"}
              </Typography>
            </div>
          }
        ></Card>
        <Card style={{ width: "70%" }}>
          <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal"></Form>
        </Card>
      </Flex>
    </>
  );
};

export default InvoicePage;
