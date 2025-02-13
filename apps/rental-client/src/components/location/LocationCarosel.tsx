import { Carousel, Card, Typography } from "antd";
import "./LocationCarosel.css";

const { Title, Text } = Typography;

const LocationCarousel = ({ locations }) => {
  return (
    <Carousel autoplay className="carousel">
      {locations.length > 0 ? (
        locations.map((location) => (
          <Card key={location.locationCode} className="carousel-card" cover={<img alt={location.locationName} src={location.image} />}>
            <Title level={4} className="carousel-title" style={{color: 'fff'}}>{location.locationName}</Title>
            <Text className="carousel-text">{location.locationAddress}</Text> <br/>
            <Text className="carousel-text">Room Size: {location.roomSize} sqm</Text> <br/>
          </Card>
        ))
      ) : (
        <Text className="carousel-empty">No highlighted properties available</Text>
      )}
    </Carousel>
  );
};

export default LocationCarousel;
