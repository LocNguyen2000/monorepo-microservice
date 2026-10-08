import { FunctionComponent } from "react";
import { getGlobalContext } from "../../lib/context";
import { useEffect, useState } from "react";
import { ScreenRoutes } from "../../lib/constant";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser, setAuthUser } = getGlobalContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) {
      window.location.replace(ScreenRoutes.Login);
      return;
    }

    try {
      setAuthUser(JSON.parse(storedUser));
      setChecked(true);
    } catch {
      localStorage.removeItem("authUser");
      window.location.replace(ScreenRoutes.Login);
    }
  }, [setAuthUser]);

  if (!checked || !authUser) {
    return null;
  }

  return children;
};
