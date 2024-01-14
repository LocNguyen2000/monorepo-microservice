import { Button, Divider, Flex, Form, InputNumber, Select, Upload } from "antd";
import Card from "antd/es/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "antd/es/input";
import { useEffect, useState, ChangeEventHandler } from "react";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { LocationDataType, PaginatedResponse, ProviderDataType } from "../../lib/interface";
import { debounce } from "../../lib/utils";
import { ACTION_ENUM } from "../../lib/constants";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";

const LocationDetail: React.FunctionComponent = () => {
  const [location, setLocation] = useState<Partial<LocationDataType>>({});
  const [providers, setProviders] = useState<ProviderDataType[]>([]);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.ADD);
  const { serviceClient, useNotify, useConfirm } = getGlobalContext();
  const { setPathFromKey } = getPathContext();
  const navigate = useNavigate();

  const { search } = useLocation();

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
        await serviceClient.put(`/location/${location.locationCode}`, location);

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
          setAction(ACTION_ENUM.EDIT);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    serviceClient
      .get(`/rent-providers`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ProviderDataType>) => {
        setProviders(response.data);
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
        <Form.Item label="Location Address" required={true} style={{}}>
          <Input
            name="locationAddress"
            value={location.locationAddress}
            onChange={(e) => formChangeHandler(e)}
            placeholder="Enter a location here"
          />
        </Form.Item>
        <Form.Item label="Room Count" required={true}>
          <InputNumber
            name="roomCount"
            value={location.roomCount}
            onChange={(v) => {
              setLocation({ ...location, roomCount: v });
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
