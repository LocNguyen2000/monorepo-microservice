import { Button, Empty, Flex, Image, Input, Pagination } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useContext, useEffect, useState } from "react";
import { ServiceClient } from "../../lib/clients";
import Typography from "antd/es/typography/Typography";
import { SettingOutlined, EditOutlined, HomeOutlined } from "@ant-design/icons";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { PathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { useNavigate } from "react-router-dom";
import { ACTION_ENUM } from "../../lib/constants";

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({});
  const serviceClient = ServiceClient();
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

  useEffect(() => {
    serviceClient
      .get("/location")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <>
      <Card>
        <Flex
          style={{
            display: "flex",
            justifyContent: "flex-start",
            margin: "0.25rem",
            alignItems: "center",
          }}
        >
          <Pagination current={1} total={locations.length} pageSize={10} style={{ marginRight: "2rem" }} />
          <Input
            placeholder="Enter search value here"
            style={{ width: "20rem", height: "2.5rem", marginRight: "2rem" }}
          />
          <Button type="primary" size="large" onClick={(e) => openLocationForm()}>
            <HomeOutlined /> Add
          </Button>
        </Flex>
      </Card>
      <Flex wrap="wrap" gap="small" style={{ justifyContent: "center" }}>
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
                  onClick={() => openLocationForm(l.locationCode)}
                />,
                <SettingOutlined key="setting" title="Other action for this location!" />,
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
    </>
  );
};

export default LocationList;
