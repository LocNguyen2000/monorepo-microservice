import { ColumnsType } from "antd/es/table";
import { TenantDataType, ProviderDataType, ExpenseDataType, ExpenseLocationDataType, ExpenseUnitType } from "../interface";
import { formatMoney } from "../utils";

export const tenantColumns: ColumnsType<TenantDataType> = [
  {
    title: "Mã người thuê",
    dataIndex: "tenantCode",
    key: "tenantCode",
    align: "center",
  },
  {
    title: "Tên người thuê",
    dataIndex: "tenantName",
    key: "tenantName",
    fixed: "left",
  },
  {
    title: "Ngày sinh nhật",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Giới tính",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Địa chỉ tạm trú",
    dataIndex: "contactAddress",
    key: "contactAddress",
  },
];

export const providerColumns: ColumnsType<ProviderDataType> = [
  {
    title: "Mã chủ trọ",
    dataIndex: "providerCode",
    key: "providerCode",
    align: "center",
  },
  {
    title: "Tên chủ trọ",
    dataIndex: "providerName",
    key: "providerName",
  },
  {
    title: "Ngày sinh nhật",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    align: "center",
  },
  {
    title: "Số điện thoại",
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
    title: "Địa chỉ",
    dataIndex: "contactAddress",
    key: "contactAddress",
    align: "left",
  },
];

export const expenseColumns: ColumnsType<ExpenseDataType> = [
  {
    title: "Mã chi phí",
    dataIndex: "expenseCode",
    key: "expenseCode",
    align: "center",
    width: "150px",
  },
  {
    title: "Tên chi phí",
    dataIndex: "expenseName",
    key: "expenseName",
    align: "center",
  },
  {
    title: "Loại chi phí",
    dataIndex: "type",
    key: "type",
    align: "center",
    render: (value) => {
      switch (value){
        case 'per_unit':{
          return ExpenseUnitType.per_unit
        }
        case 'constant': {
          return ExpenseUnitType.constant
        }
        default: {
          return ''
        }
      }
    }
  },
  {
    title: "Giá cả",
    dataIndex: "price",
    key: "price",
    align: "center",
    render: (value) => formatMoney(value),
  },
  {
    title: "Đang sử dụng",
    dataIndex: "inUsed",
    key: "inUsed",
    align: "center",
    render: (value) => (value === true ? "Yes" : "No"),
  },
];

export const expenseLocationColumns: ColumnsType<ExpenseLocationDataType> = [
  {
    title: "Tên chi phí",
    dataIndex: "expenseName",
    key: "expenseName",
    align: "center",
    width: "20%",
  },
  {
    title: "Số cũ",
    dataIndex: "initialUnit",
    key: "initialUnit",
    align: "center",
    width: "15%",
  },
  {
    title: "Số mới",
    dataIndex: "currentUnit",
    key: "currentUnit",
    align: "center",
    width: "15%",
  },
  {
    title: "Loại chi phí",
    dataIndex: "type",
    key: "type",
    width: "20%",
    align: "center",
    render: (value) => {
      switch (value){
        case 'per_unit':{
          return ExpenseUnitType.per_unit
        }
        case 'constant': {
          return ExpenseUnitType.constant
        }
        default: {
          return ''
        }
      }
    }
  },
  {
    title: "Giá tiền",
    dataIndex: "price",
    key: "price",
    align: "center",
    width: "20%",
    render: (value) => formatMoney(value),
  },
];
