import { Card, Typography, Button, Row, Col } from "antd";
import "./LocationListing.css";

const { Title, Text } = Typography;

const LocationList = ({ locations }) => {
  return (
    <div className="property-list">
      <div style={{fontSize: 20, marginBottom: '0.6rem'}}>Địa điểm thuê nhà</div>
      <Row gutter={[16, 16]}>
        {locations.length > 0 ? (
          locations.map((location) => (
            <Col key={location.locationCode} span={8}>
              <Card className="property-card" cover={<img alt={location.locationName} src={location.image} />}>
                <Title level={4} className="property-title">{location.locationName}</Title>
                <Text className="property-text">{location.locationAddress}</Text> <br/>
                <Text className="property-text">Room Size: {location.roomSize} sqm</Text> <br/>
                <Button type="primary">View Details</Button>
              </Card>
            </Col>
          ))
        ) : (
          <Text className="property-empty">No locations available</Text>
        )}
      </Row>
    </div>
  );
};

export default LocationList;
