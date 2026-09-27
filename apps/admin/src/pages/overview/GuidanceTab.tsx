import { BookOutlined, HomeOutlined } from "@ant-design/icons";
import { Divider, List, Typography } from "antd";
import Card from "antd/es/card/Card";

const GuidanceTab = () => {
  const data = [
    "Bước 1: Tạo phòng trọ mới trong mục Phòng trọ.",
    "Bước 2: Thêm chủ trọ mới. Điền thông tin cơ bản và các phòng trọ đang cho thuê.",
    "Bước 3: Mỗi khi có người thuê mới, hãy thêm thông tin của họ trong mục Người thuê.",
    "Bước 4: Bạn có thể thêm các chi phí dịch vụ để tính vào hóa đơn của người thuê.",
    "Bước 5: Trong mục Hóa đơn, bạn có thể tạo hóa đơn cho người thuê dựa trên các chi phí đã được gán cho phòng trọ.",
    "Bước 6: Trong mục Lịch thông báo, bạn có thể tạo lịch gửi email để trao đổi với người thuê hoặc chủ trọ.",
  ];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "1rem",
        width: "100%",
      }}
    >
      <Card
        style={{
          flex: "1 1 420px",
          maxWidth: "100%",
          minWidth: 0,
        }}
        title={
          <>
            <HomeOutlined className="override-antd-icon-item" /> Cách quản lý
            bảng điều khiển
          </>
        }
      >
        <List
          style={{ width: "100%" }}
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
        style={{
          flex: "1 1 240px",
          maxWidth: "100%",
          minWidth: 0,
        }}
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
