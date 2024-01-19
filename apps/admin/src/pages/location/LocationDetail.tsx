import { Button, Divider, Flex, Form, InputNumber, Select, Tag, Upload } from "antd";
import Card from "antd/es/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "antd/es/input";
import { useEffect, useState, ChangeEventHandler } from "react";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { ExpenseDataType, LocationDataType, PaginatedResponse, ProviderDataType } from "../../lib/interface";
import { debounce } from "../../lib/utils";
import { ACTION_ENUM } from "../../lib/constants";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";

const LocationDetail: React.FunctionComponent = () => {
  const [location, setLocation] = useState<Partial<LocationDataType>>({});
  const [locationExpenses, setLocationExpenses] = useState<ExpenseDataType["expenseCode"][]>([]);
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseDataType[]>([]);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.ADD);
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();
  const { setPathFromKey } = getPathContext();
  const navigate = useNavigate();

  const { search } = useLocation();

  const getExpenseData = () => {
    serviceClient
      .get(`/expense`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ExpenseDataType>) => {
        setExpenses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const returnLocationTable = () => {
    const [locationPage] = MENU_LIST.filter((i) => i.path === DASHBOARD_ROUTES.LOCATION);

    setPathFromKey(locationPage.key);

    navigate(DASHBOARD_ROUTES.LOCATION);
  };

  const formChangeHandler: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const key = e.target.attributes.getNamedItem("name").value as keyof LocationDataType;
    const value = e.target.value;

    debounce(setLocation({ ...location, [key]: value }));
  };

  const formSubmitHandler = async () => {
    try {
      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/location", location);

        useNotify("success", "New Location Added", `Submit form successfully for Location ${location.locationCode}`);
      } else if (action === ACTION_ENUM.EDIT) {
        console.log(locationExpenses);

        await serviceClient.put(`/location/${location.locationCode}`, location);
        await serviceClient.patch(`/location/${location.locationCode}`, locationExpenses);

        useNotify(
          "success",
          "Location Updated Success",
          `Submit form successfully for Location ${location.locationCode}`
        );
      }
      debounce(() => returnLocationTable(), 500);
    } catch (error) {
      console.log("Error", error);
      useNotify("error", "Location Submission Error", "Form submission failed");
    }
  };

  useEffect(() => {
    const isId = search.replace("?id=", "");

    console.log(isId);

    if (isId) {
      serviceClient
        .get(`/location/${isId}`)
        .then((res) => {
          setLocation(res.data);
          if (res.data.expenses) setLocationExpenses(res.data.expenses.map((e) => e.expenseCode));
          setAction(ACTION_ENUM.EDIT);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    serviceClient
      .get(`/rent-provider`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setProviders(response.data);

        getExpenseData();
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <Card style={{ width: "95%" }}>
      <h2>Location Detail</h2>
      <Divider />
      <Form
        labelCol={{ span: 3 }}
        layout="horizontal"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Location Code" required={true}>
          <Input
            name="locationCode"
            placeholder="Enter a number here"
            value={location.locationCode}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Location Name" required={true}>
          <Input
            name="locationName"
            placeholder="Name for location"
            value={location.locationName}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
        <Form.Item label="Address" required={true} style={{}}>
          <Input
            name="locationAddress"
            value={location.locationAddress}
            onChange={(e) => formChangeHandler(e)}
            placeholder="Enter a location here"
          />
        </Form.Item>
        <Form.Item label="Room size" required={true}>
          <InputNumber
            name="roomSize"
            value={location.roomSize}
            onChange={(v) => {
              setLocation({ ...location, roomSize: v });
            }}
            placeholder="A number of room in location"
          />
        </Form.Item>
        <Form.Item label="Image">
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="Owner">
          <Select
            showSearch
            placeholder="Select owner of location"
            value={location.owner}
            onChange={(e) => {
              setLocation({ ...location, owner: e });
            }}
          >
            {providers.map((p) => (
              <Select.Option key={p.providerCode} value={p.providerCode}>
                {p.providerName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Expense">
          <Select
            showSearch
            mode="multiple"
            placeholder="Select expenses for location"
            value={locationExpenses}
            onChange={(e) => {
              setLocationExpenses(e);
            }}
          >
            {expenses.map((p) => (
              <Select.Option key={p.expenseCode} value={p.expenseCode}>
                {p.expenseName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Description">
          <TextArea
            rows={4}
            name="description"
            placeholder="Enter description"
            value={location.description}
            onChange={(e) => formChangeHandler(e)}
          />
        </Form.Item>
      </Form>

      <Form.Item style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          style={{ marginRight: "1rem" }}
          onClick={(e) => {
            returnLocationTable();
          }}
        >
          Return
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={(e) => {
            useConfirm("confirm", "New Location", "Are you sure to submit location?", () => formSubmitHandler());
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Card>
  );
};

export default LocationDetail;
