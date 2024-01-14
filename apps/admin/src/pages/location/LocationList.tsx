import { Button, Empty, Flex, Image, Input, Pagination } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useContext, useEffect, useState } from "react";
import { ServiceClient } from "../../lib/clients";
import Typography from "antd/es/typography/Typography";
import { SettingOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { GlobalContext, PathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { useNavigate } from "react-router-dom";
import { ACTION_ENUM } from "../../lib/constants";
import { IPagination, LocationDataType, PaginatedResponse } from "../../lib/interface";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({});
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });

  const { serviceClient } = useContext(GlobalContext);
  const { setPathFromKey } = useContext(PathContext);
  const navigate = useNavigate();

  const openLocationForm = (id?: string) => {
    const [detailFormPage] = MENU_LIST.filter((i) => i.text == "Location Detail");

    setPathFromKey(detailFormPage.key);

    if (id) navigate(DASHBOARD_ROUTES.LOCATION_DETAIL + `?id=${id}`);
    else {
      navigate(DASHBOARD_ROUTES.LOCATION_DETAIL);
    }
  };

  // ON MOUNTED
  useEffect(() => {
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
    serviceClient
      .get(`/location?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<LocationDataType>) => {
        setLocations(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
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
          <Button type="primary" size="large" onClick={(e) => openLocationForm()}>
            <HomeOutlined /> Add
          </Button>
        </Flex>
        <Flex wrap="wrap" gap="small" style={{ width: "100%", justifyContent: "space-between" }}>
          {locations.length > 0 ? (
            locations.map((l) => (
              <Card
                key={l.locationCode}
                hoverable
                style={{ width: 300 }}
                cover={<img alt="example" height={200} src={`${l.image}`} />}
                actions={[
                  <EditOutlined
                    key="edit"
                    title="Edit this location!"
                    className="override-antd-icon-item"
                    onClick={() => openLocationForm(l.locationCode)}
                  />,
                  <SettingOutlined
                    key="setting"
                    className="override-antd-icon-item"
                    title="Other action for this location!"
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
