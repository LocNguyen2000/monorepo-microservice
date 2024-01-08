import { useEffect, useState } from "react";
import BaseTable from "../../components/BaseTable";
import { providerColumns } from "../../lib/constants/columns";
import { ProviderDataType } from "../../lib/interface";
import Button from "antd/es/button";
import Input from "antd/es/input/Input";
import { RentProviderDetail } from "./RentProviderDetail";
import { UserAddOutlined } from "@ant-design/icons";
import { ServiceClient } from "../../lib/clients";
import Card from "antd/es/card/Card";
import { ACTION_ENUM } from "../../lib/constants";

const RentProviderList = () => {
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [provider, setProvider] = useState<ProviderDataType>({});
  const [open, setOpen] = useState(false);
  const serviceClient = ServiceClient();

  const openFormHandler = (action: ACTION_ENUM, data: ProviderDataType) => {
    if (action == ACTION_ENUM.ADD) {
      setProvider({});
      setOpen(true);
    } else if (action == ACTION_ENUM.EDIT) {
      setProvider(data);
      setOpen(true);
    } else {
      setProvider({});
      setOpen(false);
    }
  };

  useEffect(() => {
    serviceClient
      .get("/rent-providers")
      .then((res) => {
        setProviders(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Card>
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

        <Button
          type="primary"
          size="large"
          onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}
        >
          <UserAddOutlined /> Add
        </Button>
      </div>

      <RentProviderDetail
        data={provider}
        setData={setProvider}
        isOpen={open}
        setIsFormOpen={openFormHandler}
      />

      <BaseTable
        columns={providerColumns}
        data={providers}
        editable
        onRow={(p: ProviderDataType) => {
          return {
            onDoubleClick: () => openFormHandler(ACTION_ENUM.EDIT, p),
          };
        }}
      />
    </Card>
  );
};

export default RentProviderList;
