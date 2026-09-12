import { Button, Carousel, Divider, Empty, Flex, Input, Pagination, Rate, Skeleton, Tag } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useContext, useEffect, useState } from "react";
import Typography from "antd/es/typography/Typography";
import {
  SettingOutlined,
  EditOutlined,
  HomeOutlined,
  ReloadOutlined,
  DeleteOutlined,
  NotificationOutlined,
  NotificationFilled,
  EditFilled,
  DeleteFilled,
  BellFilled,
  DotChartOutlined,
  MoreOutlined,
  SettingFilled,
} from "@ant-design/icons";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { GlobalContext, PathContext, getGlobalContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { useNavigate } from "react-router-dom";
import { ExpenseDataType, IPagination, LocationDataType, PaginatedResponse } from "../../lib/interface";
import SkeletonImage from "antd/es/skeleton/Image";

const LocationList = () => {
  const [locations, setLocations] = useState<LocationDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });
  const { serviceClient, useToast, useConfirm } = getGlobalContext();
  const { setPathFromKey } = useContext(PathContext);
  const navigate = useNavigate();

  const getConstantExpensePrice = (location: LocationDataType) => {
    const prices = (location.expenses ?? [])
      .filter((expense) => String(expense.type) === "constant")
      .map((expense) => Number(expense.price))
      .filter((price) => Number.isFinite(price));

    return prices.length > 0 ? Math.max(...prices) : undefined;
  };

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const openLocationForm = (id?: string) => {
    // const [detailFormPage] = MENU_LIST.filter((i) => i.text == "Location Detail");

    // setPathFromKey(detailFormPage.key);

    if (id) navigate(DASHBOARD_ROUTES.LOCATION_DETAIL + `?id=${id}`);
    else {
      navigate(DASHBOARD_ROUTES.LOCATION_DETAIL);
    }
  };

  const deleteDataHandler = async (data: LocationDataType) => {
    serviceClient
      .delete(`/location/${data.locationCode}`)
      .then(() => {
        useToast("success", "Xóa phòng trọ thành công");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Xóa phòng trọ thất bại");
      });
  };

  const loadData = () => {
    serviceClient
      .get(`/location?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLoadingSekeleton();
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // ON MOUNTED
  useEffect(() => {
    setLoadingSekeleton();

    serviceClient
      .get(`/location?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data);
        setPagination({ total: response.total, page: response.page, size: response.size });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // ON UPDATED
  useEffect(() => {
    loadData();
  }, [pagination]);

  return (
    <>
      <Card style={{ padding: "0.25rem" }}>
        <Flex style={{ alignItems: "center" }}>
          <div>
            <h2>Phòng trọ</h2>
            <Typography>
              - Nơi dành cho <b>người thuê nhà</b> từ <b>Chủ sở hữu thuê nhà</b>
            </Typography>
          </div>
          <div style={{ flex: 1 }}></div>
          <Input placeholder="Nhập nội dung tìm kiếm" style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }} />
          <Button type="primary" style={{ marginRight: "1rem" }} size="middle" onClick={(e) => openLocationForm()}>
            <HomeOutlined /> Thêm
          </Button>

          <Button size="middle" onClick={() => loadData()}>
            <ReloadOutlined />
          </Button>
        </Flex>

        <Divider />

        <Flex style={{ width: "100%" }}>
          {isLoading ? (
            <>
              <Card style={{ width: 300 }} cover={<SkeletonImage />}>
                <Skeleton active loading />
              </Card>
              <Card style={{ width: 300 }} cover={<SkeletonImage />}>
                <Skeleton active loading />
              </Card>
              <Card style={{ width: 300 }} cover={<SkeletonImage />}>
                <Skeleton active loading />
              </Card>
              <Card style={{ width: 300 }} cover={<SkeletonImage />}>
                <Skeleton active loading />
              </Card>
              <Card style={{ width: 300 }} cover={<SkeletonImage />}>
                <Skeleton active loading />
              </Card>
            </>
          ) : locations.length > 0 ? (
            locations.map((l) => (
              <Card
                key={l.locationCode}
                hoverable
                style={{ width: 400, marginRight: "0.5rem" }}
                cover={
                  l.image ? (
                    <img
                      alt={l.locationName}
                      src={l.image}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{ aspectRatio: "1 / 1", display: "grid", placeItems: "center" }}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                  )
                }
                actions={[
                  <BellFilled />,
                  <EditFilled
                    value="Chinh sua"
                    key="edit"
                    title="Chỉnh sửa phòng trọ"
                    className="override-antd-icon-item"
                    onClick={() => openLocationForm(l.locationCode)}
                  />,
                  <DeleteFilled
                    size={300}
                    key="delete"
                    className="override-antd-icon-item"
                        title="Xóa phòng trọ"
                    onClick={() => {
                      useConfirm(
                        "warning",
                        "Xóa phòng trọ",
                        `Bạn có muốn xóa phòng trọ ${l.locationCode} không?`,
                        async () => await deleteDataHandler(l)
                      );
                    }}
                  />,
                  <SettingFilled />,
                ]}
              >
                <Meta
                  title={l.locationCode + ": " + l.locationName}
                  description={
                    <>
                      <Tag color="blue">{l.roomSize} người </Tag>
                      <Tag color="success">
                        Giá phòng : {getConstantExpensePrice(l)?.toLocaleString("vi-VN") ?? "-"} VND
                      </Tag>
                      <Tag
                        color="warning"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {l.locationAddress}
                      </Tag>
                      <Rate tooltips={["khủng khiếp", "xấu", "bình thường", "tốt", "tuyệt vời"]} value={Math.random() * 4} />
                    </>
                  }
                />
              </Card>
            ))
          ) : (
            <>
              <Card style={{ width: "100%" }}>
                <Empty />
              </Card>
            </>
          )}
        </Flex>
        <Pagination
          current={pagination.page}
          total={pagination.total}
          pageSize={pagination.size}
          pageSizeOptions={[10]}
          onChange={(page, size) => {
            setPagination({ ...pagination, page, size });
          }}
          style={{ marginTop: "1.5rem" }}
        />
      </Card>
    </>
  );
};

export default LocationList;
