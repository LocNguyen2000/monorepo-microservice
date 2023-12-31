import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { Row, Col, Card, Button, Statistic, Divider } from "antd";

const OverviewPage = () => {
  return (
    <>
      <Row gutter={16} style={{ marginBottom: "0.5rem" }}>
        <Col span={12} style={{}}>
          <Card>
            <Statistic title="Active Users" value={112893} />
            <Divider />
            <Statistic
              title="Account Balance (CNY)"
              value={112893}
              precision={2}
            />
            <Button style={{ marginTop: 16 }} type="primary">
              Recharge
            </Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card bordered={false}>
            <Statistic
              title="Active"
              value={11.28}
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
            <Divider />

            <Statistic
              title="Idle"
              value={9.3}
              precision={2}
              valueStyle={{ color: "#cf1322" }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* <Row gutter={16}>
        <Col span={12}></Col>
        <Col span={12}></Col>
      </Row> */}
    </>
  );
};

export default OverviewPage;
