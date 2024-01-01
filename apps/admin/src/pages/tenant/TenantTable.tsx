import {
  SettingTwoTone,
  DeleteTwoTone,
  UserAddOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useContext, useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { tenantColumns } from "../../lib/constants/columns";
import { TenantDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import Modal from "antd/es/modal/Modal";
import { getGlobalContext } from "../../lib/context";
import TenantDetail from "./TenantDetail";
import { Typography, Divider } from "antd";

const TenantTable = () => {
  const mockTenants = [
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
    {
      tenantCode: 1,
      firstName: "Loc",
      lastName: "Nguyen Huu",
      tenantName: "Nguyen Huu Loc",
      role: "President",
      dateOfBirth: new Date(),
      genderName: "Male",
      phoneNumber: "034696172",
      email: "locnguyenhuu2k@gmail.com",
      contactAdress: "",
    },
  ] as TenantDataType[];

  const [tenants, setTenants] = useState<TenantDataType[]>(mockTenants);
  const [tenant, setTenant] = useState<Partial<TenantDataType>>({});
  const [open, setOpen] = useState(false);
  const { useToast } = getGlobalContext();

  useEffect(() => {
    console.log(tenant);
  }, [tenant]);

  const closeModal = () => {
    setOpen(false);
    setTenant({});
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem",
          alignItems: "center",
        }}
      >
        <Input
          placeholder="Enter search value here"
          style={{ width: "20rem", height: "2.5rem", marginRight: "1rem" }}
        />
        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          <UserAddOutlined /> Add
        </Button>
      </div>

      <Modal
        title={
          <div>
            <Typography>
              Tenant Form
              <Divider />
            </Typography>
          </div>
        }
        centered
        open={open}
        onOk={() => closeModal()}
        onCancel={() => closeModal()}
        width={1000}
        footer={[
          <Button key="back">Return</Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => useToast("success", "okay")}
          >
            Submit
          </Button>,
        ]}
      >
        <TenantDetail data={tenant} setData={setTenant} />
      </Modal>
      <BaseTable
        columns={tenantColumns}
        data={tenants}
        editable
        onRow={(t: TenantDataType) => {
          return {
            onDoubleClick: () => {
              setTenant(t);
              setOpen(true);
            },
          };
        }}
      />
    </>
  );
};

export default TenantTable;
