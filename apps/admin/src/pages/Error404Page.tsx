import { Link, useRouteError } from "react-router-dom";
import { Space } from "antd";
import Card from "antd/es/card/Card";
import Typography from "antd/es/typography/Typography";

export default function Error404Page() {
  const error = useRouteError();
  console.error(error);

  return (
    <Space
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Card>
        <h1>Oops!</h1>
        <Typography>Sorry, an unexpected error has occurred.</Typography>
        <p>
          <Typography
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              marginTop: "1rem",
            }}
          >
            Page not found
          </Typography>
        </p>
        <p style={{ textAlign: "center" }}>
          <Link to="/">Go to Home </Link>
        </p>
      </Card>
    </Space>
  );
}
