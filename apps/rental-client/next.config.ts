import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ADMIN_AUTH_RENTAL_CLIENTID: process.env.ADMIN_AUTH_RENTAL_CLIENTID,
    ADMIN_ENDPOINTS_ACCOUNT: process.env.ADMIN_ENDPOINTS_ACCOUNT,
    ADMIN_ENDPOINTS_SERVICE: process.env.ADMIN_ENDPOINTS_SERVICE,
  },
};

export default nextConfig;