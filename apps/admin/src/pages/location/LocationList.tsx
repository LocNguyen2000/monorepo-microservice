import { Button, Divider, Empty, Flex, Input, Pagination, Skeleton } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useContext, useEffect, useState } from "react";
import Typography from "antd/es/typography/Typography";
import { SettingOutlined, EditOutlined, HomeOutlined, ReloadOutlined, DeleteOutlined } from "@ant-design/icons";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { GlobalContext, PathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { useNavigate } from "react-router-dom";
import { IPagination, LocationDataType, PaginatedResponse } from "../../lib/interface";
import SkeletonImage from "antd/es/skeleton/Image";

const LocationList = () => {
  const [locations, setLocations] = useState<LocationDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });
  const { serviceClient, useToast, useConfirm } = useContext(GlobalContext);
  const { setPathFromKey } = useContext(PathContext);
  const navigate = useNavigate();

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const openLocationForm = (id?: string) => {
    const [detailFormPage] = MENU_LIST.filter((i) => i.text == "Location Detail");

    setPathFromKey(detailFormPage.key);

    if (id) navigate(DASHBOARD_ROUTES.LOCATION_DETAIL + `?id=${id}`);
    else {
      navigate(DASHBOARD_ROUTES.LOCATION_DETAIL);
    }
  };

  const deleteDataHandler = async (data: LocationDataType) => {
    serviceClient
      .delete(`/location/${data.locationCode}`)
      .then(() => {
        useToast("success", "Delete Location successfully");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Delete Location failed");
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
        <Flex
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.size}
            pageSizeOptions={[10]}
            onChange={(page, size) => {
              setPagination({ ...pagination, page, size });
            }}
            style={{ marginRight: "2rem" }}
          />

          <div style={{ flex: 1 }}></div>

          <Input
            placeholder="Enter search value here"
            style={{ width: "20rem", height: "2.5rem", marginRight: "2rem" }}
          />
          <Button type="primary" style={{ marginRight: "1rem" }} size="large" onClick={(e) => openLocationForm()}>
            <HomeOutlined /> Add
          </Button>

          <Button size="large" onClick={() => loadData()}>
            <ReloadOutlined />
          </Button>
        </Flex>

        <Divider />

        <Flex wrap="wrap" gap="small" style={{ width: "100%", justifyContent: "space-between" }}>
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
                style={{ width: 300 }}
                cover={<img alt="example" height={180} src={`${l.image}`} />}
                actions={[
                  <EditOutlined
                    key="edit"
                    title="Edit this location!"
                    className="override-antd-icon-item"
                    onClick={() => openLocationForm(l.locationCode)}
                  />,
                  <DeleteOutlined
                    key="delete"
                    className="override-antd-icon-item"
                    title="Delete this location!"
                    onClick={() => {
                      useConfirm(
                        "warning",
                        "Location Deletion",
                        `Do you want to delete location ${l.locationCode}?`,
                        async () => await deleteDataHandler(l)
                      );
                    }}
                  />,
                ]}
              >
                <Meta
                  title={l.locationCode + ": " + l.locationAddress}
                  description={
                    <>
                      <Typography>Room count: {l.roomCount}</Typography>
                      <Typography
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {l.description}
                      </Typography>
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
      </Card>
    </>
  );
};

export default LocationList;
