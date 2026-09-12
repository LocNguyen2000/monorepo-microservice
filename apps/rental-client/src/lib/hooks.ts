import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ScreenRoutes } from "../lib/constant";
import { getGlobalContext } from "../lib/context";

const useAuthCheck = () => {
  const router = useRouter();
  useEffect(() => {
    const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
    const token = authUser?.accessToken;

    if (token) {
        router.push(ScreenRoutes.Home);
    }

  }, [router]);

};

const useSyncAuthUser = () => {
  const { authUser, setAuthUser } = getGlobalContext();

  useEffect(() => {
    if (!authUser) {
      const prevUser = localStorage.getItem("authUser");

      console.log('PREV', prevUser);
      
      if (prevUser) {
        try {
          setAuthUser(JSON.parse(prevUser)); // Set authUser from localStorage
        } catch (error) {
          console.error("Error parsing authUser from localStorage:", error);
          localStorage.removeItem("authUser"); // Remove corrupted data
        }
      }
    }
  }, [authUser, setAuthUser]); // Runs once on mount or when authUser changes
  return {authUser}
};

export {useSyncAuthUser, useAuthCheck};

