import {
  UserAddOutlined,
  ReloadOutlined,
  UserOutlined,
  ArrowRightOutlined,
  EuroCircleOutlined,
  HomeOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Button, Card, Divider, Flex, Form, Input, List, Progress, Radio, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  ExpenseDataType,
  LocationDataType,
  PaginatedResponse,
  ProviderDataType,
  TenantDataType,
} from "../../lib/interface";
import { getGlobalContext } from "../../lib/context";

const InvoicePage: React.FunctionComponent = () => {
  const [tenantData, setTenantData] = useState<TenantDataType>({});
  const [locationData, setLocationData] = useState<Partial<LocationDataType>>({});
  const [ownerData, setOwnerData] = useState<Partial<ProviderDataType>>({});
  const [expensesData, setExpensesData] = useState<ExpenseDataType[]>([]);

  const [tenants, setTenants] = useState<TenantDataType[]>([]);
  const { serviceClient } = getGlobalContext();

  const loadAllData = async (tenantCode: number) => {
    try {
      // Get tenant data
      const { data: t } = await serviceClient.get<TenantDataType>(`/tenant/${tenantCode}`);
      const { data: l } = await serviceClient.get<LocationDataType & { expenses: ExpenseDataType[] }>(
        `/location/${t.locationCode}`
      );
      const { data: o } = await serviceClient.get<ProviderDataType>(`/rent-provider/${l.owner}`);

      setTenantData(t);
      setLocationData(l);
      setOwnerData(o);
      setExpensesData(l.expenses);

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

  useEffect(() => {});

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
              - Summarize all invoices, generate an invoice for a tenant (Require information from location, expense,
              rent owners)
            </Typography>
          </div>
          <div style={{ flex: 1 }}></div>
        </Flex>
      </Card>

      <Card
        title={
          <Flex style={{ alignItems: "center" }}>
            <Flex style={{ alignItems: "center", marginRight: "2rem", width: "33%" }}>
              <Typography style={{ marginRight: "1.5rem" }}>
                <UserOutlined style={{ marginRight: "0.5rem" }} />
                Tenant
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
                Location
              </Typography>
              <Input disabled={true} placeholder="Tenant Location" value={locationData.locationName} />
            </Flex>

            <ArrowRightOutlined style={{ marginRight: "2rem" }} />

            <Flex style={{ alignItems: "center", width: "33%" }}>
              <Typography style={{ marginRight: "1.5rem" }}>
                <IdcardOutlined style={{ marginRight: "0.5rem" }} />
                Rent Owner
              </Typography>
              <Input disabled={true} placeholder="Location Owner" value={ownerData.providerName} />
            </Flex>
          </Flex>
        }
      >
        <Flex>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Tenant Code">
                <Input disabled={true} value={tenantData.tenantCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Tenant Name">
                <Input disabled={true} value={tenantData.tenantName} placeholder="Tenant name" />
              </Form.Item>

              <Form.Item label="Email">
                <Input disabled={true} value={tenantData.email} placeholder="Valid email" />
              </Form.Item>
              <Form.Item label="Phone number">
                <Input disabled={true} value={tenantData.phoneNumber} placeholder="Phone number" />
              </Form.Item>
              <Form.Item label="Contact Address">
                <Input disabled={true} value={tenantData.contactAddress} placeholder="Contact address" />
              </Form.Item>
              <Form.Item label="Date of Birth">
                <Input disabled={true} value={tenantData.dateOfBirth?.toDateString()} placeholder="Date of birth" />
              </Form.Item>

              <Form.Item label="Gender">
                <Radio.Group value={tenantData.gender} disabled={true}>
                  <Radio value={0}> Male </Radio>
                  <Radio value={1}> Female </Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Location Code">
                <Input disabled={true} value={locationData.locationCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Address">
                <Input disabled={true} value={locationData.locationAddress} placeholder="Tenant name" />
              </Form.Item>
              <Form.Item label="Max room">
                <Input disabled={true} value={locationData.roomSize} placeholder="Room size" />
              </Form.Item>
            </Form>
          </div>
          <div style={{ width: "33%" }}>
            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
              <Form.Item label="Owner Code">
                <Input disabled={true} value={ownerData.providerCode} placeholder="Code number" />
              </Form.Item>
              <Form.Item label="Phone number">
                <Input disabled={true} value={ownerData.phoneNumber} placeholder="Contact phone number" />
              </Form.Item>
            </Form>
          </div>
        </Flex>
      </Card>
      <Card
        title={
          <Flex style={{ alignItems: "center" }}>
            <Typography style={{ marginRight: "1rem" }}>
              <EuroCircleOutlined style={{ marginRight: "0.5rem" }} />
              Expense
            </Typography>
            <Typography>
              [Total] :{" "}
              {expensesData.reduce((acc, prev) => {
                return acc + +prev.price;
              }, 0)}{" "}
              VND
            </Typography>
          </Flex>
        }
      >
        <List
          bordered
          dataSource={expensesData}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>[{item.type}]</Typography.Text> {item.price} VND
            </List.Item>
          )}
        />
      </Card>
    </>
  );
};

export default InvoicePage;
