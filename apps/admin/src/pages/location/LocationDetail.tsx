import { Button, Divider, Flex, Form, InputNumber, Select, Tag, Typography, Upload } from "antd";
import Card from "antd/es/card/Card";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "antd/es/input";
import { useEffect, useState, ChangeEventHandler } from "react";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { ExpenseDataType, ExpenseLocationDataType, LocationDataType, PaginatedResponse, ProviderDataType } from "../../lib/interface";
import { debounce } from "../../lib/utils";
import { ACTION_ENUM } from "../../lib/constants";
import { getGlobalContext, getPathContext } from "../../lib/context";
import { MENU_LIST } from "../Dashboard";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import BaseTable from "../../components/BaseTable";
import { expenseLocationColumns } from "../../lib/constants/columns";

const DEFAULT_INITIAL_UNIT = 0;
const DEFAULT_CURRENT_UNIT = 1;

const LocationDetail: React.FunctionComponent = () => {
  const [location, setLocation] = useState<Partial<LocationDataType>>({});
  const [locationExpenses, setLocationExpenses] = useState<ExpenseLocationDataType[]>([]);
  const [imageFile, setImageFile] = useState<File>();
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

  console.log("expenses", expenses);

  const updateExpense = (action: "SELECT" | "DESELECT", code: string) => {
    console.log("ACTION", action);

    switch (action) {
      case "SELECT": {
        const [selectedExpense] = expenses.filter((e) => e.expenseCode === code);
        const defaultExpense: ExpenseLocationDataType = {
          locationCode: code,
          ...selectedExpense,
          initialUnit: DEFAULT_INITIAL_UNIT,
          currentUnit: DEFAULT_CURRENT_UNIT,
        };
        setLocationExpenses([...locationExpenses, defaultExpense]);
        break;
      }
      case "DESELECT": {
        const newExpenses = locationExpenses.filter((e) => e.expenseCode !== code);
        console.log(newExpenses);

        setLocationExpenses(newExpenses);
        break;
      }
    }
  };

  const formSubmitHandler = async () => {
    try {
      const formData = new FormData();
      Object.entries(location).forEach(([key, value]) => {
        if (key !== "expenses" && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (imageFile) formData.append("image", imageFile);

      if (action === ACTION_ENUM.ADD) {
        await serviceClient.post("/location", formData);

        useNotify("success", "New Location Added", `Submit form successfully for Location ${location.locationCode}`);
      } else if (action === ACTION_ENUM.EDIT) {
        // update location
        await serviceClient.put(`/location/${location.locationCode}`, formData);
        // update expense based on location
        await serviceClient.patch(`/location/${location.locationCode}`, locationExpenses);

        useNotify("success", "Location Updated Success", `Submit form successfully for Location ${location.locationCode}`);
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
          if (res.data.expenses) {
            setLocationExpenses(res.data.expenses);
            console.log("RES EXPENSE", res.data.expenses);
          }

          setAction(ACTION_ENUM.EDIT);
          console.log("RES", res.data);
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
      <h2>Chi tiết phòng trọ</h2>
      <Divider />
      <Form
        labelCol={{ span: 3 }}
        layout="horizontal"
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Form.Item label="Mã phòng trọ" required={true}>
          <Input name="locationCode" placeholder="Enter a number here" value={location.locationCode} onChange={(e) => formChangeHandler(e)} />
        </Form.Item>
        <Form.Item label="Tên phòng trọ" required={true}>
          <Input name="locationName" placeholder="Name for location" value={location.locationName} onChange={(e) => formChangeHandler(e)} />
        </Form.Item>
        <Form.Item label="Địa chỉ" required={true} style={{}}>
          <Input name="locationAddress" value={location.locationAddress} onChange={(e) => formChangeHandler(e)} placeholder="Enter a location here" />
        </Form.Item>
        <Form.Item label="Số người ở" required={true}>
          <InputNumber
            name="roomSize"
            value={location.roomSize}
            onChange={(v) => {
              setLocation({ ...location, roomSize: v });
            }}
            placeholder="A number of room in location"
          />
        </Form.Item>
        <Form.Item label="Ảnh">
          {location.image && (
            <Typography.Link href={location.image} target="_blank" rel="noreferrer">
              Xem ảnh hiện tại
            </Typography.Link>
          )}
          <Upload
            accept="image/*"
            maxCount={1}
            beforeUpload={(file) => {
              if (file.size > 50 * 1024 * 1024) {
                useNotify("error", "Tệp quá lớn", "Kích thước tệp không được vượt quá 50 MB.");
                return Upload.LIST_IGNORE;
              }
              setImageFile(file);
              return false;
            }}
            onRemove={() => {
              setImageFile(undefined);
              return true;
            }}
            listType="picture-card"
          >
            <button style={{ border: 0, background: "none" }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>
        <Form.Item label="Chủ trọ">
          <Select
            showSearch
            placeholder="Select owner of location"
            value={location.owner}
            onChange={(e) => {
              setLocation({ ...location, owner: e });
            }}
          >
            {providers.map((p, index) => (
              <Select.Option key={index} value={p.providerCode}>
                <Tag>
                  <b>{p.providerName}</b>
                </Tag>
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Chi phí">
          <Select
            showSearch
            mode="multiple"
            placeholder="Select expenses for location"
            value={locationExpenses.map((el) => el.expenseCode)}
            style={{ marginBottom: "1rem" }}
            onDeselect={(value) => updateExpense("DESELECT", value)}
            onSelect={(value) => updateExpense("SELECT", value)}
          >
            {expenses.map((p, index) => (
              <Select.Option key={index} value={p.expenseCode}>
                {p.expenseName}
              </Select.Option>
            ))}
          </Select>

          <BaseTable columns={expenseLocationColumns} data={locationExpenses} size="small" />
        </Form.Item>
        <Form.Item label="Mô tả">
          <TextArea rows={4} name="description" placeholder="Enter description" value={location.description} onChange={(e) => formChangeHandler(e)} />
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
