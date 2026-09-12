import { FunctionComponent } from "react";
import { getGlobalContext } from "../../lib/context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ScreenRoutes } from "../../lib/constant";
import { useSyncAuthUser } from "../../lib/hooks";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const router = useRouter();
  const { authUser, setAuthUser } = getGlobalContext();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("authUser");
    if (!storedUser) {
      router.replace(ScreenRoutes.Login);
      return;
    }

    try {
      setAuthUser(JSON.parse(storedUser));
      setChecked(true);
    } catch {
      localStorage.removeItem("authUser");
      router.replace(ScreenRoutes.Login);
    }
  }, [router, setAuthUser]);

  if (!checked || !authUser) {
    return null;
  }

  return children;
};
