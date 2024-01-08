import { Button, Flex, Image, Input } from "antd";
import Card from "antd/es/card/Card";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { ServiceClient } from "../../lib/clients";
import UserAddOutlined from "@ant-design/icons/lib/icons/UserAddOutlined";
import Typography from "antd/es/typography/Typography";

interface ILocationList {}

const LocationList = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState({});
  const serviceClient = ServiceClient();

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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "0.25rem",
            alignItems: "center",
          }}
        >
          <Input
            placeholder="Enter search value here"
            style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }}
          />
          <Button type="primary" size="large">
            <UserAddOutlined /> Add
          </Button>
        </div>
      </Card>
      <Flex wrap="wrap" gap="small" style={{ justifyContent: "center" }}>
        {locations.map((l) => (
          <Card
            hoverable
            style={{ width: 300 }}
            cover={
              <img alt="example" width={300} height={300} src={`${l.image}`} />
            }
          >
            <Meta
              title={l.locationCode + ": " + l.locationAddress}
              description={
                <>
                  <Typography>Room count: {l.roomCount}</Typography>
                  <Typography>Description: {l.description}</Typography>
                </>
              }
            />
          </Card>
        ))}
      </Flex>
    </>
  );
};

export default LocationList;
