import { ColumnsType } from "antd/es/table";
import { TenantDataType, ProviderDataType } from "../interface";

export const tenantColumns: ColumnsType<TenantDataType> = [
  {
    title: "Tenant Code",
    dataIndex: "tenantCode",
    key: "tenantCode",
    fixed: "left",
  },
  {
    title: "Tenant Name",
    dataIndex: "tenantName",
    key: "tenantName",
    fixed: "left",
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Contact Address",
    dataIndex: "contactAddress",
    key: "contactAddress",
  },
  {
    title: "Roomate Count",
    dataIndex: "roomateCount",
    key: "roomateCount",
  },
];

export const providerColumns: ColumnsType<ProviderDataType> = [
  {
    title: "Provider Code",
    dataIndex: "providerCode",
    key: "providerCode",
    align: "center",
  },
  {
    title: "Provider Name",
    dataIndex: "providerName",
    key: "providerName",
  },
  {
    title: "Job Title",
    dataIndex: "role",
    key: "role",
    align: "center",
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    align: "center",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "left",
  },
  {
    title: "Address",
    dataIndex: "contactAdress",
    key: "contactAdress",
    align: "left",
  },
  {
    title: "Room Size",
    dataIndex: "roomSize",
    key: "roomSize",
    align: "center",
  },
];
