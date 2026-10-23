import { Link, useRouteError } from "react-router-dom";
import { Card, Typography } from "antd";

export default function Error404Page() {
  const error = useRouteError();
  console.error(error);

  return (
    <main className="admin-error-page">
      <Card className="admin-error-card">
        <Typography.Title level={3}>Page not found</Typography.Title>
        <Link className="admin-error-home" to="/">
          Home
        </Link>
      </Card>
    </main>
  );
}
