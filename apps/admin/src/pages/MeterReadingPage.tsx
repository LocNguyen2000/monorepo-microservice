import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Select,
  Space,
  Tag,
  Tabs,
  Typography,
  Upload,
} from "antd";
import {
  CameraOutlined,
  CheckOutlined,
  LogoutOutlined,
  ReloadOutlined,
  StopOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { UploadProps } from "antd";
import { getGlobalContext } from "../lib/context";
import { ExpenseLocationDataType } from "../lib/interface";
import InvoicePage, { InvoiceStatusTab } from "./invoice/InvoicePage";
import SchedulePage from "./schedule/SchedulePage";

interface OperatorLocation {
  locationCode: string;
  locationName: string;
  locationAddress: string;
  expenses?: ExpenseLocationDataType[];
}

interface LocationResponse {
  data: OperatorLocation[];
}

interface LocationDetailResponse extends OperatorLocation {
  expenses: ExpenseLocationDataType[];
}

interface MeterOcrResponse {
  electricMeterReading?: string | number;
}

const MeterReadingContent = () => {
  const { serviceClient, setAuthUser, useToast } = getGlobalContext();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [locations, setLocations] = useState<OperatorLocation[]>([]);
  const [locationCode, setLocationCode] = useState<string>();
  const [expenseCode, setExpenseCode] = useState<string>();
  const [reading, setReading] = useState<number>();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isLoadingExpenses, setIsLoadingExpenses] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const selectedLocation = locations.find(
    (location) => String(location.locationCode) === locationCode,
  );
  const expenses = selectedLocation?.expenses || [];
  const selectedExpense = expenses.find(
    (expense) => String(expense.expenseCode) === expenseCode,
  );
  const readingDelta =
    selectedExpense && reading !== undefined
      ? reading - Number(selectedExpense.currentUnit || 0)
      : undefined;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setIsCameraOpen(false);
  };

  const signOut = async () => {
    stopCamera();
    await serviceClient.post("auth/logout", {
      sessionId: localStorage.getItem("sessionId"),
    }).catch(() => undefined);
    setAuthUser(undefined);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    serviceClient
      .get<LocationResponse>("/location?page=1&size=20")
      .then((response) => setLocations(response.data.data))
      .catch(() => setError("Không thể tải danh sách phòng trọ."));

    return stopCamera;
  }, [serviceClient]);

  const loadLocationExpenses = async (nextLocationCode: string) => {
    setIsLoadingExpenses(true);
    setError(undefined);

    try {
      const response = await serviceClient.get<LocationDetailResponse>(
        `/location/${nextLocationCode}`,
      );
      setLocations((current) =>
        current.map((location) =>
          String(location.locationCode) === nextLocationCode
            ? { ...location, expenses: response.data.expenses }
            : location,
        ),
      );
    } catch {
      setError("Không thể tải danh sách chi phí của phòng trọ này.");
    } finally {
      setIsLoadingExpenses(false);
    }
  };

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play();
    }
  }, [isCameraOpen]);

  const startCamera = async () => {
    setError(undefined);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setError("Không thể truy cập camera. Vui lòng sử dụng tùy chọn tải ảnh lên.");
    }
  };

  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(undefined);
    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await serviceClient.post<MeterOcrResponse>(
        "/openai/process-meter-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const value = Number(response.data.electricMeterReading);
      if (!Number.isFinite(value)) throw new Error("Invalid OCR result");
      setReading(value);
      useToast("success", "Đã nhận diện chỉ số công tơ. Vui lòng kiểm tra và xác nhận.");
    } catch {
      setError("Không thể xử lý ảnh công tơ. Vui lòng thử một ảnh khác.");
    } finally {
      setIsProcessing(false);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.videoWidth === 0) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob)
        void processImage(
          new File([blob], "meter.jpg", { type: "image/jpeg" }),
        );
    }, "image/jpeg");
    stopCamera();
  };

  const uploadProps: UploadProps = {
    accept: "image/jpeg,image/png",
    showUploadList: false,
    beforeUpload: (file) => {
      void processImage(file);
      return false;
    },
  };

  const submitReading = async () => {
    if (!selectedLocation || !selectedExpense || reading === undefined) return;
    if (reading < Number(selectedExpense.currentUnit || 0)) {
      setError("Chỉ số mới không thể thấp hơn chỉ số trước đó.");
      return;
    }

    setIsSubmitting(true);
    setError(undefined);
    try {
      await serviceClient.patch(
        `/location/${selectedLocation.locationCode}/expenses/${selectedExpense.expenseCode}/meter`,
        { currentUnit: reading },
      );
      setLocations((current) =>
        current.map((location) =>
          location.locationCode === selectedLocation.locationCode
            ? {
                ...location,
                expenses: location.expenses?.map((expense) =>
                  expense.expenseCode === selectedExpense.expenseCode
                    ? { ...expense, currentUnit: reading }
                    : expense,
                ),
              }
            : location,
        ),
      );
      setReading(undefined);
      useToast("success", "Cập nhật chỉ số công tơ thành công.");
    } catch (requestError: any) {
      setError(
        requestError?.response?.data?.message ||
          "Không thể cập nhật chỉ số công tơ.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="meter-page">
      <header className="meter-page-header">
        <div>
          <Typography.Text className="meter-eyebrow">
            CẬP NHẬT TẠI CHỖ
          </Typography.Text>
          <Typography.Title level={2}>Chỉ số công tơ</Typography.Title>
          <Typography.Paragraph>
            Chụp ảnh công tơ, xác nhận chỉ số và cập nhật cho phòng trọ đã chọn.
          </Typography.Paragraph>
        </div>
        <div className="meter-status-chip">
          <span className="meter-status-dot" />
          Sẵn sàng ghi nhận
        </div>
        <Button
          className="meter-signout-button"
          icon={<LogoutOutlined />}
          onClick={signOut}
        >
          Đăng xuất
        </Button>
      </header>

      {error && <Alert type="error" showIcon message={error} />}

      <Card className="meter-selection-card" bordered={false}>
        <div className="meter-section-heading">
          <div className="meter-step">01</div>
          <div>
            <Typography.Title level={4}>Chọn thông tin cần cập nhật</Typography.Title>
            <Typography.Text type="secondary">
              Chọn phòng trọ và một loại chi phí trước khi mở camera.
            </Typography.Text>
          </div>
        </div>
        <Form layout="vertical">
          <div className="meter-selection-grid">
            <Form.Item label="Phòng trọ" required>
              <Select
                value={locationCode}
                placeholder="Chọn phòng trọ"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setLocationCode(value);
                  setExpenseCode(undefined);
                  setReading(undefined);
                  void loadLocationExpenses(value);
                }}
                options={locations.map((location) => ({
                  value: String(location.locationCode),
                  label: `${location.locationName} - ${location.locationAddress}`,
                }))}
              />
            </Form.Item>
            <Form.Item label="Chi phí" required>
              <Select
                value={expenseCode}
                disabled={!locationCode || isLoadingExpenses}
                loading={isLoadingExpenses}
                placeholder={
                  isLoadingExpenses
                    ? "Đang tải chi phí đã gán..."
                    : "Chọn chi phí"
                }
                style={{ width: "100%" }}
                onChange={(value) => {
                  setExpenseCode(value);
                  setReading(undefined);
                }}
                options={expenses.map((expense) => ({
                  value: String(expense.expenseCode),
                  label: `${expense.expenseName} (${expense.unitName})`,
                }))}
              />
            </Form.Item>
          </div>
          {selectedExpense && (
            <div className="meter-previous-reading">
              <div>
                <Typography.Text type="secondary">
                  Chỉ số trước đó
                </Typography.Text>
                <Typography.Title level={3}>
                  {selectedExpense.currentUnit ?? 0}
                  <Typography.Text type="secondary">
                    {" "}
                    {selectedExpense.unitName || "đơn vị"}
                  </Typography.Text>
                </Typography.Title>
              </div>
              <Tag color="green">Mốc hiện tại</Tag>
            </div>
          )}
        </Form>
      </Card>

      <div className="meter-workflow-grid">
        <Card className="meter-capture-card" bordered={false}>
          <div className="meter-card-heading">
            <div className="meter-step">02</div>
            <div>
              <Typography.Title level={4}>Chụp ảnh công tơ</Typography.Title>
              <Typography.Text type="secondary">
                Sử dụng camera sau hoặc tải lên một ảnh rõ nét.
              </Typography.Text>
            </div>
          </div>
          {isCameraOpen && (
            <div className="meter-camera-frame">
              <video ref={videoRef} autoPlay muted playsInline />
              <div className="meter-camera-guide" />
              <Typography.Text>
                Đưa công tơ vào đúng khung hình
              </Typography.Text>
            </div>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
          {!isCameraOpen && !isProcessing && (
            <div className="meter-empty-capture">
              <CameraOutlined />
              <Typography.Text>Chọn phương thức ghi nhận</Typography.Text>
            </div>
          )}
          <Space wrap className="meter-action-row">
            {!isCameraOpen ? (
              <Button
                icon={<CameraOutlined />}
                onClick={startCamera}
                disabled={!selectedExpense}
              >
                Mở camera
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  onClick={captureImage}
                >
                  Chụp và đọc chỉ số
                </Button>
                <Button icon={<StopOutlined />} onClick={stopCamera}>
                  Dừng
                </Button>
              </>
            )}
            <Upload
              {...uploadProps}
              disabled={!selectedExpense || isProcessing}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={!selectedExpense || isProcessing}
              >
                Tải ảnh lên
              </Button>
            </Upload>
            {isProcessing && (
              <Typography.Text type="secondary">
                Đang đọc ảnh...
              </Typography.Text>
            )}
          </Space>
        </Card>

        <Card className="meter-confirm-card" bordered={false}>
          <div className="meter-card-heading">
            <div className="meter-step">03</div>
            <div>
              <Typography.Title level={4}>Xác nhận chỉ số</Typography.Title>
              <Typography.Text type="secondary">
                Kiểm tra giá trị đã nhận diện trước khi lưu.
              </Typography.Text>
            </div>
          </div>
          <Space direction="vertical" className="meter-confirm-content">
            <InputNumber
              min={selectedExpense?.currentUnit || 0}
              precision={0}
              step={1}
              value={reading}
              onChange={(value) =>
                setReading(value === null ? undefined : value)
              }
              placeholder="Nhập hoặc điều chỉnh chỉ số"
              className="meter-reading-input"
            />
            {reading !== undefined &&
              readingDelta !== undefined &&
              readingDelta >= 0 && (
                <Typography.Text className="meter-change-note">
                  +{readingDelta} {selectedExpense?.unitName || "đơn vị"} kể từ
                    lần ghi nhận trước
                </Typography.Text>
              )}
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              loading={isSubmitting}
              disabled={!selectedExpense || reading === undefined}
              onClick={submitReading}
            >
              Cập nhật chỉ số
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

const MeterReadingPage = () => {
  const [activeTab, setActiveTab] = useState("meter");

  return (
    <div className="operator-workspace">
      <Tabs
        className="operator-workspace-tabs"
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: "meter",
            label: "Chỉ số công tơ",
            children: <MeterReadingContent />,
          },
          {
            key: "invoice",
            label: "Tạo hóa đơn",
            children: <InvoicePage />,
          },
          {
            key: "invoice-status",
            label: "Trạng thái hóa đơn",
            children: <InvoiceStatusTab />,
          },
          {
            key: "schedule",
            label: "Lịch thông báo",
            children: <SchedulePage />,
          },
        ]}
      />
    </div>
  );
};

export default MeterReadingPage;
