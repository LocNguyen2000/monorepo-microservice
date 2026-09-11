import { BookOutlined, HomeOutlined } from "@ant-design/icons";
import { Divider, List, Typography } from "antd";
import Card from "antd/es/card/Card";

const GuidanceTab = () => {
  const data = [
    "Bước 1: Tạo phòng trọ mới trong mục Phòng trọ.",
    "Bước 2: Thêm chủ trọ mới. Điền thông tin cơ bản và các phòng trọ đang cho thuê.",
    "Bước 3: Mỗi khi có người thuê mới, hãy thêm thông tin của họ trong mục Người thuê.",
    "Bước 4: Trong mục Lịch, bạn có thể tạo lịch gửi email để trao đổi với người thuê hoặc chủ trọ.",
    "Bước 5: Kiểm tra tiến độ cho thuê trong mục Tổng quan.",
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        style={{ marginRight: "1rem" }}
        title={
          <>
            <HomeOutlined className="override-antd-icon-item" /> Cách quản lý
            bảng điều khiển
          </>
        }
      >
        <List
          style={{ width: "max-content" }}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Typography.Text>{item}</Typography.Text>
            </List.Item>
          )}
        />
      </Card>
      <Card
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
          <Typography>Tài sản</Typography>
        </div>
      </Card>
    </div>
  );
};

export default GuidanceTab;
