import {
  BookOutlined,
  EuroOutlined,
  HomeOutlined,
  IdcardOutlined,
  MoneyCollectOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Divider, Tooltip, Typography } from "antd";
import Card from "antd/es/card/Card";
import { Link } from "react-router-dom";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { getPathContext } from "../../lib/context";

const processSteps = [
  {
    key: "4",
    route: DASHBOARD_ROUTES.LOCATION,
    title: "Phòng trọ",
    description: "Tạo phòng trọ và thông tin địa điểm.",
    icon: <HomeOutlined />,
  },
  {
    key: "2",
    route: DASHBOARD_ROUTES.PROVIDER,
    title: "Chủ trọ",
    description: "Quản lý chủ sở hữu và liên kết với phòng trọ.",
    icon: <IdcardOutlined />,
  },
  {
    key: "1",
    route: DASHBOARD_ROUTES.TENANT,
    title: "Người thuê",
    description: "Thêm người thuê và gắn với phòng phù hợp.",
    icon: <UserOutlined />,
  },
  {
    key: "5",
    route: DASHBOARD_ROUTES.EXPENSE,
    title: "Chi phí",
    description: "Khai báo các khoản chi phí của phòng trọ.",
    icon: <EuroOutlined />,
  },
  {
    key: "8",
    route: DASHBOARD_ROUTES.INVOICE,
    title: "Hóa đơn",
    description: "Lập và theo dõi hóa đơn từ các khoản chi phí.",
    icon: <MoneyCollectOutlined />,
  },
  {
    key: "6",
    route: DASHBOARD_ROUTES.SCHEDULE,
    title: "Lịch thông báo",
    description: "Thiết lập lịch gửi email nhắc việc.",
    icon: <ScheduleOutlined />,
  },
];

const GuidanceTab = () => {
  const { setPathFromKey } = getPathContext();

  return (
    <div className="guidance-tab-layout">
      <Card
        className="guidance-process-card"
        title={
          <Typography.Text strong>
            <HomeOutlined className="override-antd-icon-item" /> Quy trình quản lý
            nhà trọ
          </Typography.Text>
        }
      >
        <Typography.Paragraph
          type="secondary"
          className="guidance-process-intro"
        >
          Từ thiết lập phòng trọ đến quản lý hóa đơn và lịch thông báo.
        </Typography.Paragraph>
        <ol className="guidance-process-flow">
          {processSteps.map((step, index) => (
            <li className="guidance-process-step" key={step.route}>
              <Tooltip title={step.description} mouseEnterDelay={0.15}>
                <Link
                  className="guidance-process-link"
                  to={step.route}
                  aria-label={`${step.title}: ${step.description}`}
                  onClick={(event) => {
                    if (
                      event.button !== 0 ||
                      event.metaKey ||
                      event.ctrlKey ||
                      event.shiftKey ||
                      event.altKey
                    ) {
                      return;
                    }
                    event.preventDefault();
                    setPathFromKey(step.key);
                  }}
                >
                  <span className="guidance-process-icon" aria-hidden="true">
                    {step.icon}
                  </span>
                  <Typography.Text strong className="guidance-process-title">
                    {step.title}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    className="guidance-process-description"
                  >
                    {step.description}
                  </Typography.Text>
                  <span className="sr-only">Bước {index + 1}</span>
                </Link>
              </Tooltip>
            </li>
          ))}
        </ol>
      </Card>
      <Card
        className="guidance-concepts-card"
        title={
          <Typography>
            <BookOutlined className="override-antd-icon-item" /> Khái niệm cơ bản
          </Typography>
        }
      >
        <div>
          <Typography>Phòng trọ</Typography>
          <Divider />
          <Typography>Chủ trọ</Typography>
          <Divider />
          <Typography>Người thuê</Typography>
          <Divider />
          <Typography>Chi phí / Hóa đơn</Typography>
        </div>
      </Card>
    </div>
  );
};

export default GuidanceTab;
