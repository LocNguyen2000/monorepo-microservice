import { FunctionComponent, useContext } from "react";
import { GlobalContext, getGlobalContext } from "../lib/context";
import { Navigate, useLocation } from "react-router-dom";
import { ADMIN_ROLES, UserRole } from "../lib/constants/roles";
import { DASHBOARD_ROUTES } from "../lib/constants/routes";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser } = getGlobalContext();
  const location = useLocation();

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  if (
    Number(authUser.role) === UserRole.LocationOperator &&
    location.pathname !== DASHBOARD_ROUTES.METER_READING
  ) {
    return <Navigate to={DASHBOARD_ROUTES.METER_READING} replace />;
  }

  return children;
};

export const AdminOnlyRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser } = getGlobalContext();

  if (!authUser || !ADMIN_ROLES.includes(Number(authUser.role))) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};

export const LocationOperatorRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser } = getGlobalContext();

  if (!authUser || Number(authUser.role) !== UserRole.LocationOperator) {
    return <Navigate to={DASHBOARD_ROUTES.OVERVIEW} replace />;
  }

  return children;
};
