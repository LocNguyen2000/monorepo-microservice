import { Line } from "@ant-design/charts";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Row, Col, Card, Statistic, Table } from "antd";
import { ColumnsType } from "antd/es/table";

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

const AnalysistTab = () => {
  const data = [
    { year: "1991", value: 3 },
    { year: "1992", value: 4 },
    { year: "1993", value: 3.5 },
    { year: "1994", value: 5 },
    { year: "1995", value: 4.9 },
    { year: "1996", value: 6 },
    { year: "1997", value: 7 },
    { year: "1998", value: 9 },
    { year: "1999", value: 13 },
  ];
  const config = {
    data,
    height: 400,
    xField: "year",
    yField: "value",
    point: {
      size: 5,
      shape: "circule",
    },
    tooltip: {
      // formatter: (data) => {
      //   return {
      //     name: "",
      //     value: any,
      //   };
      // },
      customContent: (name, data) =>
        `<div>${data?.map((item) => {
          return `<div class="tooltip-chart" >
                <span class="tooltip-item-name">${item?.name}</span>
                <span class="tooltip-item-value">${item?.value}</span>
              </div>`;
        })}</div>`,
      showMarkers: true,
      showContent: true,
      position: "right",
      showCrosshairs: true,
    },
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
    },
  ];

  const tableData: DataType[] = [];
  for (let i = 0; i < 10; i++) {
    tableData.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }
  return (
    <>
      <Row gutter={[16, 8]} style={{ marginBottom: "0.5rem" }}>
        <Col span={8}>
          <Card title="Locations status">
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Statistic
                title="Active Locations"
                value={107}
                valueStyle={{ textAlign: "center" }}
              />
              <Statistic
                title="Idle Locations"
                value={23}
                valueStyle={{ textAlign: "center" }}
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Rent Providers status">
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Statistic
                title="Total Rent Providers"
                value={1000}
                valueStyle={{ textAlign: "center" }}
              />

              <Statistic
                title="Providers Active"
                value={20.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />

              <Statistic
                title="Providers Idle"
                value={9.3}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={false} title="Tenants status">
            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
              <Statistic
                title="Total Tenants"
                value={112893}
                valueStyle={{ textAlign: "center" }}
              />

              <Statistic
                title="Tenant Active"
                value={11.28}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<ArrowUpOutlined />}
                suffix="%"
              />

              <Statistic
                title="Tenant Idle"
                value={9.3}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<ArrowDownOutlined />}
                suffix="%"
              />
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false} title="Users increase rate (%)">
            <Line {...config} />
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false} title="Top 10 Best Selling Locations">
            <Table
              columns={columns}
              dataSource={tableData}
              size="small"
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AnalysistTab;
